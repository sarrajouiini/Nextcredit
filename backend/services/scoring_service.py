"""
╔══════════════════════════════════════════════════════════════════════╗
║  ScoringService — Logique de scoring partagée par les 3 objectifs   ║
║                                                                      ║
║  Stratégie colonnes manquantes :                                     ║
║    Le formulaire ne collecte que les champs utiles à l'agent.        ║
║    _fill_missing_columns() injecte une valeur neutre (0 ou médiane) ║
║    pour toutes les colonnes attendues par le preprocessor mais       ║
║    absentes du JSON reçu.  Cela évite d'alourdir le formulaire       ║
║    avec des features de mobilité / région / historique.              ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import numpy  as np
import pandas as pd
from utils.mapping import (
    GENDER_MAP, CONTRACT_MAP, CLIENT_TYPE_MAP,
    INCOME_MAP, PROFESSION_MAP, MARITAL_MAP,
    EDUCATION_MAP, HOUSING_MAP, FLAG_MAP,
)


class ScoringService:

    # ── Tables de notation ────────────────────────────────────────────────
    NOTATION_TABLES = {
        "octroi": [
            (900, "AAA", "Client très fiable",       "APPROUVE"),
            (800, "AA",  "Très bon profil",           "APPROUVE"),
            (700, "A",   "Bon profil",                "APPROUVE"),
            (600, "BBB", "Acceptable, à surveiller",  "APPROUVE"),
            (500, "BB",  "Risque important",          "REFUSE"),
            (400, "B",   "Risque élevé",              "REFUSE"),
            (0,   "CCC", "Risque très élevé",         "REFUSE"),
        ],
        "comportement": [
            (900, "AAA", "Très bonne conduite",        "MAINTENIR"),
            (800, "AA",  "Bonne conduite",              "MAINTENIR"),
            (700, "A",   "Conduite normale",            "SURVEILLER"),
            (600, "BBB", "Légère dégradation",          "SURVEILLER"),
            (500, "BB",  "Dégradation significative",   "ALERTE"),
            (400, "B",   "Risque de défaut imminent",   "ALERTE"),
            (0,   "CCC", "Défaut probable",             "CONTENTIEUX"),
        ],
        "fraude": [
            (900, "LOW",    "Risque fraude faible",  "VALIDE"),
            (700, "MEDIUM", "Risque fraude modéré",  "REVUE"),
            (400, "HIGH",   "Risque fraude élevé",   "BLOQUE"),
            (0,   "CRITIC", "Fraude très probable",  "BLOQUE"),
        ],
    }

    # ── Valeurs neutres pour colonnes non saisies dans le formulaire ──────
    # Logique :
    #   0   → flags booléens, compteurs, montants (absence = 0)
    #   0.5 → scores normalisés région/ville (valeur médiane neutre)
    #   toute colonne absente du dict reçoit sa valeur neutre ici
    COLUMN_DEFAULTS = {
        # ── Flags de possession ──────────────────────────────────────────
        "Possede_Voiture":               0,
        "Possede_Immobilier":            0,

        # ── Requêtes bureau de crédit ────────────────────────────────────
        "Req_Bureau_Credit_Heure":       0,
        "Req_Bureau_Credit_Jour":        0,
        "Req_Bureau_Credit_Semaine":     0,
        "Req_Bureau_Credit_Mois":        0,
        "Req_Bureau_Credit_Trimestre":   0,
        "Req_Bureau_Credit_An":          0,
        "Total_Req_Bureau":              0,   # recalculé en FE si les req_ sont présents
        "Ratio_Req_Recentes":            0,   # recalculé en FE

        # ── Historique crédit externe ────────────────────────────────────
        "Total_Credit_Ext":              0,
        "Total_Montant_Retard_Ext":      0,
        "Montant_Restant_Ext":           0,
        "Max_Montant_Retard_Ext":        0,
        "Max_Jours_Retard_Ext":          0,
        "Avg_Jours_Retard_Ext":          0,
        "Nb_Credits_Externes":           0,
        "Avg_Nb_Mois_Historique":        0,
        "Nb_Prolongations_Tot":          0,
        "Taux_Retard_Ext":               0,   # recalculé en FE
        "Ratio_Restant_Ext":             0,   # recalculé en FE

        # ── Mobilité géographique (flags 0/1) ────────────────────────────
        "Region_Enreg_Diff_Residence":   0,
        "Region_Enreg_Diff_Travail":     0,
        "Region_Residence_Diff_Travail": 0,
        "Ville_Enreg_Diff_Residence":    0,
        "Ville_Enreg_Diff_Travail":      0,
        "Ville_Residence_Diff_Travail":  0,
        "Mobilite_Score":                0,   # recalculé en FE

        # ── Scores région / ville (0–1 normalisés) ───────────────────────
        "Note_Region":                   0.5,
        "Note_Region_Ville":             0.5,
        "Densite_Population_Region":     0.5,
    }

    # ─────────────────────────────────────────────────────────────────────
    # TRADUCTION FR → EN
    # ─────────────────────────────────────────────────────────────────────

    @staticmethod
    def translate_input(data: dict) -> dict:
        """Convertit les labels français vers les valeurs d'entraînement EN."""
        data = dict(data)  # copie défensive

        if "Genre" in data:
            data["Genre"] = GENDER_MAP.get(data["Genre"], data["Genre"])
        if "Type_Contrat" in data:
            data["Type_Contrat"] = CONTRACT_MAP.get(data["Type_Contrat"], data["Type_Contrat"])
        if "Type_Client" in data:
            data["Type_Client"] = CLIENT_TYPE_MAP.get(data["Type_Client"], data["Type_Client"])
        if "Type_Revenu" in data:
            data["Type_Revenu"] = INCOME_MAP.get(data["Type_Revenu"], data["Type_Revenu"])
        if "Profession" in data:
            data["Profession"] = PROFESSION_MAP.get(data["Profession"], data["Profession"])
        if "Situation_Familiale" in data:
            data["Situation_Familiale"] = MARITAL_MAP.get(
                data["Situation_Familiale"], data["Situation_Familiale"]
            )
        if "Niveau_Education" in data:
            data["Niveau_Education"] = EDUCATION_MAP.get(
                data["Niveau_Education"], data["Niveau_Education"]
            )
        if "Type_Logement" in data:
            data["Type_Logement"] = HOUSING_MAP.get(data["Type_Logement"], data["Type_Logement"])

        # Possède une voiture : Oui/Non -> 1/0
        if "Possede_Voiture" in data:
            data["Possede_Voiture"] = FLAG_MAP.get(
                data["Possede_Voiture"], data["Possede_Voiture"]
            )

        # Flag crédit externe → déplie ou met à zéro les champs associés
        has_ext = data.pop("Flag_Credit_Externe", "Non")
        if has_ext != "Oui":
            for field in [
                "AMT_CREDIT_EXT", "AMT_ANNUITY_EXT",
                "CNT_PAYMENT_EXT", "DAYS_CREDIT_EXT",
            ]:
                data[field] = 0

        # Entiers
        for f in ("Nb_Enfants", "Nb_Membres_Famille"):
            if f in data:
                data[f] = int(data[f])

        return data

    # ─────────────────────────────────────────────────────────────────────
    # REMPLISSAGE DES COLONNES MANQUANTES
    # ─────────────────────────────────────────────────────────────────────

    @classmethod
    def _fill_missing_columns(cls, df: pd.DataFrame) -> pd.DataFrame:
        """
        Injecte une valeur neutre pour chaque colonne attendue par le
        preprocessor mais absente du DataFrame issu du formulaire.

        Cette méthode est appelée juste AVANT preprocessor.transform()
        afin que sklearn ne lève pas de KeyError sur les colonnes manquantes.

        Règle : on ne remplace jamais une valeur déjà présente.
        """
        for col, default in cls.COLUMN_DEFAULTS.items():
            if col not in df.columns:
                df[col] = default
        return df

    # ─────────────────────────────────────────────────────────────────────
    # PIPELINE PRINCIPAL
    # ─────────────────────────────────────────────────────────────────────

    @classmethod
    def predict(cls, bundle: dict, raw_data: dict, objectif: str) -> dict:
        """
        Pipeline complet : JSON → traduction → FE → colonnes neutres
                           → preprocessor → modèle → notation.
        """
        # Étape 0 : Traduction FR → EN
        translated = cls.translate_input(raw_data)

        # Étape 1 : Feature engineering (ratios, agrégats…)
        df = cls._feature_engineering(pd.DataFrame([translated]), objectif)

        # Étape 2 : Injection des colonnes manquantes avec valeurs neutres
        df = cls._fill_missing_columns(df)

        # Étape 3 : Prétraitement sklearn
        preprocessor = bundle.get("preprocessor")
        if preprocessor is not None:
            # Réordonner les colonnes selon ce que le preprocessor attend
            expected_cols = cls._get_preprocessor_columns(preprocessor)
            if expected_cols:
                # Ajouter les colonnes manquantes restantes avec 0
                for c in expected_cols:
                    if c not in df.columns:
                        df[c] = 0
                df = df[expected_cols]
            X_prep = preprocessor.transform(df)
        else:
            X_prep = df.select_dtypes(include=[np.number]).fillna(0).values

        # Étape 4 : Prédiction
        model    = bundle["model"]
        pd_value = float(model.predict_proba(X_prep)[0, 1])

        # Étape 5 : Score /1000 → Notation
        score    = int(np.clip(round((1 - pd_value) * 1000), 0, 1000))
        notation, label, decision = cls._get_notation(score, objectif)

        threshold = bundle.get("threshold", 0.5)
        if objectif == "octroi":
            decision = "APPROUVE" if pd_value < threshold else "REFUSE"

        # Étape 6 : Indicateurs clés pour l'affichage Angular
        indicateurs = cls._compute_indicateurs(df, translated, objectif)

        return {
            "pd_value":    round(pd_value, 6),
            "score":       score,
            "notation":    notation,
            "label":       label,
            "decision":    decision,
            "threshold":   round(threshold, 4),
            "indicateurs": indicateurs,
            "X_prep":      X_prep,
        }

    # ─────────────────────────────────────────────────────────────────────
    # HELPERS INTERNES
    # ─────────────────────────────────────────────────────────────────────

    @staticmethod
    def _get_preprocessor_columns(preprocessor) -> list:
        """
        Tente d'extraire la liste ordonnée des colonnes attendues par le
        ColumnTransformer sklearn.  Retourne [] si non déterminable.
        """
        try:
            # sklearn >= 1.0 : feature_names_in_
            return list(preprocessor.feature_names_in_)
        except AttributeError:
            pass
        try:
            # Accès aux noms depuis les transformers internes
            cols = []
            for _, _, c in preprocessor.transformers_:
                if isinstance(c, list):
                    cols.extend(c)
            return cols if cols else []
        except Exception:
            return []

    @classmethod
    def _feature_engineering(cls, df: pd.DataFrame, objectif: str) -> pd.DataFrame:
        """Feature engineering identique au notebook Jupyter."""

        # Ratio d'endettement
        if "Mensualite" in df.columns and "Revenu_Total" in df.columns:
            df["Ratio_Endettement"] = df["Mensualite"] / (df["Revenu_Total"] + 1)

        # LTV
        if "Montant_Credit" in df.columns and "Prix_Bien" in df.columns:
            df["Ratio_LTV"] = df["Montant_Credit"] / (df["Prix_Bien"] + 1)

        # Ratio montant / revenu
        if "Montant_Credit" in df.columns and "Revenu_Total" in df.columns:
            df["Ratio_Montant_Revenu"] = df["Montant_Credit"] / (df["Revenu_Total"] + 1)

        # Scores bureau
        score_cols = ["Score_Externe_1", "Score_Externe_2", "Score_Externe_3"]
        if all(c in df.columns for c in score_cols):
            df["Score_Externe_Moyen"] = df[score_cols].mean(axis=1)
            df["Score_Externe_Min"]   = df[score_cols].min(axis=1)
            df["Score_Externe_Std"]   = df[score_cols].std(axis=1).fillna(0)

        # Requêtes bureau (si présentes — sinon les défauts à 0 sont déjà là)
        req_cols = ["Req_Bureau_Credit_Heure", "Req_Bureau_Credit_Jour",
                    "Req_Bureau_Credit_Semaine", "Req_Bureau_Credit_Mois",
                    "Req_Bureau_Credit_Trimestre", "Req_Bureau_Credit_An"]
        if all(c in df.columns for c in req_cols):
            df["Total_Req_Bureau"]   = df[req_cols].sum(axis=1)
            df["Ratio_Req_Recentes"] = (
                df["Req_Bureau_Credit_Heure"] + df["Req_Bureau_Credit_Jour"]
            ) / (df["Total_Req_Bureau"] + 1)

        # Charge familiale
        if "Nb_Enfants" in df.columns and "Nb_Membres_Famille" in df.columns:
            df["Charge_Familiale"]  = df["Nb_Enfants"] / (df["Nb_Membres_Famille"] + 1)
            df["Revenu_Par_Membre"] = df.get("Revenu_Total", pd.Series([1])) / (
                df["Nb_Membres_Famille"] + 1
            )

        # Historique crédit externe (si colonnes présentes)
        if "Total_Montant_Retard_Ext" in df.columns and "Total_Credit_Ext" in df.columns:
            df["Taux_Retard_Ext"]   = df["Total_Montant_Retard_Ext"] / (df["Total_Credit_Ext"] + 1)
            df["Ratio_Restant_Ext"] = df.get("Montant_Restant_Ext", pd.Series([0])) / (
                df["Total_Credit_Ext"] + 1
            )

        # Mobilité (si colonnes présentes)
        mob_cols = ["Region_Enreg_Diff_Residence", "Region_Enreg_Diff_Travail",
                    "Ville_Enreg_Diff_Residence", "Ville_Enreg_Diff_Travail"]
        if all(c in df.columns for c in mob_cols):
            df["Mobilite_Score"] = df[mob_cols].sum(axis=1)

        # Comportemental
        if objectif == "comportement":
            if "Total_montant_retard" in df.columns and "Montant_Credit" in df.columns:
                df["Taux_Retard_Portefeuille"] = df["Total_montant_retard"] / (
                    df["Montant_Credit"] + 1
                )
            if "Avg_Jours_Retard" in df.columns:
                df["Retard_Critique"] = (df["Avg_Jours_Retard"] > 30).astype(int)

        # Fraude
        if objectif == "fraude":
            if "Montant_Transaction" in df.columns and "Revenu_Total" in df.columns:
                df["Ratio_Transaction_Revenu"] = df["Montant_Transaction"] / (
                    df["Revenu_Total"] + 1
                )

        return df

    @classmethod
    def _get_notation(cls, score: int, objectif: str):
        table = cls.NOTATION_TABLES.get(objectif, cls.NOTATION_TABLES["octroi"])
        for seuil, notation, label, decision in table:
            if score >= seuil:
                return notation, label, decision
        return "CCC", "Risque extrême", "REFUSE"

    @classmethod
    def _compute_indicateurs(cls, df: pd.DataFrame, raw: dict, objectif: str) -> dict:
        indicateurs = {}

        if "Ratio_Endettement" in df.columns:
            val = float(df["Ratio_Endettement"].iloc[0])
            indicateurs["ratio_endettement"] = {
                "valeur":   round(val * 100, 1),
                "unite":    "%",
                "seuil_ok": 35,
                "status":   "OK" if val * 100 < 35 else "ATTENTION",
            }

        if "Ratio_LTV" in df.columns:
            val = float(df["Ratio_LTV"].iloc[0])
            indicateurs["ratio_ltv"] = {
                "valeur":   round(val * 100, 1),
                "unite":    "%",
                "seuil_ok": 80,
                "status":   "OK" if val * 100 < 80 else "ATTENTION",
            }

        if "Score_Externe_Moyen" in df.columns:
            val_brut = float(df["Score_Externe_Moyen"].iloc[0])
            # Score_Externe_1/2/3 sont normalisés entre 0 et 1.
            # On remet à l'échelle /900 avant d'afficher et de comparer
            # au seuil — sinon round(0.64, 0) donne 1 au lieu de 579,
            # et le statut serait toujours ATTENTION (0-1 < 600).
            val_900 = val_brut * 900
            indicateurs["score_bureau"] = {
                "valeur":   round(val_900, 0),
                "unite":    "/ 900",
                "seuil_ok": 600,
                "status":   "OK" if val_900 >= 600 else "ATTENTION",
            }

        val = float(raw.get("Req_Bureau_Credit_An", 0))
        indicateurs["req_bureau_an"] = {
            "valeur":   val,
            "unite":    "req/an",
            "seuil_ok": 5,
            "status":   "OK" if val <= 5 else "ATTENTION",
        }

        if "Nb_Membres_Famille" in raw:
            val = int(raw.get("Nb_Membres_Famille", 1))
            indicateurs["nb_membres_famille"] = {
                "valeur":   val,
                "unite":    "personnes",
                "seuil_ok": 6,
                "status":   "OK" if val <= 6 else "ATTENTION",
            }

        return indicateurs