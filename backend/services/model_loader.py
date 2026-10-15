"""
╔══════════════════════════════════════════════════════════════════════╗
║  ModelLoader — Chargement des bundles ML  [VERSION FINALE]          ║
║  Charge en mémoire les bundles créés dans Jupyter.                   ║
║                                                                        ║
║  octroi / comportement → un seul fichier .joblib (dict complet)      ║
║    car keras.Model ne se sérialise pas correctement dans un .joblib  ║
║    unique — c'est le format natif produit par autoencoder.save().    ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import joblib
import os


class ModelLoader:
    """Gestionnaire centralisé des modèles ML chargés une fois au démarrage."""

    BUNDLE_PATHS = {
        "octroi":       "models/octroi_bundle.joblib",
        "comportement": "models/comportement_bundle.joblib",   # ✅ activé
    }
    def __init__(self):
        self.bundles = {}

    def load_all(self):
        print("\n[ModelLoader] Chargement des modèles ML...")

        # ── octroi / comportement : bundle .joblib unique ──────────────
        for objectif, path in self.BUNDLE_PATHS.items():
            if os.path.exists(path):
                bundle = joblib.load(path)
                self.bundles[objectif] = bundle
                model = bundle["model"] if isinstance(bundle, dict) else bundle
                threshold = bundle.get("threshold", 0.5) if isinstance(bundle, dict) else 0.5
                print(f"  ✓ {objectif:15} → {type(model).__name__} | seuil={threshold:.2f}")
            else:
                print(f"  ⚠ {objectif:15} → introuvable ({path}) — mode DEMO")
                self.bundles[objectif] = self._create_demo_bundle(objectif)
        print("[ModelLoader] Modèles prêts.\n")


    def get(self, objectif: str) -> dict:
        if objectif not in self.bundles:
            raise ValueError(f"Objectif inconnu: '{objectif}'. "
                             f"Valeurs valides: {list(self.bundles.keys())}")
        return self.bundles[objectif]

    def _create_demo_bundle(self, objectif: str) -> dict:
        from sklearn.ensemble import RandomForestClassifier
        import numpy as np
        X_fake = np.random.rand(200, 10)
        y_fake = np.random.randint(0, 2, 200)
        model = RandomForestClassifier(n_estimators=10, random_state=42)
        model.fit(X_fake, y_fake)
        return {
            "model": model, "preprocessor": None, "explainer": None,
            "feature_names": [f"feature_{i}" for i in range(10)],
            "features": [f"feature_{i}" for i in range(10)],
            "threshold": 0.5, "is_demo": True,
        }
