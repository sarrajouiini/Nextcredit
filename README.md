# NextCredit

Plateforme de **scoring de crédit bancaire** basée sur l'intelligence artificielle : scoring d'octroi, scoring comportemental, assistant IA réglementaire, monitoring des modèles et tableaux de bord décisionnels.

Le projet est composé de deux parties :

| Dossier | Technologie | Rôle |
|---|---|---|
| [`frontend/`](frontend) | Angular 17 (standalone components) | Site vitrine + espace agent bancaire |
| [`backend/`](backend) | Python / Flask | API REST, modèles ML, assistant IA, monitoring |

## Fonctionnalités

**Site vitrine**
- Présentation du produit, des solutions, des services IA et des tarifs
- Blog d'articles, page entreprise, réservation de démo et formulaire de contact (envoi d'emails via EmailJS)
- Interface bilingue FR / EN

**Espace agent bancaire**
- **Scoring d'octroi** : score, notation et décision du modèle, avec explicabilité (SHAP)
- **Scoring comportemental** : probabilité de défaut, indicateurs de risque, historique de paiements
- **Dossiers en attente** : validation ou modification de la décision du modèle par l'agent
- **Alertes risque** : clients à haut risque
- **Assistant IA** : questions-réponses sur la réglementation bancaire (RAG)
- **Monitoring IA** : détection de dérive du modèle (taux d'override, PSI)
- **Tableaux de bord Power BI** : vue globale, retard et défaut, profil clients, performance du portefeuille
- **Profil** et **gestion des comptes** (réservée aux administrateurs, avec plafond selon le plan)
- Guide interactif de première connexion

## Architecture

```
Nextcredit/
├── frontend/                  # Application Angular
│   └── src/app/
│       ├── core/              # Services, guards, interceptors, modèles
│       ├── layouts/           # Layout public et layout agent
│       ├── features/
│       │   ├── public/        # Site vitrine (home, produit, tarifs, article, login…)
│       │   └── agent/         # Espace agent (dashboard, octroi, monitoring, admin…)
│       └── shared/            # Composants réutilisables (sidebar, tour, bi-frame…)
│
└── backend/                   # API Flask
    ├── app.py                 # Point d'entrée, enregistrement des blueprints
    ├── routes/                # auth, octroi, comportement, assistant, monitoring, admin
    ├── services/              # Logique métier (scoring, XAI, monitoring, auth, admin…)
    ├── models/                # Modèles ML sérialisés (octroi, comportement)
    ├── templates/             # Interfaces HTML servies par Flask
    ├── knowledge_base/        # Documents réglementaires pour l'assistant IA
    └── utils/                 # Validation, formatage des réponses
```

## Prérequis

- Node.js 18+ et npm
- Python 3.10+
- SQL Server avec les bases `Dwh_Credit` et `SA_CREDIT`
- ODBC Driver 17 for SQL Server

## Installation et lancement

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements_assistant.txt
pip install flask-cors flask-jwt-extended sqlalchemy pyodbc bcrypt python-dotenv \
            pandas numpy scikit-learn joblib shap lime waitress

cp .env.example .env           # puis renseigner les clés (voir ci-dessous)
python app.py                  # API disponible sur http://127.0.0.1:5000
```

Variables d'environnement (`backend/.env`) :

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Clé API Google Gemini |
| `GROQ_API_KEY` | Clé API Groq (assistant IA) |
| `JWT_SECRET_KEY` | Clé de signature des tokens JWT |

> Le fichier `.env` n'est jamais versionné. Ne publiez jamais vos clés.

### Frontend

```bash
cd frontend
npm install
npm start                      # http://localhost:4200
```

En développement, les appels `/api/*` sont redirigés vers Flask (`127.0.0.1:5000`) par le proxy défini dans `frontend/proxy.conf.json`, ce qui évite les problèmes de CORS.

## Configuration

- **EmailJS** (formulaires démo et contact) : identifiants dans `frontend/src/app/features/public/entreprise/entreprise.component.ts` et `frontend/src/index.html`.
- **Power BI** : URLs des rapports dans `frontend/src/environments/environment.ts`.
- **Coordonnées de la banque** (page profil) : `bankInfo` dans `frontend/src/environments/environment.ts`.

## Sécurité

- Authentification par **JWT** (access + refresh token), intercepteur Angular avec rafraîchissement automatique
- Mots de passe hachés avec **bcrypt**
- Routes d'administration protégées par contrôle de rôle côté serveur
- Routes agent protégées par un guard Angular

## Auteure

Sarra Jouini — Projet de fin d'études
