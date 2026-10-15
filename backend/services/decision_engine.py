"""
╔══════════════════════════════════════════════════════════════════════╗
║  DecisionEngine — Couche de décision hybride (règles métier + ML)     ║
║                                                                        ║
║  POURQUOI ?                                                            ║
║  Le scoring actuel décide uniquement sur « PD < seuil ». Résultat :   ║
║  un client avec 50% d'endettement et des scores bureau à 290 peut     ║
║  ressortir « APPROUVÉ / AA » alors que les indicateurs affichent      ║
║  « ATTENTION ». C'est incohérent et non conforme aux pratiques        ║
║  bancaires.                                                            ║
║                                                                        ║
║  Une banque combine toujours :                                         ║
║    1. Des RÈGLES dures (knock-out) : conditions éliminatoires          ║
║       indépendantes du modèle (endettement, âge, scores planchers).   ║
║    2. Le SCORE ML : pour la zone « grise » non tranchée par les règles.║
║    3. Une BANDE de revue manuelle : les cas limites ne sont ni        ║
║       acceptés ni refusés automatiquement → analyste humain.          ║
║                                                                        ║
║  Cette couche s'intercale APRÈS ScoringService.predict() et AVANT     ║
║  de renvoyer la réponse à Angular.                                     ║
╚══════════════════════════════════════════════════════════════════════╝
"""

from dataclasses import dataclass, field


@dataclass
class PolicyRules:
    """Règles métier paramétrables (à valider avec le métier/risque)."""
    endettement_max: float = 0.45        # > 45% → refus automatique
    age_min: int = 18
    age_max: int = 75                    # âge en fin de prêt
    score_bureau_plancher: float = 350   # en dessous → refus auto
    ltv_max: float = 0.95                # prêt > 95% de la valeur du bien
    # Bande de revue manuelle autour du seuil ML (ex : seuil 0.41 ±0.07)
    marge_revue: float = 0.07


class DecisionEngine:
    """Combine règles dures + score ML en une décision finale traçable."""

    def __init__(self, rules: PolicyRules | None = None):
        self.rules = rules or PolicyRules()

    def decide(self, scoring_result: dict, raw_client: dict, threshold: float) -> dict:
        """
        Args:
            scoring_result : sortie de ScoringService.predict (pd_value, score, indicateurs…)
            raw_client     : données client traduites (pour les règles métier)
            threshold      : seuil ML optimal du bundle

        Returns:
            dict : décision finale + motifs (à fusionner dans la réponse API)
        """
        pd_value    = scoring_result["pd_value"]
        indicateurs = scoring_result.get("indicateurs", {})

        motifs_refus  = []
        motifs_alerte = []

        # ── 1. RÈGLES DURES (knock-out) ───────────────────────────────────
        # Endettement
        ratio_endet = self._get_ratio(indicateurs, "ratio_endettement")
        if ratio_endet is not None and ratio_endet / 100 > self.rules.endettement_max:
            motifs_refus.append(
                f"Taux d'endettement {ratio_endet:.0f}% > "
                f"plafond {self.rules.endettement_max*100:.0f}%"
            )

        # LTV
        ratio_ltv = self._get_ratio(indicateurs, "ratio_ltv")
        if ratio_ltv is not None and ratio_ltv / 100 > self.rules.ltv_max:
            motifs_refus.append(
                f"Ratio prêt/valeur {ratio_ltv:.0f}% > {self.rules.ltv_max*100:.0f}%"
            )

        # Score bureau plancher
        score_bureau = self._get_ratio(indicateurs, "score_bureau")
        if score_bureau is not None and score_bureau < self.rules.score_bureau_plancher:
            motifs_refus.append(
                f"Score bureau {score_bureau:.0f} < plancher "
                f"{self.rules.score_bureau_plancher:.0f}"
            )

        # Âge
        age = self._to_int(raw_client.get("Age"))
        if age is not None and not (self.rules.age_min <= age <= self.rules.age_max):
            motifs_refus.append(
                f"Âge {age} hors plage [{self.rules.age_min}, {self.rules.age_max}]"
            )

        # ── 2. DÉCISION ───────────────────────────────────────────────────
        if motifs_refus:
            decision   = "REFUSE"
            mode       = "REGLE_METIER"          # tranché par une règle dure
            motifs     = motifs_refus
        else:
            # Zone grise : on regarde le score ML avec une bande de revue
            borne_basse = threshold - self.rules.marge_revue
            borne_haute = threshold + self.rules.marge_revue

            if pd_value < borne_basse:
                decision, mode = "APPROUVE", "MODELE_ML"
            elif pd_value > borne_haute:
                decision, mode = "REFUSE", "MODELE_ML"
            else:
                decision, mode = "REVUE_MANUELLE", "ZONE_GRISE"
                motifs_alerte.append(
                    f"PD {pd_value:.3f} proche du seuil {threshold:.3f} "
                    "— validation analyste recommandée"
                )
            motifs = motifs_alerte

        # ── 3. Cohérence avec les indicateurs (alertes non bloquantes) ────
        for cle, ind in indicateurs.items():
            if isinstance(ind, dict) and ind.get("status") == "ATTENTION":
                if decision == "APPROUVE":
                    # On signale l'incohérence : approuvé mais un indicateur alerte
                    motifs_alerte.append(f"Point de vigilance : {cle}")

        return {
            "decision_finale":  decision,
            "mode_decision":    mode,       # REGLE_METIER | MODELE_ML | ZONE_GRISE
            "motifs":           motifs,
            "points_vigilance": motifs_alerte,
            "pd_value":         pd_value,
            "seuil":            threshold,
        }

    # ── Helpers ───────────────────────────────────────────────────────────
    @staticmethod
    def _get_ratio(indicateurs: dict, cle: str):
        ind = indicateurs.get(cle)
        if isinstance(ind, dict) and "valeur" in ind:
            try:
                return float(ind["valeur"])
            except (TypeError, ValueError):
                return None
        return None

    @staticmethod
    def _to_int(val):
        try:
            return int(val)
        except (TypeError, ValueError):
            return None


# ── Exemple d'intégration dans routes/octroi.py ──────────────────────────
#
#   from services.decision_engine import DecisionEngine, PolicyRules
#
#   result   = ScoringService.predict(bundle, raw_data, "octroi")
#   engine   = DecisionEngine()                       # ou PolicyRules(...) custom
#   verdict  = engine.decide(result, ScoringService.translate_input(raw_data),
#                            bundle.get("threshold", 0.5))
#   result["decision"]         = verdict["decision_finale"]
#   result["mode_decision"]    = verdict["mode_decision"]
#   result["motifs"]           = verdict["motifs"]
#   result["points_vigilance"] = verdict["points_vigilance"]
