"""
Routes — Scoring Octroi [VERSION FINALE avec CIN + DB + Agent]
"""
import numpy as np
from flask import Blueprint, request, current_app, render_template
from sqlalchemy import text

try:
    _trapz = np.trapezoid   # NumPy >= 2.0
except AttributeError:
    _trapz = np.trapz       # NumPy < 2.0
from services.scoring_service   import ScoringService
from services.xai_service       import XAIService
from services.decision_engine   import DecisionEngine, PolicyRules
from services.db_service        import (sauvegarder_decision, confirmer_decision_agent,
                                        get_decision, get_dossiers_en_attente)
from services.cin_resolver_service import resoudre_scores_bureau
from utils.validators           import validate_octroi_input
from utils.response_builder     import build_success, build_error
from flask_jwt_extended import jwt_required

octroi_bp = Blueprint("octroi", __name__)
_engine_decision = DecisionEngine(PolicyRules(
    endettement_max=0.45, score_bureau_plancher=350, ltv_max=0.95, marge_revue=0.07))


@octroi_bp.route("/ui", methods=["GET"])
def octroi_ui():
    return render_template("octroi.html")


@octroi_bp.route("/dossiers-attente", methods=["GET"])
def dossiers_attente_ui():
    return render_template("dossiers_attente.html")


@octroi_bp.route("/predict", methods=["POST"])
@jwt_required()  
def predict():
    try:
        raw_data = request.get_json()
        if not raw_data:
            return build_error("Corps JSON manquant", 400)

        # ── Résolution CIN -> scores bureau réels ───────────────────────
        # Le score bureau n'est JAMAIS saisi par l'agent. Il est toujours
        # déduit du CIN du client, via recherche dans le DWH ou SA_CREDIT.
        cin = str(raw_data.get("CIN", "")).strip()
        if not cin:
            return build_error("Le CIN est obligatoire", 422)

        engine_dwh = current_app.config.get("DWH_ENGINE")
        engine_sa  = current_app.config.get("SA_ENGINE")

        try:
            scores_bureau = resoudre_scores_bureau(engine_dwh, engine_sa, cin)
        except ValueError as e:
            return build_error(str(e), 422)

        # Injection des scores résolus dans raw_data (remplace toute
        # valeur qui aurait pu être présente — le score n'est jamais
        # contrôlé par le formulaire).
        raw_data["Score_Externe_1"] = scores_bureau["score_externe_1"]
        raw_data["Score_Externe_2"] = scores_bureau["score_externe_2"]
        raw_data["Score_Externe_3"] = scores_bureau["score_externe_3"]

        errors = validate_octroi_input(raw_data)
        if errors:
            return build_error(f"Données invalides : {errors}", 422)

        loader = current_app.config["MODEL_LOADER"]
        bundle = loader.get("octroi")
        threshold = bundle.get("threshold", 0.5)
        result = ScoringService.predict(bundle, raw_data, "octroi")
        verdict = _engine_decision.decide(result, ScoringService.translate_input(raw_data), threshold)
        result["decision"]          = verdict["decision_finale"]
        result["mode_decision"]     = verdict["mode_decision"]
        result["motifs"]            = verdict["motifs"]
        result["points_vigilance"]  = verdict["points_vigilance"]

        # Info de traçabilité sur l'origine du score bureau utilisé
        result["scores_bureau_info"] = {
            "client_trouve": scores_bureau["client_trouve"],
            "client_code":   scores_bureau["client_code"],
            "source":        scores_bureau["source"],
        }

        result.pop("X_prep", None)

        decision_id = None
        if engine_dwh:
            try:
                decision_id = sauvegarder_decision(engine_dwh, raw_data, result)
            except Exception as e:
                current_app.logger.warning(f"DB save: {e}")
        result["decision_id"] = decision_id

        return build_success(result, objectif="octroi")
    except Exception as e:
        current_app.logger.error(f"[octroi/predict] {e}")
        return build_error(str(e), 500)


