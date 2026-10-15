"""
Script de diagnostic — à placer à la racine de nextcredit_flask1
puis lancer avec : python test_fraude_loader.py
"""

print("=" * 60)
print("TEST 1 — La méthode _load_fraude_bundle existe-t-elle ?")
print("=" * 60)

from services.model_loader import ModelLoader

has_method = hasattr(ModelLoader, "_load_fraude_bundle")
print(f"Méthode présente : {has_method}")

if not has_method:
    print()
    print("❌ PROBLÈME TROUVÉ : le fichier services/model_loader.py")
    print("   n'a pas été remplacé par la nouvelle version.")
    print("   → Recopie le contenu complet du fichier fourni dans")
    print("     services/model_loader.py et sauvegarde.")
    exit()

print()
print("=" * 60)
print("TEST 2 — Chargement réel du bundle fraude")
print("=" * 60)

loader = ModelLoader()
bundle = loader._load_fraude_bundle()

print()
print("Clés du bundle obtenu :", list(bundle.keys()))

if "is_demo" in bundle:
    print()
    print("❌ PROBLÈME TROUVÉ : le bundle est en MODE DEMO.")
    print("   Le chargement réel a échoué silencieusement.")
    print("   Regarde le message '⚠ fraude' affiché juste au-dessus —")
    print("   il contient le message d'erreur exact entre parenthèses.")
elif "scaler" in bundle:
    print()
    print("✅ Le bundle est correctement chargé avec la clé 'scaler'.")
    print("   Le problème vient donc d'ailleurs (vérifier que Flask")
    print("   a bien été relancé après la modification du fichier).")
else:
    print()
    print("⚠️  Bundle chargé mais sans 'is_demo' ni 'scaler' — cas inattendu.")