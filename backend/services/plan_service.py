"""
plan_service.py — Plan d'abonnement actif de l'établissement (mono-tenant).
Stocké dans un simple fichier JSON — pas de facturation réelle, juste un
plafond du nombre d'agents actifs selon le plan choisi par l'admin.
"""

import json
import os

_SETTINGS_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "config", "plan_settings.json")

PLANS = {
    "starter":    {"label": "Starter",    "agent_limit": 2},
    "pro":        {"label": "Pro",        "agent_limit": 5},
    "business":   {"label": "Business",   "agent_limit": 5},
    "enterprise": {"label": "Enterprise", "agent_limit": 50},
}

DEFAULT_PLAN = "business"


def _read() -> dict:
    if not os.path.exists(_SETTINGS_PATH):
        return {"plan": DEFAULT_PLAN}
    try:
        with open(_SETTINGS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"plan": DEFAULT_PLAN}


def _write(data: dict) -> None:
    os.makedirs(os.path.dirname(_SETTINGS_PATH), exist_ok=True)
    with open(_SETTINGS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_plan_actuel() -> dict:
    data = _read()
    key = data.get("plan", DEFAULT_PLAN)
    if key not in PLANS:
        key = DEFAULT_PLAN
    return {"key": key, **PLANS[key]}


def set_plan_actuel(key: str) -> dict:
    if key not in PLANS:
        raise ValueError(f"Plan inconnu : {key}")
    _write({"plan": key})
    return {"key": key, **PLANS[key]}


def liste_plans() -> list:
    return [{"key": k, **v} for k, v in PLANS.items()]
