"""
services/bale_service.py
Calcul des indicateurs Bale II/III pour le scoring comportemental.

Indicateurs calcules :
    PD   - Probability of Default        (modele ML)
    LGD  - Loss Given Default            (retard / exposition)
    EAD  - Exposure At Default           (capital restant du)
    EMD  - Encours net restant du        (= EAD)
    EL   - Expected Loss                 (PD x LGD x EAD)
    UL   - Unexpected Loss               (EAD x LGD x sqrt(PD(1-PD)))
    Score recouvrement                   ((1-LGD) x (1-PD) x 1000)

Usage dans Flask :
    from services.bale_service import BaleService
    result = BaleService.compute(row, pd_value, threshold)
"""

import numpy as np


NOTATION_TABLE = [
    (900, "AAA", "Tres bonne conduite",   "MAINTENIR"),
    (800, "AA",  "Bonne conduite",         "MAINTENIR"),
    (700, "A",   "Conduite normale",       "SURVEILLER"),
    (600, "BBB", "Legere degradation",     "SURVEILLER"),
    (500, "BB",  "Degradation moderee",    "ALERTE"),
    (400, "B",   "Degradation severe",     "ALERTE"),
    (0,   "CCC", "Defaut probable",        "CONTENTIEUX"),
]


class BaleService:
    """
    Calcule les indicateurs Bale II/III + score recouvrement.
    Utilise les donnees de Fait_Comportement deja chargees par fetch_client().
    """

    @staticmethod
    def compute(row: dict, pd_value: float, threshold: float = 0.5) -> dict:
        """
        Calcule tous les indicateurs pour un client.

        Args:
            row       : dict avec les colonnes de Fait_Comportement
                        (issues de fetch_client() ou du DWH)
            pd_value  : float — probabilite de defaut issue du modele ML
            threshold : float — seuil de decision du modele

        Returns:
            dict complet avec tous les indicateurs prets pour JSON Flask
        """
        # ── Donnees brutes ────────────────────────────────────────────────
        montant_credit  = float(row.get("Montant_Credit",        0) or 0)
        total_paye      = float(row.get("Total_Montant_Paye",    0) or 0)
        total_echeance  = float(row.get("Total_Montant_Echeance",0) or 0)
        total_retard    = float(row.get("Total_montant_retard",  0) or 0)
        avg_retard      = int(  row.get("Avg_Jours_Retard",      0) or 0)
        max_retard      = int(  row.get("Max_Retard_Defaut",     0) or 0)

        # ── EAD — Exposition au defaut ────────────────────────────────────
        EAD = max(montant_credit - total_paye, 0.0)
        EMD = EAD  # Encours net = meme grandeur dans ce contexte

        # ── LGD — Loss Given Default (0 a 1) ─────────────────────────────
        # Ratio montant en retard / exposition
        # Plafonne a 1 (on ne peut pas perdre plus que l'exposition)
        LGD = min(total_retard / (EAD + 1.0), 1.0)

        # ── EL — Expected Loss ────────────────────────────────────────────
        EL = pd_value * LGD * EAD

        # ── UL — Unexpected Loss (ecart-type de la perte) ────────────────
        UL = EAD * LGD * np.sqrt(max(pd_value * (1.0 - pd_value), 0.0))

        # ── Score comportemental /1000 ────────────────────────────────────
        score_comp = int(np.clip((1.0 - pd_value) * 1000, 0, 1000))

        # ── Notation AAA → CCC ────────────────────────────────────────────
        notation = label = decision = "CCC"
        label    = "Defaut probable"
        decision = "CONTENTIEUX"
        for seuil, nota, lbl, dec in NOTATION_TABLE:
            if score_comp >= seuil:
                notation, label, decision = nota, lbl, dec
                break

        # ── Score recouvrement /1000 ──────────────────────────────────────
        # Mesure la capacite residuelle de remboursement
        # Haut (>700) = client recuperable
        # Bas (<300)  = perte probable importante
        score_rec = int(np.clip((1.0 - LGD) * (1.0 - pd_value) * 1000, 0, 1000))

        # ── Ratio de couverture (% deja rembourse) ────────────────────────
        ratio_couverture = (
            (total_paye / total_echeance * 100)
            if total_echeance > 0 else 0.0
        )

        # ── Alerte retard ─────────────────────────────────────────────────
        if pd_value < threshold * 0.40:
            alerte = {
                "niveau":  "FAIBLE",
                "couleur": "vert",
                "message": "Aucun retard prevu a court terme.",
                "action":  "Surveillance normale.",
            }
        elif pd_value < threshold:
            alerte = {
                "niveau":  "MODERE",
                "couleur": "orange",
                "message": "Risque modere — surveiller les prochaines echeances.",
                "action":  "Contacter le client pour anticiper.",
            }
        else:
            alerte = {
                "niveau":  "ELEVE",
                "couleur": "rouge",
                "message": f"Probabilite elevee ({pd_value:.1%}) — intervention requise.",
                "action":  "Escalader au recouvrement preventif.",
            }

        return {
            # ── Score comportemental ──────────────────────────
            "score_comportemental":  score_comp,
            "notation":              notation,
            "label":                 label,
            "decision":              decision,
            "pd_value":              round(pd_value, 6),
            "pd_pct":                round(pd_value * 100, 3),
            "threshold":             round(threshold, 4),

            # ── Score recouvrement ────────────────────────────
            "score_recouvrement":    score_rec,

            # ── Indicateurs Bale II ───────────────────────────
            "lgd_value":             round(LGD, 6),
            "lgd_pct":               round(LGD * 100, 2),
            "ead_value":             round(EAD, 2),
            "emd_value":             round(EMD, 2),
            "el_value":              round(EL,  2),
            "ul_value":              round(UL,  2),

            # ── Alerte retard ─────────────────────────────────
            "alerte_retard":         alerte,

            # ── Indicateurs metier ────────────────────────────
            "ratio_couverture_pct":  round(ratio_couverture, 2),
            "montant_credit":        round(montant_credit,   2),
            "total_paye":            round(total_paye,       2),
            "total_retard":          round(total_retard,     2),
            "avg_jours_retard":      avg_retard,
            "max_retard_j":          max_retard,
        }

    @staticmethod
    def portfolio_stats(results: list[dict]) -> dict:
        """
        Calcule les statistiques agregees d'un portefeuille.

        Args:
            results : liste de dicts retournes par compute()

        Returns:
            dict avec EL/UL/EAD totaux et distributions
        """
        if not results:
            return {}

        el_total  = sum(r["el_value"]  for r in results)
        ul_total  = sum(r["ul_value"]  for r in results)
        ead_total = sum(r["ead_value"] for r in results)

        decisions = {}
        notations = {}
        for r in results:
            d = r["decision"]
            n = r["notation"]
            decisions[d] = decisions.get(d, 0) + 1
            notations[n] = notations.get(n, 0) + 1

        return {
            "nb_clients":       len(results),
            "el_total":         round(el_total,  2),
            "ul_total":         round(ul_total,  2),
            "ead_total":        round(ead_total, 2),
            "el_sur_ead_pct":   round(el_total / ead_total * 100, 3) if ead_total > 0 else 0,
            "lgd_moyenne_pct":  round(sum(r["lgd_pct"] for r in results) / len(results), 2),
            "pd_moyenne_pct":   round(sum(r["pd_pct"]  for r in results) / len(results), 3),
            "decisions":        decisions,
            "notations":        notations,
        }
