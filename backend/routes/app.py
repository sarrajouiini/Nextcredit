"""
╔══════════════════════════════════════════════════════════════════════╗
║  NEXTCREDIT — Flask ML Server  [VERSION FINALE — JWT + 2 BASES]      ║
║                                                                        ║
║  - DWH_ENGINE → "Dwh_Credit"  (scoring octroi + table Agents)        ║
║  - SA_ENGINE  → "SA_CREDIT"   (scoring comportemental)                ║
║  - JWT        → authentification agent (flask_jwt_extended)          ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import os
from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy import create_engine, text

from routes.octroi       import octroi_bp
from routes.comportement import comportement_bp
from routes.health       import health_bp
from routes.auth         import auth_bp
from services.model_loader import ModelLoader

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ── Configuration JWT ────────────────────────────────────────────────
# IMPORTANT : en production, définir JWT_SECRET_KEY via une variable
# d'environnement — jamais en dur dans le code.
app.config["JWT_SECRET_KEY"] = os.environ.get(
    "JWT_SECRET_KEY", "change-moi-en-production-cle-secrete-longue"
)
app.config["JWT_ACCESS_TOKEN_EXPIRES"]  = timedelta(hours=2)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)
jwt = JWTManager(app)

# ── Modèles ML ────────────────────────────────────────────────────────
loader = ModelLoader()
loader.load_all()
app.config["MODEL_LOADER"] = loader

SERVER = "localhost"
DRIVER = "ODBC Driver 17 for SQL Server"


def _make_engine(database: str):
    conn_str = (
        f"mssql+pyodbc://{SERVER}/{database}"
        f"?driver={DRIVER.replace(' ', '+')}"
        f"&trusted_connection=yes"
    )
    return create_engine(conn_str, fast_executemany=True)


# ── Connexion 1 : Dwh_Credit → scoring octroi + comptes agents ────────
try:
    dwh_engine = _make_engine("Dwh_Credit")
    with dwh_engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    app.config["DWH_ENGINE"] = dwh_engine
    print("[DWH_ENGINE] Connexion Dwh_Credit OK")
except Exception as e:
    print(f"[DWH_ENGINE] Connexion échouée : {e}")
    app.config["DWH_ENGINE"] = None

# ── Connexion 2 : SA_CREDIT → scoring comportemental ───────────────────
try:
    sa_engine = _make_engine("SA_CREDIT")
    with sa_engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    app.config["SA_ENGINE"] = sa_engine
    print("[SA_ENGINE] Connexion SA_CREDIT OK")
except Exception as e:
    print(f"[SA_ENGINE] Connexion échouée : {e}")
    app.config["SA_ENGINE"] = None

# ── Blueprints ────────────────────────────────────────────────────────
app.register_blueprint(auth_bp,         url_prefix="/api/auth")
app.register_blueprint(octroi_bp,       url_prefix="/api/octroi")
app.register_blueprint(comportement_bp, url_prefix="/api/comportement")
app.register_blueprint(health_bp,       url_prefix="/api")

if __name__ == "__main__":
    print()
    print("Routes disponibles :")
    print("    POST /api/auth/login")
    print("    POST /api/auth/refresh")
    print("    GET  /api/auth/me")
    print("    POST /api/octroi/predict           [JWT requis]")
    print("    POST /api/comportement/predict     [JWT requis]")
    print()
    app.run(debug=True, port=5000)
