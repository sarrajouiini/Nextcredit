"""
admin_service.py — Gestion des comptes agents par l'administrateur (CRUD).
Le mot de passe est toujours hashé avec bcrypt, jamais stocké en clair.
"""

import bcrypt
from sqlalchemy import text


def lister_agents(engine) -> list:
    query = text("""
        SELECT Id_Agent, Email, Nom, Prenom, Role, Actif, Derniere_Connexion
        FROM   Agents
        ORDER  BY Nom, Prenom
    """)
    with engine.connect() as conn:
        rows = conn.execute(query).mappings().all()
    return [dict(r) for r in rows]


def creer_agent(engine, nom: str, prenom: str, email: str, mot_de_passe: str, role: str) -> dict:
    email_norm = email.strip().lower()

    with engine.connect() as conn:
        existant = conn.execute(
            text("SELECT Id_Agent FROM Agents WHERE Email = :email"),
            {"email": email_norm},
        ).first()
    if existant:
        raise ValueError("Un agent avec cet email existe déjà")

    hash_mdp = bcrypt.hashpw(mot_de_passe.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    with engine.begin() as conn:
        result = conn.execute(
            text("""
                INSERT INTO Agents (Email, Nom, Prenom, Mot_De_Passe_Hash, Role, Actif)
                OUTPUT INSERTED.Id_Agent
                VALUES (:email, :nom, :prenom, :hash, :role, 1)
            """),
            {"email": email_norm, "nom": nom.strip(), "prenom": prenom.strip(),
             "hash": hash_mdp, "role": role},
        )
        new_id = result.scalar()

    return {"id_agent": new_id, "email": email_norm, "nom": nom.strip(),
            "prenom": prenom.strip(), "role": role, "actif": True}


def modifier_agent(engine, id_agent: int, nom: str, prenom: str, email: str,
                    role: str, actif: bool) -> dict | None:
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
                SET Nom = :nom, Prenom = :prenom, Email = :email,
                    Role = :role, Actif = :actif
                WHERE Id_Agent = :id
            """),
            {"nom": nom.strip(), "prenom": prenom.strip(), "email": email_norm,
             "role": role, "actif": 1 if actif else 0, "id": id_agent},
        )
        if result.rowcount == 0:
            return None

        row = conn.execute(
            text("SELECT Id_Agent, Email, Nom, Prenom, Role, Actif FROM Agents WHERE Id_Agent = :id"),
            {"id": id_agent},
        ).mappings().first()

    return dict(row) if row else None


def reinitialiser_mot_de_passe(engine, id_agent: int, nouveau_mdp: str) -> bool:
    hash_mdp = bcrypt.hashpw(nouveau_mdp.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    with engine.begin() as conn:
        result = conn.execute(
            text("UPDATE Agents SET Mot_De_Passe_Hash = :hash WHERE Id_Agent = :id"),
            {"hash": hash_mdp, "id": id_agent},
        )
    return result.rowcount > 0


def supprimer_agent(engine, id_agent: int) -> bool:
    with engine.begin() as conn:
        result = conn.execute(
            text("DELETE FROM Agents WHERE Id_Agent = :id"),
            {"id": id_agent},
        )
    return result.rowcount > 0


def compter_agents_actifs(engine) -> int:
    with engine.connect() as conn:
        n = conn.execute(text("SELECT COUNT(*) FROM Agents WHERE Actif = 1")).scalar()
    return int(n or 0)
