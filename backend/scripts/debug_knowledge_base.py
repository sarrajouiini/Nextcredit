"""
Script de diagnostic — à lancer EXACTEMENT comme build_knowledge_base.py
(même dossier, même commande) pour voir précisément où ça bloque.

Usage : python debug_knowledge_base.py
"""

import os
import glob

print("=" * 65)
print("  DIAGNOSTIC — Pourquoi 0 document(s) trouvé(s) ?")
print("=" * 65)

# ── TEST 1 : où sommes-nous exactement ? ───────────────────────────────
print("\n[TEST 1] Dossier d'exécution actuel")
cwd = os.getcwd()
print(f"   os.getcwd() = {cwd}")

# ── TEST 2 : KNOWLEDGE_DIR tel que défini dans le script original ─────
print("\n[TEST 2] Variable KNOWLEDGE_DIR")
KNOWLEDGE_DIR = "knowledge_base"
print(f"   KNOWLEDGE_DIR = '{KNOWLEDGE_DIR}' (chemin relatif)")

chemin_absolu_attendu = os.path.abspath(KNOWLEDGE_DIR)
print(f"   → chemin absolu résolu : {chemin_absolu_attendu}")

# ── TEST 3 : ce dossier existe-t-il vraiment à cet endroit ? ───────────
print("\n[TEST 3] Le dossier knowledge_base/ existe-t-il ici ?")
existe = os.path.isdir(KNOWLEDGE_DIR)
print(f"   os.path.isdir('{KNOWLEDGE_DIR}') = {existe}")

if not existe:
    print("\n   ❌ PROBLÈME TROUVÉ : le dossier knowledge_base/")
    print(f"      n'existe pas à cet emplacement : {chemin_absolu_attendu}")
    print("      → Tu n'es probablement pas dans le bon dossier.")
    print("      → Lance ce script depuis nextcredit_flask1/ (la racine),")
    print("        pas depuis scripts/ ni depuis knowledge_base/.")
else:
    print("   ✅ Le dossier existe à cet endroit.")

# ── TEST 4 : que contient-il réellement ? ───────────────────────────────
print("\n[TEST 4] Contenu réel du dossier knowledge_base/")
if existe:
    fichiers = os.listdir(KNOWLEDGE_DIR)
    if fichiers:
        for f in fichiers:
            chemin_complet = os.path.join(KNOWLEDGE_DIR, f)
            taille = os.path.getsize(chemin_complet) if os.path.isfile(chemin_complet) else "DIR"
            print(f"   - {f}  (taille: {taille})")
    else:
        print("   ⚠️  Le dossier est VIDE.")
else:
    print("   (impossible, le dossier n'existe pas — voir TEST 3)")

# ── TEST 5 : le glob utilisé par le vrai script trouve-t-il le fichier ?
print("\n[TEST 5] Test du glob exact utilisé par build_knowledge_base.py")
pattern_md  = os.path.join(KNOWLEDGE_DIR, "**/*.md")
pattern_txt = os.path.join(KNOWLEDGE_DIR, "**/*.txt")
pattern_pdf = os.path.join(KNOWLEDGE_DIR, "**/*.pdf")

print(f"   Pattern .md  : {pattern_md}")
resultats_md = glob.glob(pattern_md, recursive=True)
print(f"   → Résultats  : {resultats_md}")

print(f"\n   Pattern .pdf : {pattern_pdf}")
resultats_pdf = glob.glob(pattern_pdf, recursive=True)
print(f"   → Résultats  : {resultats_pdf}")

if not resultats_md and not resultats_pdf:
    print("\n   ❌ Le glob ne trouve RIEN, même si le fichier existe visuellement.")
    print("      Causes possibles :")
    print("      a) L'extension du fichier n'est pas exactement '.md'")
    print("         (vérifier qu'il ne s'appelle pas 'glossaire_bancaire.md.txt'")
    print("          ou autre extension cachée par Windows)")
    print("      b) Un souci d'encodage de caractères dans le nom de fichier")

# ── TEST 6 : tenter de charger le fichier avec TextLoader (vrai test) ──
print("\n[TEST 6] Tentative de chargement réel avec TextLoader")
try:
    from langchain_community.document_loaders import TextLoader
    chemin_fichier = os.path.join(KNOWLEDGE_DIR, "glossaire_bancaire.md")
    if os.path.isfile(chemin_fichier):
        loader = TextLoader(chemin_fichier, encoding="utf-8")
        docs = loader.load()
        print(f"   ✅ Chargement réussi : {len(docs)} document(s)")
        print(f"   Aperçu : {docs[0].page_content[:100]}...")
    else:
        print(f"   ❌ Le fichier n'existe pas à : {chemin_fichier}")
except Exception as e:
    print(f"   ❌ Erreur lors du chargement : {e}")

print("\n" + "=" * 65)
print("  FIN DU DIAGNOSTIC")
print("=" * 65)
