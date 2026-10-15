"""Routes — Scoring Comportemental [SA_CREDIT — moteur SA_ENGINE]"""
import os
import numpy as np
import pandas as pd
from flask import Blueprint, request, current_app, render_template
from sqlalchemy import text
from services.xai_service   import XAIService
from services.dwh_service   import fetch_client, build_client_info, feature_engineering
from services.bale_service  import BaleService
from utils.response_builder import build_success, build_error
from flask_jwt_extended import jwt_required

comportement_bp = Blueprint("comportement", __name__)

# ── Liste des clients à risque élevé — chargée depuis un export Excel ──
# Le fichier contient le scoring comportemental déjà calculé (Score, PD%,
# Notation, Decision) pour tous les clients à risque. On le charge une
# seule fois en mémoire au premier appel puis on le garde en cache.
_RISQUE_XLSX_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data", "clients_risque_eleve.xlsx"
)
_risque_df_cache = None


def _get_risque_df():
    global _risque_df_cache
    if _risque_df_cache is None:
        df = pd.read_excel(_RISQUE_XLSX_PATH)
        df = df.sort_values("PD_%", ascending=False).reset_index(drop=True)
        _risque_df_cache = df
    return _risque_df_cache


NOTATION = [(900,"AAA","Très bonne conduite","MAINTENIR"),(800,"AA","Bonne conduite","MAINTENIR"),
            (700,"A","Conduite normale","SURVEILLER"),(600,"BBB","Légère dégradation","SURVEILLER"),
            (500,"BB","Dégradation modérée","ALERTE"),(400,"B","Dégradation sévère","ALERTE"),
            (0,"CCC","Défaut probable","CONTENTIEUX")]


def _score_dataframe(bundle, df_client):
    pre=bundle["preprocessor"]; model=bundle["model"]; threshold=float(bundle.get("threshold",0.5))
    ALL_FEATS=[c for c in bundle.get("num_cols",[])+bundle.get("cat_cols",[]) if c in df_client.columns]
    X_prep=pre.transform(df_client[ALL_FEATS].fillna(0)).astype(np.float32)
    pd_val=float(model.predict_proba(X_prep)[0,1]); score=int((1-pd_val)*1000)
    notation=label=decision=None
    for seuil,note,lbl,dec in NOTATION:
        if score>=seuil: notation,label,decision=note,lbl,dec; break
    return {"pd_value":round(pd_val,6),"score":score,"notation":notation,"label":label,
            "decision":decision,"threshold":threshold,"X_prep":X_prep}


def _calcul_indicateurs(row):
    try:
        m=float(row.get("Mensualite",0) or 0); r=float(row.get("Revenu_Total",1) or 1)
        retard_m3=float(row.get("Avg_Retard_M3",0) or 0)
        ratio_paie=float(row.get("Ratio_Paiement_Global",1) or 1)
        je=float(row.get("Jours_Retard_Bureau_Max",0) or 0)
        # Score_Externe_1/2/3 sont normalisés entre 0 et 1 dans SA_Application.
        # On les remet à l'échelle /900 pour cohérence avec le label affiché
        # et avec les seuils de statut (600/400) définis plus bas.
        sc=(float(row.get("Score_Externe_1",0) or 0)+float(row.get("Score_Externe_2",0) or 0)
            +float(row.get("Score_Externe_3",0) or 0))/3 * 900

        # Plafonner l'affichage à 100% — un sur-paiement (paiement groupé
        # ou anticipé) ne doit jamais afficher plus de 100% à l'agent.
        ratio_paie_affiche = min(ratio_paie, 1.0)

        # Clamp à 0 jours pour l'affichage — un retard négatif signifie que
        # le client paie en avance, ce qui n'est pas un "retard" à afficher
        # comme tel dans ce KPI. La valeur brute (négative) reste disponible
        # ailleurs (ex: recommandation IA) pour l'interprétation fine.
        retard_m3_affiche = max(retard_m3, 0.0)

        return {
            "taux_paiement":{"valeur":f"{round(ratio_paie_affiche*100,1)}%","unite":"",
                "status":"OK" if ratio_paie_affiche>=0.9 else ("WARN" if ratio_paie_affiche>=0.6 else "ATTN")},
            "taux_retard":{"valeur":f"{round(retard_m3_affiche,1)}","unite":"jours",
                "status":"OK" if retard_m3_affiche==0 else ("WARN" if retard_m3_affiche<=15 else "ATTN")},
            "retard_externe":{"valeur":f"{int(je)}","unite":"jours",
                "status":"OK" if je==0 else ("WARN" if je<=30 else "ATTN")},
            "score_bureau":{"valeur":int(sc),"unite":"/900",
                "status":"OK" if sc>=600 else ("WARN" if sc>=400 else "ATTN")},
            "pression_fin":{"valeur":f"{round(m/r*100,1)}%","unite":"",
                "status":"OK" if m/r<=0.35 else ("WARN" if m/r<=0.45 else "ATTN")},
        }
    except Exception:
        return {}


