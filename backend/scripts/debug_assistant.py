"""
debug_assistant.py — Isole où le problème se situe : recherche vectorielle
(ChromaDB) ou génération (Ollama/Phi-3).

Usage : python debug_assistant.py
À lancer depuis la racine nextcredit_flask1/ (même endroit que app.py).
"""

import os

print("=" * 65)
print("  DIAGNOSTIC ASSISTANT — Recherche vectorielle vs génération LLM")
print("=" * 65)

# ── TEST 1 : la base chroma_db/ existe-t-elle et a-t-elle du contenu ? ─
print("\n[TEST 1] Vérification du dossier chroma_db/")
print(f"   Dossier d'exécution actuel : {os.getcwd()}")

chroma_path = "chroma_db"
if not os.path.isdir(chroma_path):
    print(f"   ❌ Le dossier '{chroma_path}' n'existe pas ici.")
    print(f"      → Lance build_knowledge_base.py depuis CET endroit.")
    exit(1)

contenu = os.listdir(chroma_path)
print(f"   ✅ Dossier trouvé. Contenu : {contenu}")

if not contenu:
    print(f"   ❌ Le dossier est VIDE — l'indexation n'a probablement pas réussi.")
    exit(1)

# ── TEST 2 : combien de documents sont réellement indexés ? ───────────
print("\n[TEST 2] Nombre de documents indexés dans ChromaDB")
try:
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from langchain_community.vectorstores import Chroma

    EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

    print(f"   ⏳ Chargement du modèle d'embeddings ({EMBEDDING_MODEL})...")
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    vectordb = Chroma(persist_directory=chroma_path, embedding_function=embeddings)

    # Nombre total de chunks indexés
    collection = vectordb._collection
    count = collection.count()
    print(f"   ✅ Nombre de chunks indexés : {count}")

    if count == 0:
        print("   ❌ PROBLÈME CONFIRMÉ : la base est vide malgré le dossier présent.")
        print("      → Relance build_knowledge_base.py depuis ce même dossier.")
        exit(1)

except Exception as e:
    print(f"   ❌ Erreur lors du chargement de ChromaDB : {e}")
    exit(1)

# ── TEST 3 : la recherche retrouve-t-elle le bon passage ? ─────────────
print("\n[TEST 3] Test de recherche pour 'taux d'endettement'")
question_test = "Qu'est-ce que le taux d'endettement ?"
try:
    docs = vectordb.similarity_search(question_test, k=3)
    print(f"   Nombre de résultats : {len(docs)}")

    trouve_dti = False
    for i, doc in enumerate(docs):
        contenu_doc = doc.page_content
        print(f"\n   --- Résultat {i+1} ---")
        print(f"   {contenu_doc[:200]}...")
        if "endettement" in contenu_doc.lower() or "dti" in contenu_doc.lower():
            trouve_dti = True

    print()
    if trouve_dti:
        print("   ✅ La recherche retrouve bien le passage sur le taux d'endettement.")
        print("      → Le problème est donc côté LLM (Phi-3), pas ChromaDB.")
    else:
        print("   ❌ La recherche NE retrouve PAS le passage attendu.")
        print("      → Le glossaire n'est probablement pas indexé dans CETTE base,")
        print("        ou un autre contenu a été indexé à la place.")

except Exception as e:
    print(f"   ❌ Erreur lors de la recherche : {e}")

# ── TEST 4 : avec scores de similarité (pour voir si c'est juste limite)
print("\n[TEST 4] Recherche avec scores de similarité")
try:
    docs_scores = vectordb.similarity_search_with_score(question_test, k=3)
    for doc, score in docs_scores:
        print(f"   Score: {score:.4f} | {doc.page_content[:100]}...")
    print("\n   (Plus le score est BAS, plus le résultat est pertinent — dépend de la métrique)")
except Exception as e:
    print(f"   ⚠️ Impossible de récupérer les scores : {e}")

print("\n" + "=" * 65)
print("  FIN DU DIAGNOSTIC")
print("=" * 65)
