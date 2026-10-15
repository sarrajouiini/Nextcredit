"""
╔══════════════════════════════════════════════════════════════════════╗
║  AssistantService — Assistant bancaire IA (RAG + Groq API)           ║
║                                                                       ║
║  Groq : API gratuite, ultra-rapide (<1s), 14 400 req/jour            ║
║  Modèle : llama-3.1-8b-instant (excellent en français)               ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import os
import httpx
from groq import Groq

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

from services.history_service import HistoryService


class AssistantService:

  
    GROQ_MODEL   = "openai/gpt-oss-120b"
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

    # ── Retrieval ────────────────────────────────────────────────────────
    CHROMA_DB_DIR   = "chroma_db"
    EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

    _vectordb   = None
    _embeddings = None
    _client     = None

    SEUIL_MOTS_QUESTION_COURTE = 6

    # ─────────────────────────────────────────────────────────────────────
    # INITIALISATION (lazy loading)
    # ─────────────────────────────────────────────────────────────────────

    @classmethod
    def _get_client(cls):
        if cls._client is None:
            if not cls.GROQ_API_KEY:
                raise ValueError(
                    "Clé API Groq manquante. "
                    "Créez un compte gratuit sur https://console.groq.com "
                    "et ajoutez GROQ_API_KEY dans votre fichier .env"
                )
            # verify=False : le proxy SSL de l'entreprise intercepte le trafic
            # HTTPS avec un certificat auto-signé, ce qui casse la vérification
            # SSL par défaut (CERTIFICATE_VERIFY_FAILED). On la désactive ici,
            # comme pour HF_HUB_OFFLINE côté HuggingFace.
            cls._client = Groq(
                api_key=cls.GROQ_API_KEY,
                http_client=httpx.Client(verify=False),
            )
        return cls._client

    @classmethod
    def _get_vectordb(cls):
        if cls._vectordb is None:
            cls._embeddings = HuggingFaceEmbeddings(model_name=cls.EMBEDDING_MODEL)
            cls._vectordb = Chroma(
                persist_directory=cls.CHROMA_DB_DIR,
                embedding_function=cls._embeddings,
            )
        return cls._vectordb

    # ─────────────────────────────────────────────────────────────────────
    # RECHERCHE DE CONTEXTE (retrieval)
    # ─────────────────────────────────────────────────────────────────────

    @classmethod
    def _est_question_vague(cls, question: str) -> bool:
        return len(question.strip().split()) <= cls.SEUIL_MOTS_QUESTION_COURTE

    @classmethod
    def _reformuler_avec_contexte(cls, question: str, session_id: str) -> str:
        if not session_id or not cls._est_question_vague(question):
            return question
        historique = HistoryService.load(session_id)
        for msg in reversed(historique):
            if msg.get("role") == "user":
                return f"{question} : {msg.get('content')}"
        return question

    @classmethod
    def _retrieve_context(cls, question: str, k: int = 4) -> list[str]:
        vectordb = cls._get_vectordb()
        docs = vectordb.similarity_search(question, k=k)
        return [doc.page_content for doc in docs]

    # ─────────────────────────────────────────────────────────────────────
    # APPEL À GROQ
    # ─────────────────────────────────────────────────────────────────────

    @classmethod
    def _call_groq(cls, system_prompt: str, user_message: str) -> str:
        try:
            client = cls._get_client()
            completion = client.chat.completions.create(
                model=cls.GROQ_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user",   "content": user_message},
                ],
                temperature=0.3,
                max_tokens=500,
                top_p=0.9,
            )
            return completion.choices[0].message.content.strip()

        except Exception as e:
            err = str(e).lower()
            if "model_not_found" in err or "does not exist" in err:
                return (
                    f"⚠️ Le modèle Groq « {cls.GROQ_MODEL} » n'est plus disponible. "
                    "Consultez la liste à jour sur https://console.groq.com/docs/models "
                    "et mettez à jour GROQ_MODEL dans assistant_service.py"
                )
            if "api_key" in err or ("auth" in err and "invalid_request" not in err) or "invalid api key" in err:
                return (
                    "⚠️ Clé API Groq invalide. "
                    "Vérifiez GROQ_API_KEY dans votre fichier .env — "
                    "créez une clé gratuite sur https://console.groq.com"
                )
            if "rate" in err or "quota" in err:
                return "⚠️ Limite temporaire Groq atteinte. Réessayez dans quelques secondes."
            if "connection" in err or "network" in err:
                return "⚠️ Impossible de contacter Groq. Vérifiez votre connexion Internet."
            return f"⚠️ Erreur lors de la génération : {e}"

    # ─────────────────────────────────────────────────────────────────────
    # CONSTRUCTION DU PROMPT
    # ─────────────────────────────────────────────────────────────────────

    @classmethod
    def _build_prompts(cls, question: str, contexte_docs: list[str],
                       dossier_client: dict = None,
                       historique_recent: str = "") -> tuple[str, str]:

        contexte_txt = "\n\n---\n\n".join(contexte_docs) if contexte_docs else (
            "Aucun document pertinent trouvé dans la base de connaissances."
        )

        dossier_txt = ""
        if dossier_client:
            stype = dossier_client.get("type", "octroi")

            if stype == "comportement":
                inds = dossier_client.get("indicateurs", {})
                bale = dossier_client.get("bale", {})
                recos = dossier_client.get("recommandations", [])
                retard = inds.get("retard_moy_m3", 0)
                retard_str = f"> 90 j" if float(retard) > 90 else f"{retard} j"
                dossier_txt = f"""
