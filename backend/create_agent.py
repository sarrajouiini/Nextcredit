"""
create_agent.py — Utilitaire en ligne de commande pour créer un compte agent.

Usage :
    python create_agent.py

Le script demande email / nom / prénom / mot de passe, hash le mot de
passe avec bcrypt, et insère la ligne dans la table Agents (Dwh_Credit).

Ne jamais stocker de mot de passe en clair dans la base — bcrypt génère
un hash à sens unique, irréversible, avec un sel aléatoire intégré.
"""

import getpass
import bcrypt
from sqlalchemy import create_engine, text

SERVER = "localhost"
DATABASE = "Dwh_Credit"
DRIVER = "ODBC Driver 17 for SQL Server"


def make_engine():
    conn_str = (
        f"mssql+pyodbc://{SERVER}/{DATABASE}"
        f"?driver={DRIVER.replace(' ', '+')}&trusted_connection=yes"
    )
    return create_engine(conn_str)


def hash_password(plain_password: str) -> str:
    """Hash un mot de passe en clair avec bcrypt (sel aléatoire intégré)."""
    return bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def main():
    print("=== Création d'un compte agent NextCredit ===\n")

    email = input("Email : ").strip()
    nom = input("Nom : ").strip()
    prenom = input("Prénom : ").strip()
    role = input("Rôle (agent/admin) [agent] : ").strip() or "agent"

    mdp = getpass.getpass("Mot de passe : ")
    mdp_confirm = getpass.getpass("Confirmer le mot de passe : ")

    if mdp != mdp_confirm:
        print("\nErreur : les mots de passe ne correspondent pas.")
        return

    if len(mdp) < 8:
        print("\nErreur : le mot de passe doit contenir au moins 8 caractères.")
        return

    mdp_hash = hash_password(mdp)

    engine = make_engine()
    query = text("""
        INSERT INTO Agents (Email, Nom, Prenom, Mot_De_Passe_Hash, Role)
        VALUES (:email, :nom, :prenom, :hash, :role)
    """)

    try:
        with engine.begin() as conn:
            conn.execute(query, {
                "email": email, "nom": nom, "prenom": prenom,
                "hash": mdp_hash, "role": role,
            })
        print(f"\nCompte créé avec succès : {email} ({role})")
    except Exception as e:
        print(f"\nErreur lors de la création du compte : {e}")
        print("Vérifiez que la table Agents existe (voir create_table_agents.sql)")
        print("et que l'email n'est pas déjà utilisé.")


if __name__ == "__main__":
    main()
