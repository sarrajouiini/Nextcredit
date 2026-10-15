"""Routes — Monitoring des modèles ML"""

from flask import Blueprint, current_app, render_template
from flask_jwt_extended import jwt_required
from services.monitoring_service import MonitoringService
from utils.response_builder import build_success, build_error

monitoring_bp = Blueprint("monitoring", __name__)


@monitoring_bp.route("/ui", methods=["GET"])
def monitoring_ui():
    return render_template("monitoring.html")


@monitoring_bp.route("/rapport", methods=["GET"])
@jwt_required()
def rapport():
    try:
        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("DWH non configuré", 503)
        data = MonitoringService.rapport_complet(engine)
        return build_success(data)
    except Exception as e:
        return build_error(str(e), 500)


@monitoring_bp.route("/performance", methods=["GET"])
@jwt_required()
def performance():
    try:
        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("DWH non configuré", 503)
        data = MonitoringService.performance_drift(engine)
        return build_success(data)
    except Exception as e:
        return build_error(str(e), 500)


@monitoring_bp.route("/prediction-drift", methods=["GET"])
@jwt_required()
def prediction_drift():
    try:
        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("DWH non configuré", 503)
        data = MonitoringService.prediction_drift(engine)
        return build_success(data)
    except Exception as e:
        return build_error(str(e), 500)
