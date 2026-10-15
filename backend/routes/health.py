"""Route de santé du serveur — GET /api/health"""

from flask   import Blueprint, current_app, jsonify
from datetime import datetime

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health():
    """
    Endpoint de monitoring : vérifie que Flask et les modèles sont opérationnels.
    Appelé par FastAPI et les outils de monitoring (Prometheus, etc.)
    """
    loader  = current_app.config["MODEL_LOADER"]
    modeles = {}
    for obj in ["octroi", "comportement", "fraude"]:
        bundle = loader.bundles.get(obj)

        if bundle is None:
            modeles[obj] = {
                 
                "charge": False,
                "demo_mode": False,
                "model_type": "N/A"
            }
            continue

        if isinstance(bundle, dict):
            model = bundle.get("model")
            is_demo = bundle.get("is_demo", False)
        else:
            model = bundle
            is_demo = False

        modeles[obj] = {
            "charge": True,
            "demo_mode": is_demo,
            "model_type": type(model).__name__ if model is not None else "N/A"
    }
    tous_ok = all(v["charge"] for v in modeles.values())

    return jsonify({
        "status":    "OK" if tous_ok else "DEGRADED",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version":   "1.0.0",
        "modeles":   modeles,
        "endpoints": [
            "POST /api/octroi/predict",
            "POST /api/octroi/explain/shap",
            "POST /api/octroi/explain/lime",
            "POST /api/comportement/predict",
            "POST /api/comportement/explain/shap",
            "POST /api/fraude/predict",
            "POST /api/fraude/explain/shap",
            "POST /api/octroi/batch",
        ]
    }), 200 if tous_ok else 206
