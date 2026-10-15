"""
╔══════════════════════════════════════════════════════════════════════╗
║  NEXTCREDIT — Flask ML Server  [VERSION FINALE — 2 BASES + JWT]      ║
║                                                                        ║
║  Deux connexions SQL Server distinctes :                             ║
║    DWH_ENGINE → base "Dwh_Credit"  (scoring d'octroi)                 ║
║    SA_ENGINE  → base "SA_CREDIT"   (scoring comportemental)           ║
╚══════════════════════════════════════════════════════════════════════╝
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Chargé AVANT tout import de services/routes : plusieurs modules (ex.
# services.assistant_service) lisent os.environ.get("GROQ_API_KEY", ...)
# au niveau module, donc le .env doit déjà être en mémoire à ce moment-là.
load_dotenv()

from flask              import Flask, render_template
from flask_cors         import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy         import create_engine, text

import threading
from routes.assistant     import assistant_bp
from routes.octroi        import octroi_bp
from routes.comportement  import comportement_bp
from routes.health        import health_bp
from routes.auth          import auth_bp
from routes.monitoring    import monitoring_bp
from routes.admin         import admin_bp
from services.model_loader import ModelLoader
from services.assistant_service import AssistantService

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ── Configuration JWT ────────────────────────────────────────────────
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
        f"&timeout=10"          # timeout connexion ODBC (secondes)
        f"&loginTimeout=10"
    )
    return create_engine(
        conn_str,
        fast_executemany=True,
        pool_pre_ping=True,      # vérifie que la connexion est vivante avant de l'utiliser
        pool_timeout=15,         # max 15s d'attente pour une connexion du pool
        pool_recycle=1800,       # recycle les connexions toutes les 30 min
        pool_size=5,
        max_overflow=10,
        connect_args={"timeout": 10},
    )


# ── Connexion 1 : Dwh_Credit → scoring d'octroi + table Agents ────────
try:
    dwh_engine = _make_engine("Dwh_Credit")
    with dwh_engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    app.config["DWH_ENGINE"] = dwh_engine
    print("[DWH_ENGINE] Connexion Dwh_Credit OK (scoring octroi)")
except Exception as e:
    print(f"[DWH_ENGINE] Connexion échouée : {e}")
    app.config["DWH_ENGINE"] = None

# ── Connexion 2 : SA_CREDIT → scoring comportemental ────────────────────
try:
    sa_engine = _make_engine("SA_CREDIT")
    with sa_engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    app.config["SA_ENGINE"] = sa_engine
    print("[SA_ENGINE] Connexion SA_CREDIT OK (scoring comportemental)")
except Exception as e:
    print(f"[SA_ENGINE] Connexion échouée : {e}")
    app.config["SA_ENGINE"] = None

# ── Blueprints ────────────────────────────────────────────────────────
app.register_blueprint(auth_bp,         url_prefix="/api/auth")
app.register_blueprint(octroi_bp,       url_prefix="/api/octroi")
app.register_blueprint(comportement_bp, url_prefix="/api/comportement")
app.register_blueprint(health_bp,       url_prefix="/api")
app.register_blueprint(assistant_bp,    url_prefix="/api/assistant")
app.register_blueprint(monitoring_bp,   url_prefix="/api/monitoring")
app.register_blueprint(admin_bp,        url_prefix="/api/admin")

def _warmup_assistant():
    """Précharge le modèle d'embedding et ChromaDB au démarrage (thread séparé)."""
    try:
        print("[ASSISTANT] Préchargement du modèle d'embedding en arrière-plan…")
        AssistantService._get_vectordb()
        AssistantService._get_client()
        print("[ASSISTANT] Modèle prêt — première réponse sera instantanée.")
    except Exception as e:
        print(f"[ASSISTANT] Avertissement préchargement : {e}")

threading.Thread(target=_warmup_assistant, daemon=True).start()

if __name__ == "__main__":
    print()
    print("Routes disponibles :")
    print("    POST /api/auth/login")
    print("    GET  /api/octroi/ui")
    print("    POST /api/octroi/predict")
    print("    POST /api/octroi/explain/shap")
    print("    GET  /api/comportement/ui")
    print("    POST /api/comportement/predict")
    print("    POST /api/comportement/explain/shap")
    print("    POST /api/comportement/explain/lime")
    print("    GET  /api/comportement/liste-a-risque")
    print()

    # Le serveur de dev Werkzeug (app.run) coupe parfois des connexions sous
    # charge concurrente, même avec threaded=True — ce n'est pas fait pour ça.
    # Waitress est un serveur WSGI stable, recommandé même en développement.
    try:
        from waitress import serve
        print("[SERVER] Démarrage avec Waitress (serveur WSGI stable)")
        serve(app, host="0.0.0.0", port=5000, threads=8)
    except ImportError:
        print("[SERVER] Waitress non installé (pip install waitress) — "
              "utilisation du serveur de dev Flask (moins stable sous charge).")
        app.run(debug=True, port=5000, threaded=True)