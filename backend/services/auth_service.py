"""
auth_service.py — Authentification des agents bancaires (JWT + bcrypt).
"""

import bcrypt
from datetime import datetime
from sqlalchemy import text


def verifier_identifiants(engine, email: str, mot_de_passe: str) -> dict | None:
    """
    Vérifie l'email + mot de passe contre la table Agents.

    Args:
        engine       : SQLAlchemy engine connecté à Dwh_Credit
        email        : email saisi par l'agent
        mot_de_passe : mot de passe en clair saisi par l'agent

    Returns:
        dict avec les infos de l'agent si les identifiants sont valides,
        None sinon (email inconnu, compte inactif, ou mot de passe faux).
    """
    query = text("""
        SELECT Id_Agent, Email, Nom, Prenom, Mot_De_Passe_Hash, Role, Actif
        FROM   Agents
        WHERE  Email = :email
    """)

    with engine.connect() as conn:
        row = conn.execute(query, {"email": email.strip().lower()}).mappings().first()

    if not row:
        return None

    if not row["Actif"]:
        return None

    hash_stocke = row["Mot_De_Passe_Hash"].encode("utf-8")
    mdp_saisi = mot_de_passe.encode("utf-8")

    if not bcrypt.checkpw(mdp_saisi, hash_stocke):
        return None

    # Mise à jour de la dernière connexion (best-effort, non bloquant)
    try:
        with engine.begin() as conn:
            conn.execute(
                text("UPDATE Agents SET Derniere_Connexion = :now WHERE Id_Agent = :id"),
                {"now": datetime.now(), "id": row["Id_Agent"]},
            )
    except Exception:
        pass

    return {
        "id_agent": row["Id_Agent"],
        "email": row["Email"],
        "nom": row["Nom"],
        "prenom": row["Prenom"],
        "role": row["Role"],
    }


def mettre_a_jour_profil(engine, id_agent: int, nom: str, prenom: str, email: str) -> dict | None:
    """
    Met à jour le nom, prénom et email de l'agent connecté.
    Ne touche jamais au mot de passe (Mot_De_Passe_Hash).

    Returns:
        dict avec les infos à jour de l'agent, ou None si l'agent est introuvable
        ou si l'email est déjà utilisé par un autre agent.
    """
    email_norm = email.strip().lower()

    with engine.connect() as conn:
        conflit = conn.execute(
            text("SELECT Id_Agent FROM Agents WHERE Email = :email AND Id_Agent <> :id"),
            {"email": email_norm, "id": id_agent},
        ).first()
    if conflit:
        raise ValueError("Cet email est déjà utilisé par un autre agent")

    with engine.begin() as conn:
        result = conn.execute(
            text("""
                UPDATE Agents
                SET Nom = :nom, Prenom = :prenom, Email = :email
                WHERE Id_Agent = :id
            """),
            {"nom": nom.strip(), "prenom": prenom.strip(), "email": email_norm, "id": id_agent},
        )
        if result.rowcount == 0:
            return None

        row = conn.execute(
            text("SELECT Id_Agent, Email, Nom, Prenom, Role FROM Agents WHERE Id_Agent = :id"),
            {"id": id_agent},
        ).mappings().first()

    return {
        "id_agent": row["Id_Agent"],
        "email": row["Email"],
        "nom": row["Nom"],
        "prenom": row["Prenom"],
        "role": row["Role"],
    }
