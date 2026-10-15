"""
╔══════════════════════════════════════════════════════════════════════╗
║  Routes — Assistant Bancaire IA                                      ║
║                                                                      ║
║  Endpoints :                                                         ║
║    GET  /api/assistant/ui                                            ║
║    POST /api/assistant/chat                                          ║
║    GET  /api/assistant/history/<session_id>                         ║
║    POST /api/assistant/clear                                         ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import re
import numpy as np
from flask import Blueprint, request, render_template, jsonify, current_app
from flask_jwt_extended import jwt_required

from services.assistant_service import AssistantService
from services.dwh_service       import fetch_client
from services.bale_service      import BaleService

assistant_bp = Blueprint("assistant", __name__)

# ── Regex pour détecter un code client dans la question ──────────────
_CLIENT_RE = re.compile(r'\bCLIE\s*0*(\d+)\b', re.IGNORECASE)

# Mots-clés déclenchant une recherche de scoring
_SCORING_TRIGGERS = {
    'score', 'scoring', 'analyse', 'analyser', 'évalue', 'évaluer',
    'risque', 'décision', 'fiche', 'comportement', 'comportemental',
    'retard', 'paiement', 'dossier', 'client', 'notation', 'pd',
    'probabilité', 'défaut', 'recouvrement', 'alerte', 'contentieux',
}


def _extract_client_code(text: str):
    """Retourne 'CLIExxxxxx' si un code client est présent dans le texte."""
    m = _CLIENT_RE.search(text)
    return f"CLIE{m.group(1)}" if m else None


def _needs_scoring(text: str) -> bool:
    """Vrai si la question porte sur un client spécifique et son scoring."""
    tl = text.lower()
    return any(kw in tl for kw in _SCORING_TRIGGERS)


def _score_comportement(client_code: str) -> dict | None:
    """
    Charge le client depuis SA_CREDIT, lance le modèle comportemental
    et retourne un dict complet (score, notation, décision, indicateurs,
    métriques Bâle, recommandations).  Retourne None si erreur.
    """
    try:
        engine = current_app.config.get("SA_ENGINE")
        loader = current_app.config.get("MODEL_LOADER")
        if not engine or not loader:
            return None

        df = fetch_client(engine, client_code)
        if df is None or df.empty:
            return None

        row    = df.iloc[0]
        bundle = loader.get("comportement")

        # ── Scoring ML (copie de _score_dataframe dans comportement.py) ──
        pre       = bundle["preprocessor"]
        model     = bundle["model"]
        threshold = float(bundle.get("threshold", 0.5))
        ALL_FEATS = [c for c in bundle.get("num_cols", []) + bundle.get("cat_cols", [])
                     if c in df.columns]
        X_prep  = pre.transform(df[ALL_FEATS].fillna(0)).astype(np.float32)
        pd_val  = float(model.predict_proba(X_prep)[0, 1])
        score   = int((1 - pd_val) * 1000)

        NOTATION_BREAKS = [
            (900, "AAA", "Excellent", "MAINTENIR"),
            (800, "AA",  "Très bon",  "MAINTENIR"),
            (700, "A",   "Bon",       "SURVEILLER"),
            (600, "BBB", "Légère dégradation", "SURVEILLER"),
            (500, "BB",  "Dégradation modérée","ALERTE"),
            (400, "B",   "Dégradation sévère", "ALERTE"),
            (0,   "CCC", "Défaut probable",    "CONTENTIEUX"),
        ]
        notation = label = decision = None
        for seuil, nota, lbl, dec in NOTATION_BREAKS:
            if score >= seuil:
                notation, label, decision = nota, lbl, dec
                break

        # ── Indicateurs clés ─────────────────────────────────────────────
        ratio_paie  = float(row.get("Ratio_Paiement_Global", 1) or 1)
        retard_m3   = float(row.get("Avg_Retard_M3", 0) or 0)
        je          = float(row.get("Jours_Retard_Bureau_Max", 0) or 0)
        sc_ext_moy  = float(row.get("Score_Externe_Moyen", 0) or 0)
        mensualite  = float(row.get("Mensualite", 0) or 0)
        revenu      = float(row.get("Revenu_Total", 1) or 1)
        pression    = round(mensualite / revenu, 4) if revenu else 0

        indicateurs = {
            "taux_paiement":  round(min(ratio_paie, 1.0) * 100, 1),
            "retard_moy_m3":  round(max(retard_m3, 0), 1),
            "retard_externe": int(je),
            "score_bureau":   round(sc_ext_moy * 900, 0),
            "pression_fin":   f"{round(pression * 100, 1)}%",
            "montant_credit": float(row.get("Montant_Credit", 0) or 0),
            "revenu_total":   float(row.get("Revenu_Total", 0) or 0),
        }

        # ── Métriques Bâle ───────────────────────────────────────────────
        bale = BaleService.compute(row.to_dict(), pd_val, threshold)

        # ── Recommandations règles métier ────────────────────────────────
        recos = []
        if retard_m3 > 90:
            recos.append("Retard moyen > 90 j — initier procédure de recouvrement immédiatement.")
        elif retard_m3 > 30:
            recos.append("Retard moyen > 30 j — contacter le client pour plan de régularisation.")
        elif retard_m3 > 0:
            recos.append("Retards ponctuels — surveiller les prochaines échéances de près.")

        if ratio_paie < 0.6:
            recos.append("Taux de paiement critique (< 60 %) — risque de défaut élevé.")
        elif ratio_paie < 0.9:
            recos.append("Taux de paiement insuffisant (< 90 %) — renforcer le suivi.")

        if je > 90:
            recos.append("Retard externe > 90 j — l'emprunteur est déjà en défaut sur d'autres crédits.")

        if pression > 0.4:
            recos.append("Pression financière élevée (> 40 % du revenu consacré aux mensualités).")

        if not recos:
            recos.append("Profil stable — maintenir le suivi trimestriel standard.")

        return {
            "type":           "comportement",
            "client_code":    client_code,
            "score":          score,
            "notation":       notation,
            "label":          label,
            "decision":       decision,
            "pd_pct":         round(pd_val * 100, 2),
            "seuil_pct":      round(threshold * 100, 1),
            "indicateurs":    indicateurs,
            "bale":           bale,
            "recommandations": recos,
        }

    except Exception as e:
        current_app.logger.warning(f"[assistant/scoring-comport] {e}")
        return None


# ─────────────────────────────────────────────────────────────────────


@assistant_bp.route("/ui", methods=["GET"])
def assistant_ui():
    return render_template("assistant.html")


@assistant_bp.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    try:
        data = request.get_json()
        if not data or "question" not in data:
            return jsonify({"success": False, "message": "Question manquante"}), 400

        question   = data["question"]
        session_id = data.get("session_id")

        # ── Détection automatique de scoring client ───────────────────
        scoring_data = None
        client_code  = _extract_client_code(question)
        if client_code and _needs_scoring(question):
            scoring_data = _score_comportement(client_code)

        # dossier_client explicite (envoyé par le frontend) est prioritaire
        dossier_client = data.get("dossier_client") or scoring_data

        result = AssistantService.ask(question, session_id, dossier_client)

        # Ajouter le scoring dans la réponse pour que le frontend
        # puisse l'afficher structurellement si besoin
        if scoring_data:
            result["scoring"] = scoring_data

        return jsonify({"success": True, "data": result}), 200

    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@assistant_bp.route("/history/<session_id>", methods=["GET"])
@jwt_required()
def get_history(session_id):
    try:
        messages = AssistantService.get_history(session_id)
        return jsonify({"success": True, "data": {"messages": messages}}), 200
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@assistant_bp.route("/clear", methods=["POST"])
@jwt_required()
def clear_history():
    try:
        data = request.get_json()
        if not data or "session_id" not in data:
            return jsonify({"success": False, "message": "session_id manquant"}), 400
        AssistantService.clear_history(data["session_id"])
        return jsonify({"success": True, "data": {"cleared": True}}), 200
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
