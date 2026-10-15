"""
Routes — Administration des comptes agents (réservé role=admin).
"""
from functools import wraps
from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

from services.admin_service import (
    lister_agents, creer_agent, modifier_agent,
    reinitialiser_mot_de_passe, supprimer_agent, compter_agents_actifs,
)
from services.plan_service import get_plan_actuel, set_plan_actuel, liste_plans
from utils.response_builder import build_success, build_error

admin_bp = Blueprint("admin", __name__)


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return build_error("Accès réservé aux administrateurs", 403)
        return fn(*args, **kwargs)
    return wrapper


@admin_bp.route("/agents", methods=["GET"])
@admin_required
def get_agents():
    try:
        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("Connexion DWH non configurée", 503)
        agents = lister_agents(engine)
        plan = get_plan_actuel()
        return build_success({
            "agents": agents,
            "plan": plan,
            "agents_actifs": compter_agents_actifs(engine),
        }, objectif="admin")
    except Exception as e:
        current_app.logger.error(f"[admin/get_agents] {e}")
        return build_error(str(e), 500)


@admin_bp.route("/agents", methods=["POST"])
@admin_required
def create_agent():
    try:
        body = request.get_json()
        if not body:
            return build_error("Corps JSON manquant", 400)

        nom = str(body.get("nom", "")).strip()
        prenom = str(body.get("prenom", "")).strip()
        email = str(body.get("email", "")).strip()
        mot_de_passe = str(body.get("mot_de_passe", ""))
        role = str(body.get("role", "agent")).strip()

        if not nom or not prenom or not email or not mot_de_passe:
            return build_error("Nom, prénom, email et mot de passe sont obligatoires", 422)
        if len(mot_de_passe) < 6:
            return build_error("Le mot de passe doit contenir au moins 6 caractères", 422)
        if role not in ("agent", "admin"):
            return build_error("Rôle invalide", 422)

        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("Connexion DWH non configurée", 503)

        # Plafond du plan d'abonnement actif
        plan = get_plan_actuel()
        actifs = compter_agents_actifs(engine)
        if actifs >= plan["agent_limit"]:
            return build_error(
                f"Limite du plan {plan['label']} atteinte ({plan['agent_limit']} agents). "
                "Passez à un plan supérieur pour ajouter des comptes.", 409)

        try:
            agent = creer_agent(engine, nom, prenom, email, mot_de_passe, role)
        except ValueError as e:
            return build_error(str(e), 409)

        return build_success({"agent": agent}, objectif="admin", status=201)
    except Exception as e:
        current_app.logger.error(f"[admin/create_agent] {e}")
        return build_error(str(e), 500)


@admin_bp.route("/agents/<int:id_agent>", methods=["PUT"])
@admin_required
def update_agent(id_agent: int):
    try:
        body = request.get_json()
        if not body:
            return build_error("Corps JSON manquant", 400)

        nom = str(body.get("nom", "")).strip()
        prenom = str(body.get("prenom", "")).strip()
        email = str(body.get("email", "")).strip()
        role = str(body.get("role", "agent")).strip()
        actif = bool(body.get("actif", True))

        if not nom or not prenom or not email:
            return build_error("Nom, prénom et email sont obligatoires", 422)
        if role not in ("agent", "admin"):
            return build_error("Rôle invalide", 422)

        # Un admin ne peut pas se désactiver ni se rétrograder lui-même
        current_id = int(get_jwt_identity())
        if current_id == id_agent and (role != "admin" or not actif):
            return build_error("Vous ne pouvez pas modifier votre propre rôle ou statut", 400)

        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("Connexion DWH non configurée", 503)

        try:
            agent = modifier_agent(engine, id_agent, nom, prenom, email, role, actif)
        except ValueError as e:
            return build_error(str(e), 409)

        if not agent:
            return build_error("Agent introuvable", 404)

        return build_success({"agent": agent}, objectif="admin")
    except Exception as e:
        current_app.logger.error(f"[admin/update_agent] {e}")
        return build_error(str(e), 500)


@admin_bp.route("/agents/<int:id_agent>/password", methods=["PUT"])
@admin_required
def reset_password(id_agent: int):
    try:
        body = request.get_json()
        nouveau_mdp = str((body or {}).get("mot_de_passe", ""))
        if len(nouveau_mdp) < 6:
            return build_error("Le mot de passe doit contenir au moins 6 caractères", 422)

        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("Connexion DWH non configurée", 503)

        ok = reinitialiser_mot_de_passe(engine, id_agent, nouveau_mdp)
        if not ok:
            return build_error("Agent introuvable", 404)

        return build_success({"id_agent": id_agent}, objectif="admin")
    except Exception as e:
        current_app.logger.error(f"[admin/reset_password] {e}")
        return build_error(str(e), 500)


@admin_bp.route("/agents/<int:id_agent>", methods=["DELETE"])
@admin_required
def delete_agent(id_agent: int):
    try:
        current_id = int(get_jwt_identity())
        if current_id == id_agent:
            return build_error("Vous ne pouvez pas supprimer votre propre compte", 400)

        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("Connexion DWH non configurée", 503)

        ok = supprimer_agent(engine, id_agent)
        if not ok:
            return build_error("Agent introuvable", 404)

        return build_success({"id_agent": id_agent}, objectif="admin")
    except Exception as e:
        current_app.logger.error(f"[admin/delete_agent] {e}")
        return build_error(str(e), 500)


@admin_bp.route("/plan", methods=["GET"])
@admin_required
def get_plan():
    try:
        return build_success({
            "plan_actuel": get_plan_actuel(),
            "plans_disponibles": liste_plans(),
        }, objectif="admin")
    except Exception as e:
        return build_error(str(e), 500)


@admin_bp.route("/plan", methods=["PUT"])
@admin_required
def update_plan():
    try:
        body = request.get_json()
        key = str((body or {}).get("plan", "")).strip()
        try:
            plan = set_plan_actuel(key)
        except ValueError as e:
            return build_error(str(e), 422)
        return build_success({"plan_actuel": plan}, objectif="admin")
    except Exception as e:
        return build_error(str(e), 500)