@comportement_bp.route("/ui", methods=["GET"])
def comportement_ui():
    return render_template("comportement.html")


@comportement_bp.route("/risque-eleve", methods=["GET"])
def risque_eleve_ui():
    return render_template("risque_eleve.html")


@comportement_bp.route("/liste-a-risque", methods=["GET"])
@jwt_required()
def liste_a_risque():
    try:
        top_n = min(request.args.get("top_n", request.args.get("limit", 50, type=int), type=int), 5854)
        decision_filtre = request.args.get("decision")  # 'ALERTE' | 'CONTENTIEUX' | None

        df = _get_risque_df()
        if decision_filtre:
            df = df[df["Decision"] == decision_filtre.upper()]

        df_top = df.head(top_n)

        clients = []
        for _, row in df_top.iterrows():
            clients.append({
                "client_code":    row["ClientCode"],
                "score":          int(row["Score"]),
                "pd_pct":         round(float(row["PD_%"]), 2),
                "notation":       row["Notation"],
                "decision":       row["Decision"],
                "avg_retard":     int(row["Avg_Retard_M3"]),
                "max_retard":     int(row["Max_Retard_Global"]),
                "nb_retards":     int(row["Nb_Retards_M3"]),
                "ratio_paiement": round(float(row["Ratio_Paiement_M3"]) * 100, 1),
                "montant_credit": float(row["Montant_Credit"]),
            })

        return build_success({
            "clients": clients,
            "total":   len(clients),
            "scannes": len(df),
        }, objectif="comportement")

    except Exception as e:
        current_app.logger.error(f"[comportement/liste-a-risque] {e}")
        return build_error(str(e), 500)


@comportement_bp.route("/predict", methods=["POST"])
@jwt_required()  
def predict():
    try:
        body = request.get_json()
        if not body or "client_code" not in body:
            return build_error("client_code manquant", 400)
        client_code = str(body["client_code"]).strip()
        engine = current_app.config.get("SA_ENGINE")
        if not engine:
            return build_error("Connexion SA_CREDIT non configurée", 503)
        df_client = fetch_client(engine, client_code)
        row = df_client.iloc[0]
        bundle = current_app.config["MODEL_LOADER"].get("comportement")
        result = _score_dataframe(bundle, df_client)
        result["indicateurs"] = _calcul_indicateurs(row)
        result["client_info"] = build_client_info(row)

        # ── Indicateurs Bâle II / score de recouvrement ────────────────
        bale = BaleService.compute(
            row.to_dict(), result["pd_value"], result["threshold"]
        )
        result["recouvrement"] = {
            "score_recouvrement": bale["score_recouvrement"],
            "lgd_pct":            bale["lgd_pct"],
            "ead_value":          bale["ead_value"],
            "el_value":           bale["el_value"],
            "ul_value":           bale["ul_value"],
        }

        # ── Recommandations métier instantanées (sans IA) ──────────────
        result["recommandations"] = _recommandation_regles(
            row, result["score"], result["decision"], bale
        )

        result.pop("X_prep", None)
        return build_success(result, objectif="comportement")
    except ValueError as e:
        return build_error(str(e), 404)
    except Exception as e:
        current_app.logger.error(f"[comportement/predict] {e}")
        return build_error(str(e), 500)