@octroi_bp.route("/confirmer", methods=["POST"])
@jwt_required()  
def confirmer():
    try:
        body = request.get_json()
        if not body or "decision_id" not in body:
            return build_error("decision_id manquant", 400)

        decision_id    = int(body["decision_id"])
        decision_agent = str(body.get("decision_agent", "")).upper()
        if decision_agent not in ("APPROUVE", "REFUSE", "EN_ATTENTE"):
            return build_error("decision_agent invalide", 400)

        # EN_ATTENTE : l'agent reporte la décision — aucune mise à jour nécessaire
        if decision_agent == "EN_ATTENTE":
            return build_success({"id": decision_id, "decision_agent": "EN_ATTENTE",
                                  "statut": "EN_ATTENTE"}, objectif="octroi")

        motif_acc = (body.get("motif_acceptation") or "").strip() or None
        motif_rej = (body.get("motif_rejet")       or "").strip() or None
        agent_id  = body.get("agent_id", "agent")

        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("DWH non configuré", 503)

        dossier = get_decision(engine, decision_id)
        if not dossier:
            return build_error(f"Dossier {decision_id} introuvable", 404)
        if dossier.get("Statut") == "CONFIRME":
            return build_error("Dossier déjà traité", 409)

        decision_modele = dossier.get("DecisionModele") or ""

        if decision_modele != decision_agent:
            if decision_agent == "APPROUVE" and not motif_acc:
                return build_error("Motif d'acceptation obligatoire (override)", 422)
            if decision_agent == "REFUSE" and not motif_rej:
                return build_error("Motif de rejet obligatoire (override)", 422)

        result = confirmer_decision_agent(
            engine, decision_id, decision_agent,
            decision_modele, motif_acc, motif_rej, agent_id)

        return build_success(result, objectif="octroi")

    except Exception as e:
        current_app.logger.error(f"[octroi/confirmer] {e}")
        return build_error(str(e), 500)


@octroi_bp.route("/dossiers-en-attente", methods=["GET"])
@jwt_required()  
def dossiers_en_attente():
    try:
        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("DWH non configuré", 503)
        limit = request.args.get("limit", 50, type=int)
        dossiers = get_dossiers_en_attente(engine, limit)
        return build_success({"dossiers": dossiers, "total": len(dossiers)}, objectif="octroi")
    except Exception as e:
        return build_error(str(e), 500)


@octroi_bp.route("/explain/shap", methods=["POST"])
@jwt_required()  
def explain_shap():
    try:
        raw_data = request.get_json()

        cin = str(raw_data.get("CIN", "")).strip()
        if cin:
            engine_dwh = current_app.config.get("DWH_ENGINE")
            engine_sa  = current_app.config.get("SA_ENGINE")
            try:
                scores_bureau = resoudre_scores_bureau(engine_dwh, engine_sa, cin)
                raw_data["Score_Externe_1"] = scores_bureau["score_externe_1"]
                raw_data["Score_Externe_2"] = scores_bureau["score_externe_2"]
                raw_data["Score_Externe_3"] = scores_bureau["score_externe_3"]
            except ValueError:
                pass

        loader = current_app.config["MODEL_LOADER"]
        bundle = loader.get("octroi")
        result = ScoringService.predict(bundle, raw_data, "octroi")
        shap_res = XAIService.explain_shap(bundle, result["X_prep"], top_n=request.args.get("top_n", 10, type=int))
        shap_res.update({"pd_value": round(result["pd_value"], 6), "score": result["score"], "notation": result["notation"]})
        return build_success(shap_res, objectif="octroi")
    except Exception as e:
        return build_error(str(e), 500)


@octroi_bp.route("/explain/lime", methods=["POST"])
@jwt_required()  
def explain_lime():
    try:
        raw_data = request.get_json()

        cin = str(raw_data.get("CIN", "")).strip()
        if cin:
            engine_dwh = current_app.config.get("DWH_ENGINE")
            engine_sa  = current_app.config.get("SA_ENGINE")
            try:
                scores_bureau = resoudre_scores_bureau(engine_dwh, engine_sa, cin)
                raw_data["Score_Externe_1"] = scores_bureau["score_externe_1"]
                raw_data["Score_Externe_2"] = scores_bureau["score_externe_2"]
                raw_data["Score_Externe_3"] = scores_bureau["score_externe_3"]
            except ValueError:
                pass

        loader = current_app.config["MODEL_LOADER"]
        bundle = loader.get("octroi")
        result = ScoringService.predict(bundle, raw_data, "octroi")
        lime_res = XAIService.explain_lime(bundle, bundle.get("background_data"), result["X_prep"], top_n=request.args.get("top_n", 10, type=int))
        return build_success(lime_res, objectif="octroi")
    except Exception as e:
        return build_error(str(e), 500)