═══ SCORING COMPORTEMENTAL — {dossier_client.get('client_code', 'N/A')} ═══
Score          : {dossier_client.get('score', 'N/A')} / 1000
Notation       : {dossier_client.get('notation', 'N/A')} ({dossier_client.get('label', '')})
Décision       : {dossier_client.get('decision', 'N/A')}
Prob. défaut   : {dossier_client.get('pd_pct', 'N/A')} %  (seuil : {dossier_client.get('seuil_pct', 'N/A')} %)

INDICATEURS CLÉS :
- Taux de paiement    : {inds.get('taux_paiement', 'N/A')} %
- Retard moyen M3     : {retard_str}
- Retard externe      : {inds.get('retard_externe', 'N/A')} j
- Score bureau /900   : {inds.get('score_bureau', 'N/A')}
- Pression financière : {inds.get('pression_fin', 'N/A')}
- Revenu mensuel      : {inds.get('revenu_total', 'N/A')} DT
- Montant crédit      : {inds.get('montant_credit', 'N/A')} DT

MÉTRIQUES BÂLE :
- LGD : {bale.get('lgd_pct', 'N/A')} %
- EAD : {bale.get('ead_value', 'N/A')} DT
- Score recouvrement : {bale.get('score_recouvrement', 'N/A')} / 1000

RECOMMANDATIONS MÉTIER (règles) :
{chr(10).join(f'- {r}' for r in recos) if recos else '- Aucune recommandation automatique.'}
═══════════════════════════════════════════════════════
"""
            else:
                # Octroi ou dossier générique
                dossier_txt = f"""
DOSSIER CLIENT EN COURS D'ANALYSE :
- Score : {dossier_client.get('score', 'N/A')} / 1000
- Notation : {dossier_client.get('notation', 'N/A')}
- Décision : {dossier_client.get('decision', 'N/A')}
- Taux d'endettement : {dossier_client.get('taux_endettement', 'N/A')}
- Revenu mensuel : {dossier_client.get('revenu', 'N/A')} DT
- Montant demandé : {dossier_client.get('montant', 'N/A')} DT
"""

        system_prompt = """Tu es un assistant bancaire expert pour NextCredit, une plateforme tunisienne d'analyse de risque crédit.
