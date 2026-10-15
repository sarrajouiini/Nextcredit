"""
Lance ce script à la racine de nextcredit_flask1 pour voir
la liste exacte des features attendues par ton modèle fraude.
"""
import joblib

features = joblib.load("models/features_fraude.pkl")
print(f"Nombre de features : {len(features)}")
print()
for i, f in enumerate(features, 1):
    print(f"  {i:2d}. {f}")