@comportement_bp.route("/explain/shap", methods=["POST"])
@jwt_required()  
def explain_shap():
    try:
        body = request.get_json()
        client_code = str(body.get("client_code", "")).strip()
        engine = current_app.config.get("SA_ENGINE")
        if not engine:
            return build_error("Connexion SA_CREDIT non configurée", 503)
        df_client = fetch_client(engine, client_code)
        bundle = current_app.config["MODEL_LOADER"].get("comportement")
        result = _score_dataframe(bundle, df_client)
        shap_res = XAIService.explain_shap(
            bundle, result["X_prep"], top_n=request.args.get("top_n", 6, type=int)
        )
        shap_res.update({
            "pd_value": result["pd_value"], "score": result["score"],
            "notation": result["notation"], "decision": result["decision"],
        })
        return build_success(shap_res, objectif="comportement")
    except ValueError as e:
        return build_error(str(e), 404)
    except Exception as e:
        return build_error(str(e), 500)


@comportement_bp.route("/explain/lime", methods=["POST"])
@jwt_required()  
def explain_lime():
    try:
        body = request.get_json()
        client_code = str(body.get("client_code", "")).strip()
        engine = current_app.config.get("SA_ENGINE")
        if not engine:
            return build_error("Connexion SA_CREDIT non configurée", 503)
        df_client = fetch_client(engine, client_code)
        bundle = current_app.config["MODEL_LOADER"].get("comportement")
        result = _score_dataframe(bundle, df_client)
        lime_res = XAIService.explain_lime(
            bundle, bundle.get("background_data"), result["X_prep"],
            top_n=request.args.get("top_n", 6, type=int)
        )
        return build_success(lime_res, objectif="comportement")
    except ValueError as e:
        return build_error(str(e), 404)
    except Exception as e:
        return build_error(str(e), 500)


@comportement_bp.route("/historique-paiements", methods=["GET"])
@jwt_required()  

def historique_paiements():
    """
    Retourne l'historique mensuel des échéances d'un client, pour
    affichage en grille calendrier (style "DisputeFox payment history").

    Query param : client_code (ex: CLIE308801)

    Réponse :
        {
          "annees": [
            {"annee": 2025, "mois": [
                {"mois": 1, "statut": "ok"},      # payé à temps
                {"mois": 2, "statut": "late"},    # payé en retard
                {"mois": 3, "statut": "none"},    # pas d'échéance ce mois
                ...
            ]},
            ...
          ],
          "taux_paiement_pct": 83.6
        }
    """
    try:
        from services.dwh_service import client_code_to_id

        client_code = request.args.get("client_code", "").strip()
        if not client_code:
            return build_error("client_code manquant", 400)

        id_demande = client_code_to_id(client_code)
        engine = current_app.config.get("SA_ENGINE")
        if not engine:
            return build_error("Connexion SA_CREDIT non configurée", 503)

        query = text("""
            SELECT
                YEAR(Date_Echeance_Prevue)  AS Annee,
                MONTH(Date_Echeance_Prevue) AS Mois,
                CASE WHEN DATEDIFF(DAY, Date_Echeance_Prevue,
                          ISNULL(Date_Paiement_Reel, Date_Echeance_Prevue)) > 0
                     THEN 1 ELSE 0 END       AS EnRetard
            FROM Sa_InstallementPayment
            WHERE Id_Demande = :id_demande
            ORDER BY Annee, Mois
        """)

        with engine.connect() as conn:
            df = pd.read_sql(query, conn, params={"id_demande": id_demande})

        if df.empty:
            return build_success({
                "annees": [], "taux_paiement_pct": None
            }, objectif="comportement")

        # Une échéance par mois max pour l'affichage calendrier
        # (si plusieurs échéances le même mois, on garde le pire statut)
        df_mois = (
            df.groupby(["Annee", "Mois"])["EnRetard"]
              .max()
              .reset_index()
        )

        annees_list = []
        for annee in sorted(df_mois["Annee"].unique()):
            sous = df_mois[df_mois["Annee"] == annee]
            mois_dict = dict(zip(sous["Mois"], sous["EnRetard"]))
            mois_arr = []
            for m in range(1, 13):
                if m in mois_dict:
                    statut = "late" if mois_dict[m] == 1 else "ok"
                else:
                    statut = "none"
                mois_arr.append({"mois": m, "statut": statut})
            annees_list.append({"annee": int(annee), "mois": mois_arr})

        taux = round((1 - df["EnRetard"].mean()) * 100, 1) if len(df) else None

        return build_success({
            "annees": annees_list,
            "taux_paiement_pct": taux,
        }, objectif="comportement")

    except ValueError as e:
        return build_error(str(e), 404)
    except Exception as e:
        current_app.logger.error(f"[comportement/historique-paiements] {e}")
        return build_error(str(e), 500)