Tu aides les analystes crédit et agents bancaires à :
- Analyser le scoring comportemental d'un client (score /1000, notation AAA→CCC, décision, indicateurs)
- Interpréter les indicateurs : taux de paiement, retard moyen M3, score bureau, pression financière
- Donner des recommandations opérationnelles concrètes basées sur le profil de risque
- Comprendre la réglementation bancaire tunisienne (BCT, circulaires, loi 2016-35, réglementation 2024)
- Interpréter les métriques Bâle (PD, LGD, EAD, score de recouvrement)

QUAND UN SCORING CLIENT EST FOURNI :
- Commence par présenter clairement : score, notation, décision, PD%
- Explique ce que signifient les indicateurs clés pour CE client spécifiquement
- Donne 3 recommandations opérationnelles concrètes et actionnables
- Mentionne les métriques Bâle si pertinent (LGD, EAD)
- Sois direct et factuel, pas générique

RÈGLES :
- Réponds TOUJOURS en français, de façon claire et professionnelle
- Appuie-toi en priorité sur les données du client fournies, puis sur les documents de la base
- Sois précis et structuré (utilise des sections si l'analyse est longue)
- Ne donne jamais de conseil financier personnel à un particulier
- PÉRIMÈTRE : tu ne traites que la banque, le crédit, le scoring, le risque, la
  réglementation bancaire/financière et l'utilisation de NextCredit. Si la question
  n'a AUCUN rapport avec ces sujets (cuisine, météo, sport, divertissement…) et qu'aucun
  dossier client n'est fourni, réponds UNIQUEMENT par le mot exact : HORS_PERIMETRE"""

        hist_txt = f"\nCONVERSATION PRÉCÉDENTE :\n{historique_recent}\n" if historique_recent else ""

        user_message = f"""{hist_txt}BASE DE CONNAISSANCES PERTINENTE :
{contexte_txt}
{dossier_txt}
QUESTION DE L'ANALYSTE :
{question}"""

        return system_prompt, user_message

    # ─────────────────────────────────────────────────────────────────────
    # POINT D'ENTRÉE PRINCIPAL
    # ─────────────────────────────────────────────────────────────────────

    @classmethod
    def ask(cls, question: str, session_id: str = None,
            dossier_client: dict = None) -> dict:

        # 1. Reformulation si question vague
        question_pour_recherche = cls._reformuler_avec_contexte(question, session_id)

        # 2. Retrieval (2 passages — plus rapide, suffisant pour répondre)
        contexte_docs = cls._retrieve_context(question_pour_recherche, k=2)

        # 3. Historique récent
        historique_recent = ""
        if session_id:
            historique_recent = HistoryService.get_recent_context(session_id)

        # 4. Construction des prompts
        system_prompt, user_message = cls._build_prompts(
            question, contexte_docs, dossier_client, historique_recent
        )

        # 5. Appel Groq
        reponse = cls._call_groq(system_prompt, user_message)

        # 5b. Question hors périmètre : refus clair, sans sources.
        # Les passages récupérés n'ont servi à rien : les afficher laisserait
        # croire que la réponse est sourcée.
        if "HORS_PERIMETRE" in reponse.upper().replace(" ", "_"):
            reponse = ("Cette question sort du périmètre de l'assistant. Je peux vous aider "
                       "sur le scoring de crédit, l'analyse de risque, la réglementation "
                       "bancaire et l'utilisation de NextCredit.")
            contexte_docs = []
        # Les messages d'erreur techniques (⚠️) ne sont pas non plus sourcés
        elif reponse.startswith("⚠️"):
            contexte_docs = []

        # 6. Persistance
        if session_id:
            HistoryService.append(session_id, "user", question)
            HistoryService.append(session_id, "assistant", reponse,
                                   sources=contexte_docs)

        return {
            "reponse": reponse,
            "sources": contexte_docs,
            "a_utilise_dossier": dossier_client is not None,
        }

    # ─────────────────────────────────────────────────────────────────────
    # HISTORIQUE
    # ─────────────────────────────────────────────────────────────────────

    @classmethod
    def get_history(cls, session_id: str) -> list[dict]:
        return HistoryService.load(session_id)

    @classmethod
    def clear_history(cls, session_id: str) -> None:
        HistoryService.clear(session_id)
