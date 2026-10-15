"""
╔══════════════════════════════════════════════════════════════════════╗
║  build_knowledge_base.py — Indexation de la base de connaissances    ║
║                                                                        ║
║  À lancer UNE SEULE FOIS (ou chaque fois que tu ajoutes des documents)║
║  pour construire la base vectorielle ChromaDB utilisée par           ║
║  l'assistant pour répondre aux questions métier générales.            ║
║                                                                        ║
║  Usage : python build_knowledge_base.py                              ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import os
import glob

from langchain_community.document_loaders import TextLoader, PyPDFLoader
try:
    # langchain >= 0.2 (package séparé)
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    # langchain < 0.2 (ancienne organisation)
    from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# ─────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────

KNOWLEDGE_DIR  = "knowledge_base"        # dossier contenant .md et .pdf
CHROMA_DB_DIR  = "chroma_db"              # où la base vectorielle est stockée
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
# ↑ Modèle d'embeddings multilingue (gère le français), léger (~470 Mo),
#   tourne en CPU sans problème.

CHUNK_SIZE    = 700   # taille des morceaux — augmentée pour garder chaque
                       # circulaire complète (titre + objet + description)
                       # dans un seul chunk plutôt que de la scinder
CHUNK_OVERLAP = 100    # chevauchement entre morceaux pour ne pas couper le sens


def load_documents():
    """Charge tous les documents .md et .pdf du dossier knowledge_base/."""
    documents = []

    # ── Fichiers Markdown/texte ───────────────────────────────────────
    for path in glob.glob(os.path.join(KNOWLEDGE_DIR, "**/*.md"), recursive=True):
        print(f"  📄 Chargement : {path}")
        loader = TextLoader(path, encoding="utf-8")
        documents.extend(loader.load())

    for path in glob.glob(os.path.join(KNOWLEDGE_DIR, "**/*.txt"), recursive=True):
        print(f"  📄 Chargement : {path}")
        loader = TextLoader(path, encoding="utf-8")
        documents.extend(loader.load())

    # ── Fichiers PDF (tes futurs documents bancaires) ─────────────────
    for path in glob.glob(os.path.join(KNOWLEDGE_DIR, "**/*.pdf"), recursive=True):
        print(f"  📄 Chargement PDF : {path}")
        loader = PyPDFLoader(path)
        pdf_docs = loader.load()

        # Vérification : un PDF scanné (image sans OCR) produit des
        # pages avec un texte vide ou quasi-vide — on prévient l'usager
        # plutôt que de l'indexer silencieusement pour rien.
        total_chars = sum(len(d.page_content.strip()) for d in pdf_docs)
        avg_chars_per_page = total_chars / max(len(pdf_docs), 1)

        if avg_chars_per_page < 50:
            print(f"     ⚠️  ATTENTION : très peu de texte extrait "
                  f"({avg_chars_per_page:.0f} caractères/page en moyenne).")
            print(f"        Ce PDF est probablement SCANNÉ (image) sans OCR.")
            print(f"        → Passe-le dans un outil OCR avant de l'indexer, "
                  f"sinon son contenu sera invisible pour l'assistant.")
        else:
            print(f"     ✓ {len(pdf_docs)} page(s), "
                  f"~{avg_chars_per_page:.0f} caractères/page")

        documents.extend(pdf_docs)

    return documents


def main():
    print("=" * 65)
    print("  CONSTRUCTION DE LA BASE DE CONNAISSANCES NEXTCREDIT")
    print("=" * 65)

    # ── 1. Charger les documents ───────────────────────────────────────
    print("\n⏳ Chargement des documents...")
    documents = load_documents()
    print(f"✅ {len(documents)} document(s) chargé(s)")

    if not documents:
        print("⚠️  Aucun document trouvé dans knowledge_base/")
        print("   Vérifie que glossaire_bancaire.md y est présent.")
        return

    # ── 2. Découper en morceaux (chunks) ───────────────────────────────
    print("\n⏳ Découpage en morceaux...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n## ", "\n### ", "\n\n", "\n", ". ", " "],
    )
    chunks = splitter.split_documents(documents)
    print(f"✅ {len(chunks)} morceaux créés")

    # ── 3. Générer les embeddings et stocker dans ChromaDB ─────────────
    print(f"\n⏳ Génération des embeddings ({EMBEDDING_MODEL})...")
    print("   (premier lancement : téléchargement du modèle ~470 Mo)")

    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    print("⏳ Indexation dans ChromaDB...")
    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DB_DIR,
    )
    vectordb.persist()

    print(f"\n✅ Base de connaissances construite avec succès")
    print(f"   Emplacement : {CHROMA_DB_DIR}/")
    print(f"   Morceaux indexés : {len(chunks)}")
    print("\n➡️  Tu peux maintenant lancer l'assistant (app.py)")


if __name__ == "__main__":
    main()