def _recommandation_regles(row, score, decision, bale) -> list:
    """
    Génère des recommandations métier instantanées (pas d'IA, pas d'appel
    réseau) à partir de règles simples sur les indicateurs du client.
    Toujours disponible, sert de recommandation par défaut.
    """
    recos = []

    retard_m3 = float(row.get("Avg_Retard_M3", 0) or 0)
    je        = float(row.get("Jours_Retard_Bureau_Max", 0) or 0)
    lgd_pct   = bale.get("lgd_pct", 0)
    ead       = bale.get("ead_value", 0)

    if decision == "CONTENTIEUX":
        recos.append({
            "priorite": "HAUTE",
            "texte": "Transférer le dossier au service contentieux sans délai — "
                     "probabilité de défaut critique.",
        })
        if ead > 0:
            recos.append({
                "priorite": "HAUTE",
                "texte": f"Geler toute nouvelle ligne de crédit — exposition actuelle "
                         f"de {ead:,.0f} DT non couverte.",
            })
    elif decision == "ALERTE":
        recos.append({
            "priorite": "MOYENNE",
            "texte": "Programmer un contact préventif avec le client dans les 7 jours.",
        })
        if retard_m3 > 7:
            recos.append({
                "priorite": "MOYENNE",
                "texte": "Proposer un réaménagement d'échéancier avant la prochaine "
                         "date de paiement.",
            })
    elif decision == "SURVEILLER":
        recos.append({
            "priorite": "BASSE",
            "texte": "Maintenir une surveillance mensuelle standard, aucune action "
                     "immédiate requise.",
        })
    else:  # MAINTENIR
        recos.append({
            "priorite": "BASSE",
            "texte": "Client en bonne santé financière — éligible à une offre de "
                     "fidélisation ou d'augmentation de plafond.",
        })

    if je > 30:
        recos.append({
            "priorite": "MOYENNE",
            "texte": f"Retard de {int(je)} jours détecté sur un crédit externe — "
                     "vérifier l'endettement global avant toute nouvelle offre.",
        })

    if lgd_pct > 50:
        recos.append({
            "priorite": "MOYENNE",
            "texte": f"Taux de perte estimé élevé ({lgd_pct:.1f}%) — envisager une "
                     "garantie supplémentaire ou un cautionnement.",
        })

    return recos


