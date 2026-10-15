"""
╔══════════════════════════════════════════════════════════════════════╗
║  response_builder.py — Helpers de formatage des réponses JSON       ║
║                                                                      ║
║  Toutes les routes retournent un envelope commun :                  ║
║    { "success": true/false, "objectif": "...", "data": { ... } }    ║
╚══════════════════════════════════════════════════════════════════════╝
"""

from flask import jsonify


def build_success(data: dict, objectif: str = None, status: int = 200):
    """
    Construit une réponse JSON de succès.

    Args:
        data     : dict résultat à retourner
        objectif : "octroi", "comportement", "fraude" (optionnel)
        status   : code HTTP (défaut 200)

    Returns:
        Flask Response JSON :
        {
            "success":  true,
            "objectif": "octroi",
            "data":     { ... }
        }
    """
    payload = {"success": True, "data": data}
    if objectif:
        payload["objectif"] = objectif
    return jsonify(payload), status


def build_error(message: str, status: int = 400):
    """
    Construit une réponse JSON d'erreur.

    Args:
        message : message d'erreur lisible
        status  : code HTTP (400, 422, 500…)

    Returns:
        Flask Response JSON :
        {
            "success": false,
            "message": "...",
            "data":    null
        }
    """
    return jsonify({
        "success": False,
        "message": message,
        "data":    None,
    }), status