@octroi_bp.route("/model-metrics", methods=["GET"])
@jwt_required()
def model_metrics():
    """
    Calcule les métriques réelles du modèle (AUC-ROC, précision, rappel, F1)
    à partir des dossiers déjà confirmés par les agents (DecisionAgent = vérité
    terrain, ProbabiliteDefaut = score prédit par le modèle).
    """
    try:
        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("DWH non configuré", 503)

        sql = text("""
            SELECT DecisionAgent, DecisionModele, ProbabiliteDefaut, Score, Notation
            FROM   OctroisDecisions
            WHERE  DecisionAgent IS NOT NULL AND DecisionAgent <> 'EN_ATTENTE'
        """)
        with engine.connect() as conn:
            rows = conn.execute(sql).mappings().fetchall()

        demo_mode = False
        n = len(rows)

        if n < 10:
            # Pas assez de décisions confirmées → courbe de démonstration
            demo_mode = True
            fpr = np.linspace(0, 1, 30)
            tpr = np.sqrt(fpr) * 0.86 + fpr * 0.14
            auc = float(_trapz(tpr, fpr))
            metrics = {
                "auc": round(auc, 3), "precision": 0.81, "recall": 0.77,
                "f1": 0.79, "accuracy": 0.83, "n_samples": n,
            }
        else:
            y_true, y_score, y_pred = [], [], []
            for r in rows:
                da = (r["DecisionAgent"] or "").upper()
                dm = (r["DecisionModele"] or "").upper()
                if da not in ("APPROUVE", "REFUSE"):
                    continue
                y_true.append(1 if da == "REFUSE" else 0)
                y_score.append(float(r["ProbabiliteDefaut"] or 0))
                y_pred.append(1 if dm == "REFUSE" else 0)

            y_true = np.array(y_true); y_score = np.array(y_score); y_pred = np.array(y_pred)

            if len(set(y_true.tolist())) < 2:
                demo_mode = True
                fpr = np.linspace(0, 1, 30)
                tpr = np.sqrt(fpr) * 0.86 + fpr * 0.14
                auc = float(_trapz(tpr, fpr))
                metrics = {
                    "auc": round(auc, 3), "precision": 0.81, "recall": 0.77,
                    "f1": 0.79, "accuracy": 0.83, "n_samples": n,
                }
                fpr, tpr = fpr.tolist(), tpr.tolist()
            else:
                from sklearn.metrics import (roc_auc_score, roc_curve, precision_score,
                                              recall_score, f1_score, accuracy_score)
                auc = roc_auc_score(y_true, y_score)
                fpr_arr, tpr_arr, _ = roc_curve(y_true, y_score)
                idx = np.linspace(0, len(fpr_arr) - 1, min(40, len(fpr_arr))).astype(int)
                fpr, tpr = fpr_arr[idx].tolist(), tpr_arr[idx].tolist()
                metrics = {
                    "auc":       round(float(auc), 3),
                    "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 3),
                    "recall":    round(float(recall_score(y_true, y_pred, zero_division=0)), 3),
                    "f1":        round(float(f1_score(y_true, y_pred, zero_division=0)), 3),
                    "accuracy":  round(float(accuracy_score(y_true, y_pred)), 3),
                    "n_samples": n,
                }

        return build_success({
            "metrics": metrics,
            "roc_curve": {"fpr": fpr if isinstance(fpr, list) else fpr.tolist(),
                          "tpr": tpr if isinstance(tpr, list) else tpr.tolist()},
            "demo_mode": demo_mode,
            "model_name": "XGBoost",
        }, objectif="octroi")

    except Exception as e:
        current_app.logger.error(f"[octroi/model-metrics] {e}")
        return build_error(str(e), 500)