@comportement_bp.route("/recommandation-ia", methods=["POST"])
@jwt_required()
def recommandation_ia():
    """
    Génère une recommandation approfondie via l'API Groq (llama-3.3-70b-versatile),
    à la demande de l'agent (bouton "Approfondir avec l'IA").

    Body JSON attendu :
        { "client_code": "CLIE308801" }

    Nécessite la variable d'environnement GROQ_API_KEY dans .env.
    """
    try:
        import os, json, re
        import httpx
        from groq import Groq

        body = request.get_json()
        client_code = str(body.get("client_code", "")).strip()
        if not client_code:
            return build_error("client_code manquant", 400)

        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            return build_error("Clé GROQ_API_KEY non configurée sur le serveur", 503)

        engine = current_app.config.get("SA_ENGINE")
        if not engine:
            return build_error("Connexion SA_CREDIT non configurée", 503)

        df_client = fetch_client(engine, client_code)
        row = df_client.iloc[0]
        bundle = current_app.config["MODEL_LOADER"].get("comportement")
        result = _score_dataframe(bundle, df_client)
        bale = BaleService.compute(
            row.to_dict(), result["pd_value"], result["threshold"]
        )

        contexte = {
            "client_code":        client_code,
            "score":              result["score"],
            "notation":           result["notation"],
            "decision":           result["decision"],
            "pd_pct":             round(result["pd_value"] * 100, 2),
            "avg_retard_m3":      float(row.get("Avg_Retard_M3", 0) or 0),
            "nb_retards_m3":      int(row.get("Nb_Retards_M3", 0) or 0),
            "jours_retard_bureau":float(row.get("Jours_Retard_Bureau_Max", 0) or 0),
            "score_bureau_moyen_sur_900": round(float(row.get("Score_Externe_Moyen", 0) or 0) * 900, 0),
            "montant_credit":     float(row.get("Montant_Credit", 0) or 0),
            "revenu_total":       float(row.get("Revenu_Total", 0) or 0),
            "lgd_pct":            bale["lgd_pct"],
            "score_recouvrement": bale["score_recouvrement"],
            "ead_value":          bale["ead_value"],
        }

        system_prompt = (
            "Tu es analyste crédit senior dans une institution financière tunisienne. "
            "Réponds UNIQUEMENT en français. "
            "Quand on te donne des données de scoring comportemental d'un client, "
            "tu génères exactement 3 recommandations opérationnelles concrètes pour l'agent. "
            "Format de réponse STRICT : un tableau JSON valide, sans texte avant ou après, "
            "sans balises markdown (pas de ```), structuré exactement comme ceci :\n"
            '[{"titre":"...", "detail":"..."}, '
            '{"titre":"...", "detail":"..."}, '
            '{"titre":"...", "detail":"..."}]\n'
            "Le champ titre fait 3 à 6 mots, sans astérisques. "
            "Le champ detail fait une phrase concrète et actionnable, sans astérisques."
        )

        user_message = (
            f"Voici les données de scoring comportemental du client :\n{contexte}\n\n"
            "Génère 3 recommandations opérationnelles concrètes. "
            "Interprète les indicateurs, ne les répète pas. Sois direct et actionnable."
        )

        # verify=False : contourne le proxy SSL de l'entreprise (certificat
        # auto-signé) qui casse la vérification SSL par défaut d'httpx.
        client = Groq(api_key=api_key, http_client=httpx.Client(verify=False))
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_message},
            ],
            temperature=0.3,
            max_tokens=700,
        )
        texte_brut = completion.choices[0].message.content.strip()

        # ── Parsing du JSON structuré attendu ────────────────────────────
        recommandations_ia = []
        if texte_brut:
            nettoye = re.sub(r"^```(json)?\s*|\s*```$", "", texte_brut.strip())
            try:
                parsed = json.loads(nettoye)
                if isinstance(parsed, list):
                    for item in parsed:
                        if isinstance(item, dict) and "titre" in item:
                            recommandations_ia.append({
                                "titre":  str(item.get("titre", "")).strip(),
                                "detail": str(item.get("detail", "")).strip(),
                            })
            except (json.JSONDecodeError, TypeError):
                pass

        if not recommandations_ia and texte_brut:
            texte_nettoye = re.sub(r"\*\*(.+?)\*\*", r"\1", texte_brut)
            texte_nettoye = re.sub(r"^\s*[\*\-]\s+", "", texte_nettoye, flags=re.MULTILINE)
            recommandations_ia = [{"titre": "", "detail": texte_nettoye.strip()}]

        if not recommandations_ia:
            recommandations_ia = [{"titre": "", "detail": "Réponse vide reçue de l'IA."}]

        return build_success({
            "client_code": client_code,
            "recommandation_ia": recommandations_ia,
        }, objectif="comportement")

    except ValueError as e:
        return build_error(str(e), 404)
    except Exception as e:
        current_app.logger.error(f"[comportement/recommandation-ia] {e}")
        return build_error(f"Erreur lors de l'appel IA : {e}", 500)