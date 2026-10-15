"""
╔══════════════════════════════════════════════════════════════════════╗
║  XAIService — Service d'Explicabilité (SHAP + LIME)  [VERSION CORRIGÉE]║
║                                                                        ║
║  Corrige 4 bugs critiques de la version précédente :                  ║
║    1. La clé du bundle est 'feature_names', PAS 'features'            ║
║       → les explications tombaient toujours en demo_mode (fausses).   ║
║    2. L'explainer était None dans le bundle octroi                    ║
║       → on le construit à la volée et on le met en cache.             ║
║    3. Les noms (57) ne matchaient pas la dimension SHAP (101 après    ║
║       OneHotEncoder) → on utilise preprocessor.get_feature_names_out. ║
║    4. background_data LIME était en RAW (57) alors que X_prep est en  ║
║       (101) → on le transforme via le preprocessor.                   ║
║                                                                        ║
║  Enrichissements « intelligence » :                                    ║
║    - Noms techniques (num__Score_Externe_3) → libellés métier FR      ║
║    - reason_codes : top facteurs de risque / de protection en clair   ║
║    - explication en langage naturel pour l'agent                      ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import numpy as np
import shap
from lime.lime_tabular import LimeTabularExplainer


# ══════════════════════════════════════════════════════════════════════
#  Libellés métier : transforme les noms techniques en français lisible
#  Complète ce dictionnaire avec tes features ; tout nom absent est
#  nettoyé automatiquement (préfixes num__/cat__ retirés, _ → espaces).
# ══════════════════════════════════════════════════════════════════════
FEATURE_LABELS_FR = {
    "Ratio_Endettement":        "Taux d'endettement",
    "Ratio_LTV":                "Ratio prêt / valeur du bien (LTV)",
    "Ratio_Montant_Revenu":     "Montant du crédit rapporté au revenu",
    "Score_Externe_Moyen":      "Score bureau moyen",
    "Score_Externe_1":          "Score bureau n°1",
    "Score_Externe_2":          "Score bureau n°2",
    "Score_Externe_3":          "Score bureau n°3",
    "Score_Externe_Min":        "Score bureau minimum",
    "Total_Req_Bureau":         "Nombre de requêtes bureau de crédit",
    "Ratio_Req_Recentes":       "Part de requêtes bureau récentes",
    "Req_Bureau_Credit_Trimestre": "Requêtes bureau (trimestre)",
    "Req_Bureau_Credit_An":     "Requêtes bureau (année)",
    "Nb_Credits_Externes":      "Nombre de crédits externes",
    "Taux_Retard_Ext":          "Taux de retard sur crédits externes",
    "Ratio_Restant_Ext":        "Encours restant sur crédits externes",
    "Montant_Restant_Ext":      "Montant restant dû (externe)",
    "Revenu_Total":             "Revenu total",
    "Mensualite":               "Mensualité",
    "Montant_Credit":           "Montant du crédit",
    "Charge_Familiale":         "Charge familiale",
    "Revenu_Par_Membre":        "Revenu par membre du foyer",
    "Age":                      "Âge",
    "Mobilite_Score":           "Score de mobilité géographique",
}


def humanize_feature(raw_name: str) -> str:
    """Convertit 'num__Score_Externe_3' → 'Score bureau n°3'.

    Pour les variables catégorielles encodées en one-hot,
    'cat__Type_Contrat_Cash loans' devient 'Type contrat = Cash loans'.
    """
    name = raw_name
    # Retirer le préfixe du ColumnTransformer (num__ / cat__ / remainder__)
    for prefix in ("num__", "cat__", "remainder__"):
        if name.startswith(prefix):
            name = name[len(prefix):]
            is_cat = prefix == "cat__"
            break
    else:
        is_cat = False

    # Si on a un libellé métier exact, l'utiliser
    if name in FEATURE_LABELS_FR:
        return FEATURE_LABELS_FR[name]

    # Variable catégorielle one-hot : "Type_Contrat_Cash loans"
    if is_cat:
        # Tenter de séparer "Colonne_Valeur" sur les libellés connus
        for base, label in FEATURE_LABELS_FR.items():
            if name.startswith(base + "_"):
                modalite = name[len(base) + 1:]
                return f"{label} = {modalite}"
        # Fallback générique : remplacer le dernier _ par " = "
        if "_" in name:
            base, _, modalite = name.rpartition("_")
            return f"{base.replace('_', ' ')} = {modalite}"

    # Fallback : nettoyer les underscores
    return name.replace("_", " ")


class XAIService:
    """Calcule les explications SHAP et LIME pour une observation."""

    # ─────────────────────────────────────────────────────────────────
    #  HELPERS DE RÉSOLUTION DU BUNDLE (corrigent les bugs structurels)
    # ─────────────────────────────────────────────────────────────────

    @staticmethod
    def _resolve_feature_names(bundle: dict, n_expected: int) -> list:
        """Récupère les noms de features qui MATCHENT la dimension de X_prep.

        Ordre de priorité :
          1. preprocessor.get_feature_names_out()  (le plus fiable : 101 noms)
          2. bundle['feature_names'] ou bundle['features'] si la taille colle
          3. noms génériques f0..fn en dernier recours
        """
        prep = bundle.get("preprocessor")
        if prep is not None:
            try:
                out = list(prep.get_feature_names_out())
                if len(out) == n_expected:
                    return out
            except Exception:
                pass

        for key in ("feature_names", "features"):
            feats = bundle.get(key)
            if feats is not None and len(feats) == n_expected:
                return list(feats)

        # Dernier recours
        return [f"f{i}" for i in range(n_expected)]

    @staticmethod
    def _get_or_build_tree_explainer(bundle: dict):
        """Retourne l'explainer SHAP, le construit et le met en cache si absent.

        Évite de reconstruire l'explainer à chaque requête : il est stocké
        dans le bundle (gardé en mémoire par ModelLoader pendant tout le
        cycle de vie du serveur).
        """
        explainer = bundle.get("explainer")
        if explainer is not None:
            return explainer

        model = bundle["model"]
        explainer = shap.TreeExplainer(model)
        bundle["explainer"] = explainer   # cache pour les prochains appels
        return explainer

    # ─────────────────────────────────────────────────────────────────
    #  SHAP
    # ─────────────────────────────────────────────────────────────────

    @staticmethod
    def explain_shap(bundle: dict, X_prep: np.ndarray, top_n: int = 10) -> dict:
        """Calcule les valeurs SHAP RÉELLES pour une observation preprocessée."""
        n_features = X_prep.shape[1]
        features   = XAIService._resolve_feature_names(bundle, n_features)
        explainer  = XAIService._get_or_build_tree_explainer(bundle)

        # ── Calcul SHAP ───────────────────────────────────────────────
        shap_vals = explainer.shap_values(X_prep)

        # Classification binaire : list [classe_0, classe_1] (RF) ou array (XGB)
        if isinstance(shap_vals, list):
            vals = np.asarray(shap_vals[1])[0]
        else:
            arr = np.asarray(shap_vals)
            # shape (1, n) → ligne 0 ; shape (1, n, 2) → classe 1
            vals = arr[0, :, 1] if arr.ndim == 3 else arr[0]

        # ── Valeur de base ────────────────────────────────────────────
        base = explainer.expected_value
        if isinstance(base, (list, np.ndarray)):
            base = float(np.atleast_1d(base)[-1])
        else:
            base = float(base)

        # ── Construction des items ────────────────────────────────────
        items = [
            {
                "feature":      humanize_feature(feat),
                "feature_raw":  feat,
                "shap_value":   round(float(v), 6),
                "input_value":  round(float(X_prep[0, i]), 4),
                "direction":    "risque" if v > 0 else "protection",
            }
            for i, (feat, v) in enumerate(zip(features, vals))
        ]
        items_sorted = sorted(items, key=lambda x: abs(x["shap_value"]), reverse=True)
        top_items    = items_sorted[:top_n]

        return {
            "base_value":     round(base, 6),
            "shap_values":    top_items,
            "total_features": len(features),
            "reason_codes":   XAIService._build_reason_codes(items_sorted),
            "explication":    XAIService._build_nl_explanation(items_sorted),
        }

    # ─────────────────────────────────────────────────────────────────
    #  LIME
    # ─────────────────────────────────────────────────────────────────

    @staticmethod
    def explain_lime(bundle: dict, X_train_sample, X_prep: np.ndarray,
                     top_n: int = 10) -> dict:
        """Explication LIME, avec correction de la dimension du background.

        Le background stocké est en espace RAW (avant preprocessing).
        On le transforme via le preprocessor pour qu'il ait la même
        dimension que X_prep (sinon LIME plante ou renvoie n'importe quoi).
        """
        model      = bundle["model"]
        n_features = X_prep.shape[1]
        features   = XAIService._resolve_feature_names(bundle, n_features)

        bg = X_train_sample if X_train_sample is not None else bundle.get("background_data")
        if bg is None:
            return XAIService._demo_lime(features, top_n)

        # Aligner la dimension du background sur X_prep
        bg_arr = np.asarray(bg)
        if bg_arr.shape[1] != n_features:
            prep = bundle.get("preprocessor")
            if prep is not None:
                bg_arr = np.asarray(prep.transform(bg))
            else:
                return XAIService._demo_lime(features, top_n)

        lime_exp = LimeTabularExplainer(
            training_data = bg_arr,
            feature_names = features,
            class_names   = ["Sain", "Defaut"],
            mode          = "classification",
            random_state  = 42,
        )
        explanation = lime_exp.explain_instance(
            data_row     = X_prep[0],
            predict_fn   = model.predict_proba,
            num_features = top_n,
        )

        items = [
            {
                "feature":   humanize_feature(feat),
                "weight":    round(float(weight), 6),
                "direction": "risque" if weight > 0 else "protection",
            }
            for feat, weight in explanation.as_list()
        ]
        return {
            "lime_values":    items,
            "score_classe_1": round(float(explanation.predict_proba[1]), 4),
            "intercept":      round(float(explanation.intercept[1]), 6),
        }

    # ─────────────────────────────────────────────────────────────────
    #  INTELLIGENCE : reason codes + langage naturel
    # ─────────────────────────────────────────────────────────────────

    @staticmethod
    def _build_reason_codes(items_sorted: list) -> dict:
        """Sépare les 3 principaux facteurs de RISQUE et de PROTECTION.

        C'est l'équivalent des « adverse action codes » exigés par la
        réglementation : on doit pouvoir dire au client POURQUOI.
        """
        risques     = [i for i in items_sorted if i["direction"] == "risque"][:3]
        protections = [i for i in items_sorted if i["direction"] == "protection"][:3]
        return {
            "facteurs_risque": [
                {"feature": r["feature"], "impact": r["shap_value"]} for r in risques
            ],
            "facteurs_protection": [
                {"feature": p["feature"], "impact": p["shap_value"]} for p in protections
            ],
        }

    @staticmethod
    def _build_nl_explanation(items_sorted: list) -> str:
        """Génère une phrase explicative pour l'agent."""
        risques     = [i for i in items_sorted if i["direction"] == "risque"][:2]
        protections = [i for i in items_sorted if i["direction"] == "protection"][:2]

        parts = []
        if risques:
            noms = ", ".join(r["feature"].lower() for r in risques)
            parts.append(f"Les principaux facteurs qui augmentent le risque sont : {noms}")
        if protections:
            noms = ", ".join(p["feature"].lower() for p in protections)
            parts.append(f"À l'inverse, {noms} jouent en faveur du client")

        return ". ".join(parts) + "." if parts else "Aucun facteur dominant identifié."

    # ─────────────────────────────────────────────────────────────────
    #  Modes démo (conservés pour la robustesse)
    # ─────────────────────────────────────────────────────────────────

    @staticmethod
    def _demo_lime(features: list, top_n: int) -> dict:
        np.random.seed(99)
        weights = np.random.uniform(-0.2, 0.2, min(top_n, len(features)))
        return {
            "lime_values": [
                {"feature": humanize_feature(f), "weight": round(float(w), 6),
                 "direction": "risque" if w > 0 else "protection"}
                for f, w in zip(features[:top_n], weights)
            ],
            "score_classe_1": 0.15,
            "intercept":      0.07,
            "demo_mode":      True,
        }
