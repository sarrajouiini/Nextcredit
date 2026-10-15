"""
╔══════════════════════════════════════════════════════════════════════╗
║  DbService — Stockage des décisions d'octroi (SQL Server)           ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import json
from datetime import datetime
from sqlalchemy import text


def sauvegarder_decision(engine, data: dict, result: dict) -> int:
    """
    Sauvegarde la décision du modèle dans OctroisDecisions.
    Retourne l'Id généré.
    """
    sql = text("""
        INSERT INTO OctroisDecisions
            (DonneesClient, Score, Notation, ProbabiliteDefaut,
             DecisionModele, ModeDecision, MotifsModele, Statut)
        OUTPUT INSERTED.Id
        VALUES
            (:donnees, :score, :notation, :pd,
             :decision_modele, :mode, :motifs, 'EN_ATTENTE')
    """)
    with engine.begin() as conn:
        row = conn.execute(sql, {
            "donnees":         json.dumps(data, ensure_ascii=False),
            "score":           result.get("score"),
            "notation":        result.get("notation"),
            "pd":              result.get("pd_value"),
            "decision_modele": result.get("decision"),
            "mode":            result.get("mode_decision"),
            "motifs":          json.dumps(result.get("motifs", []), ensure_ascii=False),
        }).fetchone()
    return int(row[0])


def confirmer_decision_agent(
    engine,
    decision_id: int,
    decision_agent: str,        # "APPROUVE" ou "REFUSE"
    decision_modele: str,       # décision originale du modèle
    motif_acceptation: str = None,
    motif_rejet: str = None,
    agent_id: str = "agent",
) -> dict:
    """
    Enregistre la décision finale de l'agent.

    Règles métier :
    ┌─────────────────────────────────────────────────────────┐
    │ Modèle    │ Agent     │ FlagConfirm │ Résultat          │
    ├───────────┼───────────┼─────────────┼───────────────────┤
    │ APPROUVE  │ APPROUVE  │     1       │ Agent confirme    │
    │ APPROUVE  │ REFUSE    │     0       │ Agent override    │
    │ REFUSE    │ REFUSE    │     1       │ Agent confirme    │
    │ REFUSE    │ APPROUVE  │     0       │ Agent override ⚠  │
    │ REVUE     │ APPROUVE  │  dépend     │ Agent décide      │
    │ REVUE     │ REFUSE    │  dépend     │ Agent décide      │
    └─────────────────────────────────────────────────────────┘
    """
    # Comparaison simple modèle vs agent
    modele_norm = decision_modele.upper().replace("REVUE_MANUELLE", "REVUE")
    agent_norm  = decision_agent.upper()

    if modele_norm == "REVUE":
        # Revue manuelle : l'agent décide souverainement
        flag = True   # on considère qu'il confirme le process
    else:
        flag = (modele_norm == agent_norm)

    sql = text("""
        UPDATE OctroisDecisions SET
            DecisionAgent      = :decision_agent,
            FlagAgentConfirm   = :flag,
            MotifAcceptation   = :motif_acc,
            MotifRejet         = :motif_rej,
            AgentId            = :agent_id,
            DateDecisionAgent  = :date_dec,
            Statut             = 'CONFIRME'
        WHERE Id = :id
    """)
    with engine.begin() as conn:
        conn.execute(sql, {
            "decision_agent": agent_norm,
            "flag":           1 if flag else 0,
            "motif_acc":      motif_acceptation,
            "motif_rej":      motif_rejet,
            "agent_id":       agent_id,
            "date_dec":       datetime.now(),
            "id":             decision_id,
        })

    return {
        "id":               decision_id,
        "decision_agent":   agent_norm,
        "decision_modele":  decision_modele,
        "flag_agent_confirm": flag,
        "override":         not flag,
        "motif_acceptation": motif_acceptation,
        "motif_rejet":       motif_rejet,
    }


def get_decision(engine, decision_id: int) -> dict:
    """Récupère une décision par son Id."""
    sql = text("SELECT * FROM OctroisDecisions WHERE Id = :id")
    with engine.connect() as conn:
        row = conn.execute(sql, {"id": decision_id}).mappings().fetchone()
    if not row:
        return None
    return dict(row)


def get_dossiers_en_attente(engine, limit: int = 50) -> list:
    """Liste des dossiers en attente de validation agent."""
    sql = text("""
        SELECT Id, DateDemande, DonneesClient, Score, Notation, ProbabiliteDefaut,
               DecisionModele, ModeDecision, MotifsModele,
               DecisionAgent, FlagAgentConfirm, AgentId, DateDecisionAgent, Statut
        FROM   OctroisDecisions
        WHERE  Statut = 'EN_ATTENTE'
        ORDER  BY DateDemande DESC
        OFFSET 0 ROWS FETCH NEXT :limit ROWS ONLY
    """)
    with engine.connect() as conn:
        rows = conn.execute(sql, {"limit": limit}).mappings().fetchall()
    result = []
    for r in rows:
        d = dict(r)
        if d.get("DonneesClient"):
            try:
                d["DonneesClient"] = json.loads(d["DonneesClient"])
            except Exception:
                pass
        if d.get("MotifsModele"):
            try:
                d["MotifsModele"] = json.loads(d["MotifsModele"])
            except Exception:
                pass
        result.append(d)
    return result
