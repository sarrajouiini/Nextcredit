"""
MonitoringService — Détection de dérive des modèles ML
- Data drift    : distribution des features d'entrée
- Prediction drift : distribution des scores / PD
- Performance drift : taux d'override agent
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sqlalchemy import text


class MonitoringService:

    # Seuils d'alerte
    SEUIL_OVERRIDE_PCT   = 20.0   # % override agent → alerte
    SEUIL_SCORE_DELTA    = 50     # points de score moyen → alerte
    SEUIL_DRIFT_PSI      = 0.2   # PSI > 0.2 → dérive significative

    # ─────────────────────────────────────────────────────────────────
    # 1. DÉRIVE DE PERFORMANCE (basée sur les décisions agent)
    # ─────────────────────────────────────────────────────────────────

    @classmethod
    def performance_drift(cls, engine_dwh) -> dict:
        """
        Analyse les overrides agent dans OctroisDecisions.
        Un override = l'agent n'est pas d'accord avec le modèle.
        Taux d'override élevé → modèle dérive.
        """
        sql = text("""
            SELECT
                CAST(DateDecisionAgent AS DATE)           AS Jour,
                COUNT(*)                                  AS Total,
                SUM(CASE WHEN FlagAgentConfirm = 0
                    THEN 1 ELSE 0 END)                    AS Overrides,
                AVG(CAST(Score AS float))                 AS Score_Moyen,
                AVG(CAST(ProbabiliteDefaut AS float))     AS PD_Moyenne,
                SUM(CASE WHEN DecisionModele = 'APPROUVE'
                    THEN 1 ELSE 0 END)                    AS Nb_Approuves,
                SUM(CASE WHEN DecisionModele = 'REFUSE'
                    THEN 1 ELSE 0 END)                    AS Nb_Refuses,
                SUM(CASE WHEN DecisionModele = 'REVUE_MANUELLE'
                    THEN 1 ELSE 0 END)                    AS Nb_Revues
            FROM OctroisDecisions
            WHERE DecisionAgent IS NOT NULL
              AND DateDecisionAgent >= DATEADD(day, -90, GETDATE())
            GROUP BY CAST(DateDecisionAgent AS DATE)
            ORDER BY Jour DESC
        """)

        try:
            with engine_dwh.connect() as conn:
                df = pd.read_sql(sql, conn)
        except Exception as e:
            return {"error": str(e)}

        if df.empty:
            return {"message": "Aucune décision agent enregistrée", "alertes": []}

        total       = int(df["Total"].sum())
        overrides   = int(df["Overrides"].sum())
        pct_override = round(overrides / total * 100, 1) if total else 0
        score_moyen  = round(df["Score_Moyen"].mean(), 1)

        # Comparer première moitié vs deuxième moitié de la période
        mi = len(df) // 2
        score_recent  = round(df.iloc[:mi]["Score_Moyen"].mean(), 1) if mi else score_moyen
        score_ancien  = round(df.iloc[mi:]["Score_Moyen"].mean(), 1) if mi else score_moyen
        delta_score   = round(score_recent - score_ancien, 1)

        alertes = []
        if pct_override > cls.SEUIL_OVERRIDE_PCT:
            alertes.append({
                "type": "OVERRIDE_ELEVE",
                "message": f"Taux d'override agent = {pct_override}% > {cls.SEUIL_OVERRIDE_PCT}% — le modèle diverge des décisions humaines",
                "severite": "CRITIQUE" if pct_override > 35 else "ATTENTION",
            })
        if abs(delta_score) > cls.SEUIL_SCORE_DELTA:
            direction = "baissé" if delta_score < 0 else "monté"
            alertes.append({
                "type": "DRIFT_SCORE",
                "message": f"Score moyen a {direction} de {abs(delta_score)} points entre ancienne et nouvelle période",
                "severite": "ATTENTION",
            })

        return {
            "periode":        "90 derniers jours",
            "total_decisions": total,
            "overrides":      overrides,
            "pct_override":   pct_override,
            "score_moyen":    score_moyen,
            "delta_score_recent_vs_ancien": delta_score,
            "distribution_modele": {
                "approuves": int(df["Nb_Approuves"].sum()),
                "refuses":   int(df["Nb_Refuses"].sum()),
                "revues":    int(df["Nb_Revues"].sum()),
            },
            "historique_quotidien": df.to_dict(orient="records"),
            "alertes": alertes,
            "recommandation": cls._recommandation_performance(pct_override, delta_score),
        }

    @classmethod
    def _recommandation_performance(cls, pct_override: float, delta_score: float) -> str:
        if pct_override > 35:
            return "RÉENTRAÎNEMENT URGENT — le modèle est désaligné avec les décisions métier"
        if pct_override > cls.SEUIL_OVERRIDE_PCT:
            return "Planifier un réentraînement dans les 2-4 semaines avec les nouvelles décisions agent"
        if abs(delta_score) > cls.SEUIL_SCORE_DELTA:
            return "Surveiller l'évolution — analyser si la qualité du portefeuille a réellement changé"
        return "Modèle stable — aucune action requise"

    # ─────────────────────────────────────────────────────────────────
    # 2. DÉRIVE DES PRÉDICTIONS (distribution des scores)
    # ─────────────────────────────────────────────────────────────────

    @classmethod
    def prediction_drift(cls, engine_dwh) -> dict:
        """
        Compare la distribution des scores/décisions sur les 30 derniers jours
        vs les 30 jours précédents.
        PSI (Population Stability Index) > 0.2 = dérive significative.
        """
        sql = text("""
            SELECT
                Score,
                ProbabiliteDefaut,
                DecisionModele,
                DateDemande
            FROM OctroisDecisions
            WHERE DateDemande >= DATEADD(day, -60, GETDATE())
        """)

        try:
            with engine_dwh.connect() as conn:
                df = pd.read_sql(sql, conn)
        except Exception as e:
            return {"error": str(e)}

        if df.empty or len(df) < 20:
            return {"message": "Pas assez de données (< 20 dossiers) pour analyser la dérive"}

        df["DateDemande"] = pd.to_datetime(df["DateDemande"])
        coupure = df["DateDemande"].max() - timedelta(days=30)
        recent  = df[df["DateDemande"] >= coupure]
        ancien  = df[df["DateDemande"] <  coupure]

        if len(recent) < 5 or len(ancien) < 5:
            return {"message": "Période trop courte pour comparer"}

        # PSI sur le score (bucketing en 10 intervalles)
        psi_score = cls._calcul_psi(
            ancien["Score"].dropna().values,
            recent["Score"].dropna().values,
            buckets=10, min_val=0, max_val=1000
        )

        # Distribution des décisions
        def dist_decisions(d):
            total = len(d)
            return {
                k: round(v / total * 100, 1)
                for k, v in d["DecisionModele"].value_counts().items()
            } if total else {}

        return {
            "periode_recente":  f"{coupure.date()} → aujourd'hui ({len(recent)} dossiers)",
            "periode_ancienne": f"30 jours avant ({len(ancien)} dossiers)",
            "psi_score": round(psi_score, 4),
            "interpretation_psi": cls._interpreter_psi(psi_score),
            "score_moyen_recent":  round(float(recent["Score"].mean()), 1),
            "score_moyen_ancien":  round(float(ancien["Score"].mean()), 1),
            "pd_moyenne_recente":  round(float(recent["ProbabiliteDefaut"].mean()) * 100, 2),
            "pd_moyenne_ancienne": round(float(ancien["ProbabiliteDefaut"].mean()) * 100, 2),
            "decisions_recentes":  dist_decisions(recent),
            "decisions_anciennes": dist_decisions(ancien),
            "alerte": psi_score > cls.SEUIL_DRIFT_PSI,
        }

    @staticmethod
    def _calcul_psi(reference: np.ndarray, actuel: np.ndarray,
                    buckets: int = 10, min_val: float = 0, max_val: float = 1000) -> float:
        """Population Stability Index — mesure la dérive de distribution."""
        bins = np.linspace(min_val, max_val, buckets + 1)
        ref_counts, _ = np.histogram(reference, bins=bins)
        act_counts, _ = np.histogram(actuel,    bins=bins)

        ref_pct = ref_counts / len(reference)
        act_pct = act_counts / len(actuel)

        # Éviter division par zéro
        ref_pct = np.where(ref_pct == 0, 0.0001, ref_pct)
        act_pct = np.where(act_pct == 0, 0.0001, act_pct)

        psi = np.sum((act_pct - ref_pct) * np.log(act_pct / ref_pct))
        return float(psi)

    @staticmethod
    def _interpreter_psi(psi: float) -> str:
        if psi < 0.1:
            return "Stable — aucune dérive significative"
        if psi < 0.2:
            return "Dérive légère — surveiller l'évolution"
        return "Dérive significative — réentraînement recommandé"

    # ─────────────────────────────────────────────────────────────────
    # 3. RAPPORT COMPLET
    # ─────────────────────────────────────────────────────────────────

    @classmethod
    def rapport_complet(cls, engine_dwh) -> dict:
        perf = cls.performance_drift(engine_dwh)
        pred = cls.prediction_drift(engine_dwh)

        nb_alertes = len(perf.get("alertes", [])) + (1 if pred.get("alerte") else 0)
        statut_global = "CRITIQUE" if nb_alertes >= 2 else ("ATTENTION" if nb_alertes == 1 else "OK")

        return {
            "genere_le":       datetime.now().isoformat(),
            "statut_global":   statut_global,
            "nb_alertes":      nb_alertes,
            "performance":     perf,
            "prediction_drift": pred,
        }
