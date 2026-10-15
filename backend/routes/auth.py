"""
Routes — Authentification agent (login JWT)
"""
from flask import Blueprint, request, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from services.auth_service import verifier_identifiants, mettre_a_jour_profil
from utils.response_builder import build_success, build_error

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        body = request.get_json()
        if not body:
            return build_error("Corps JSON manquant", 400)

        email = str(body.get("email", "")).strip()
        mot_de_passe = str(body.get("mot_de_passe", ""))

        if not email or not mot_de_passe:
            return build_error("Email et mot de passe obligatoires", 400)

        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("Connexion DWH non configurée", 503)

        agent = verifier_identifiants(engine, email, mot_de_passe)
        if not agent:
            return build_error("Email ou mot de passe incorrect", 401)

        # Identité encodée dans le token : id_agent (string requis par JWT)
        identity = str(agent["id_agent"])
        claims = {
            "email": agent["email"],
            "nom": agent["nom"],
            "prenom": agent["prenom"],
            "role": agent["role"],
        }

        access_token = create_access_token(identity=identity, additional_claims=claims)
        refresh_token = create_refresh_token(identity=identity, additional_claims=claims)

        return build_success({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "agent": claims,
        }, objectif="auth")

    except Exception as e:
        current_app.logger.error(f"[auth/login] {e}")
        return build_error(str(e), 500)


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    try:
        identity = get_jwt_identity()
        claims = get_jwt()
        additional = {
            "email": claims.get("email"),
            "nom": claims.get("nom"),
            "prenom": claims.get("prenom"),
            "role": claims.get("role"),
        }
        new_access_token = create_access_token(identity=identity, additional_claims=additional)
        return build_success({"access_token": new_access_token}, objectif="auth")
    except Exception as e:
        return build_error(str(e), 500)


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    try:
        claims = get_jwt()
        return build_success({
            "id_agent": get_jwt_identity(),
            "email": claims.get("email"),
            "nom": claims.get("nom"),
            "prenom": claims.get("prenom"),
            "role": claims.get("role"),
        }, objectif="auth")
    except Exception as e:
        return build_error(str(e), 500)


@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    """
    Met à jour le profil de l'agent connecté (nom, prénom, email).
    Le mot de passe n'est jamais modifiable depuis cette route.
    Retourne un nouveau access_token dont les claims reflètent les infos à jour.
    """
    try:
        body = request.get_json()
        if not body:
            return build_error("Corps JSON manquant", 400)

        nom    = str(body.get("nom", "")).strip()
        prenom = str(body.get("prenom", "")).strip()
        email  = str(body.get("email", "")).strip()

        if not nom or not prenom or not email:
            return build_error("Nom, prénom et email sont obligatoires", 422)
        if "@" not in email or "." not in email.split("@")[-1]:
            return build_error("Email invalide", 422)

        engine = current_app.config.get("DWH_ENGINE")
        if not engine:
            return build_error("Connexion DWH non configurée", 503)

        id_agent = int(get_jwt_identity())

        try:
            agent = mettre_a_jour_profil(engine, id_agent, nom, prenom, email)
        except ValueError as e:
            return build_error(str(e), 409)

        if not agent:
            return build_error("Agent introuvable", 404)

        claims = {
            "email": agent["email"],
            "nom": agent["nom"],
            "prenom": agent["prenom"],
            "role": agent["role"],
        }
        new_access_token = create_access_token(identity=str(id_agent), additional_claims=claims)

        return build_success({
            "agent": claims,
            "access_token": new_access_token,
        }, objectif="auth")

    except Exception as e:
        current_app.logger.error(f"[auth/update_me] {e}")
        return build_error(str(e), 500)
