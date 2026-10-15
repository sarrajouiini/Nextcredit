"""
╔══════════════════════════════════════════════════════════════════════╗
║  HistoryService — Historique de conversation persistant par session  ║
║                                                                        ║
║  Chaque session (identifiée par un session_id généré côté navigateur)║
║  a son propre fichier JSON dans history/. L'historique survit donc   ║
║  à un rechargement de page ou une fermeture du navigateur, tant que  ║
║  le navigateur retrouve le même session_id (stocké en localStorage). ║
║                                                                        ║
║  Pour un usage mono-utilisateur (PFE/démo), un fichier JSON par       ║
║  session est largement suffisant — pas besoin d'une vraie base de    ║
║  données pour ce volume.                                              ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import json
import os
from datetime import datetime

HISTORY_DIR = "history"
MAX_MESSAGES_PER_SESSION = 100   # garde-fou : évite un fichier qui grossit sans fin
MAX_MESSAGES_FOR_LLM_CONTEXT = 3  # nb d'échanges passés envoyés au LLM pour le suivi


class HistoryService:

    @staticmethod
    def _session_path(session_id: str) -> str:
        """Chemin du fichier JSON pour une session donnée."""
        os.makedirs(HISTORY_DIR, exist_ok=True)
        # Nettoyage basique du session_id pour éviter tout problème de chemin
        safe_id = "".join(c for c in session_id if c.isalnum() or c in "-_")
        return os.path.join(HISTORY_DIR, f"{safe_id}.json")

    @classmethod
    def load(cls, session_id: str) -> list[dict]:
        """
        Charge l'historique complet d'une session.

        Returns:
            Liste de messages : [{"role": "user"|"assistant", "content": str,
                                   "timestamp": str, "sources": [...]}]
        """
        path = cls._session_path(session_id)
        if not os.path.isfile(path):
            return []
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            return []

    @classmethod
    def append(cls, session_id: str, role: str, content: str,
               sources: list[str] = None) -> None:
        """Ajoute un message à l'historique d'une session et sauvegarde."""
        history = cls.load(session_id)

        history.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat(timespec="seconds"),
            "sources": sources or [],
        })

        # Garde-fou : on ne garde que les N derniers messages
        if len(history) > MAX_MESSAGES_PER_SESSION:
            history = history[-MAX_MESSAGES_PER_SESSION:]

        path = cls._session_path(session_id)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(history, f, ensure_ascii=False, indent=2)

    @classmethod
    def get_recent_context(cls, session_id: str,
                            n: int = MAX_MESSAGES_FOR_LLM_CONTEXT) -> str:
        """
        Retourne les n derniers échanges (question+réponse) formatés en
        texte, pour les injecter dans le prompt et permettre des
        questions de suivi naturelles ("et pour un crédit immobilier ?").
        """
        history = cls.load(session_id)
        if not history:
            return ""

        recent = history[-(n * 2):]  # n échanges = n*2 messages (user+assistant)
        lines = []
        for msg in recent:
            prefix = "Analyste" if msg["role"] == "user" else "Assistant"
            lines.append(f"{prefix} : {msg['content']}")

        return "\n".join(lines)

    @classmethod
    def clear(cls, session_id: str) -> None:
        """Supprime l'historique d'une session (bouton 'Nouvelle conversation')."""
        path = cls._session_path(session_id)
        if os.path.isfile(path):
            os.remove(path)
