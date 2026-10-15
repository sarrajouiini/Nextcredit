"""
╔══════════════════════════════════════════════════════════════════════╗
║  DwhService — Récupération client depuis SA_CREDIT (SQL Server)      ║
║                                                                        ║
║  fetch_client(engine, client_code) → DataFrame prêt pour le scoring   ║
║                                                                        ║
║  IMPORTANT : ce service interroge la base SA_CREDIT (et non plus      ║
║  l'ancien DWH Dwh_Credit). Le mapping est :                           ║
║      ClientCode (DWH/Flask) = 'CLIE' + Id_Demande (SA_CREDIT)         ║
║                                                                        ║
║  Les colonnes retournées sont EXACTEMENT celles utilisées dans le     ║
║  notebook d'entraînement v5 (scoring_comportemental_v5_SA.ipynb),     ║
║  pour que bundle['preprocessor'].transform() ne lève jamais de        ║
║  "columns are missing".                                               ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import pandas as pd
import numpy  as np
from sqlalchemy import text


# ── Requête SQL — identique à celle du notebook v5 (1 client) ─────────
# Remplace WHERE app.Id_Demande = :id_demande (au lieu de tout le portefeuille)
_QUERY = """
WITH

T0 AS (
    SELECT Id_Demande,
           MAX(Date_Echeance_Prevue) AS T0_Date
    FROM   Sa_InstallementPayment
    WHERE  Date_Paiement_Reel IS NOT NULL
      AND  Id_Demande = :id_demande
    GROUP  BY Id_Demande
),

Hist_Paie AS (
    SELECT
        ip.Id_Demande,
        COUNT(*)  AS Nb_Echeances_Total,
        SUM(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) > 0
                 THEN 1 ELSE 0 END)                                     AS Nb_Retards_Total,
        AVG(CAST(DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                 ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) AS float))
                                                                         AS Avg_Retard_Global,
        MAX(DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                 ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)))
                                                                         AS Max_Retard_Global,
        SUM(ip.Montant_Echeance - ip.Montant_Paye)                      AS Montant_Impaye_Total,
        AVG(CAST(ip.Montant_Paye AS float) / NULLIF(ip.Montant_Echeance,0))
                                                                         AS Ratio_Paiement_Global,
        AVG(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 90
                 THEN CAST(DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) AS float)
                 END)                                                    AS Avg_Retard_M3,
        MAX(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 90
                 THEN DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue))
                 END)                                                    AS Max_Retard_M3,
        SUM(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 90
                 AND  DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) > 0
                 THEN 1 ELSE 0 END)                                     AS Nb_Retards_M3,
        AVG(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 180
                 THEN CAST(DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) AS float)
                 END)                                                    AS Avg_Retard_M6,
        MAX(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 180
                 THEN DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue))
                 END)                                                    AS Max_Retard_M6,
        SUM(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 180
                 AND  DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) > 0
                 THEN 1 ELSE 0 END)                                     AS Nb_Retards_M6,
        AVG(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 360
                 THEN CAST(DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) AS float)
                 END)                                                    AS Avg_Retard_M12,
        SUM(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 360
                 AND  DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) > 0
                 THEN 1 ELSE 0 END)                                     AS Nb_Retards_M12,
        AVG(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 90
                 THEN CAST(DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) AS float) END)
        - AVG(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) BETWEEN 91 AND 360
                   THEN CAST(DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                        ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) AS float) END)
                                                                         AS Delta_Retard_Tendance,
        SUM(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 90
                 AND  DATEDIFF(DAY, ip.Date_Echeance_Prevue,
                      ISNULL(ip.Date_Paiement_Reel, ip.Date_Echeance_Prevue)) > 30
                 THEN 1 ELSE 0 END)                                     AS Nb_Retards_Graves_M3,
        AVG(CASE WHEN DATEDIFF(DAY, ip.Date_Echeance_Prevue, t.T0_Date) <= 90
                 THEN CAST(ip.Montant_Paye AS float) / NULLIF(ip.Montant_Echeance,0)
                 END)                                                    AS Ratio_Paiement_M3
    FROM Sa_InstallementPayment ip
    JOIN T0 t ON ip.Id_Demande = t.Id_Demande
    WHERE ip.Date_Echeance_Prevue <= t.T0_Date
    GROUP BY ip.Id_Demande
),

Bur AS (
    SELECT Id_Demande,
           MAX(Jours_Retard_Credit)     AS Jours_Retard_Bureau_Max,
           MAX(Montant_Max_Retard)      AS Montant_Max_Retard_Bureau,
           SUM(Montant_Total_Credit)    AS Montant_Total_Bureau,
           SUM(Montant_En_Retard)       AS Montant_En_Retard_Bureau,
           COUNT(DISTINCT Id_Bureau)    AS Nb_Credits_Bureau,
           MAX(Nb_Prolongations)        AS Max_Prolongations,
           SUM(Montant_Restant)         AS Montant_Restant_Bureau
    FROM   SA_Bureau
    WHERE  Id_Demande = :id_demande
    GROUP  BY Id_Demande
),

Card AS (
    SELECT Id_Demande,
           MAX(Jours_Retard)                AS Jours_Retard_Card_Max,
           MAX(Jours_Retard_Defaut)         AS Jours_Defaut_Card_Max,
           AVG(CAST(Solde AS float))        AS Solde_Moy_Card,
           AVG(CAST(Plafond_Credit_Actuel AS float))
                                            AS Plafond_Moy_Card,
           AVG(CASE WHEN Plafond_Credit_Actuel > 0
                    THEN CAST(Solde AS float) / Plafond_Credit_Actuel
                    END)                    AS Taux_Utilisation_Card,
           COUNT(DISTINCT Mois_Historique)  AS Nb_Mois_Card,
           SUM(CASE WHEN Jours_Retard > 0 THEN 1 ELSE 0 END)
                                            AS Nb_Mois_Retard_Card
    FROM   SA_CreditCard
    WHERE  Id_Demande = :id_demande
    GROUP  BY Id_Demande
),

Pos AS (
    SELECT Id_Demande,
           MAX(Jours_Retard)                AS Jours_Retard_Pos_Max,
           MAX(Jours_Retard_Defaut)         AS Jours_Defaut_Pos_Max,
           MIN(Nb_Echeances_Restantes)      AS Echeances_Restantes_Min,
           AVG(CAST(Nb_Echeances_Restantes AS float))
                                            AS Echeances_Restantes_Moy,
           COUNT(DISTINCT Mois_Historique)  AS Nb_Mois_Pos,
           SUM(CASE WHEN Jours_Retard > 0 THEN 1 ELSE 0 END)
                                            AS Nb_Mois_Retard_Pos
    FROM   SA_PosCachBalance
    WHERE  Id_Demande = :id_demande
    GROUP  BY Id_Demande
),

Prec AS (
    SELECT Id_Demande,
           COUNT(*)                         AS Nb_Credits_Precedents,
           SUM(CASE WHEN Statut_Contrat = 'Approved'
                    THEN 1 ELSE 0 END)      AS Nb_Approuves,
           SUM(CASE WHEN Statut_Contrat IN ('Refused','Canceled')
                    THEN 1 ELSE 0 END)      AS Nb_Refuses,
           AVG(CAST(Montant_Credit AS float))
                                            AS Moy_Montant_Precedent,
           MAX(Taux_Interet_Principal)      AS Max_Taux_Interet_Prec
    FROM   SA_Credit_Precedent
    WHERE  Id_Demande = :id_demande
    GROUP  BY Id_Demande
)

SELECT
    app.Id_Demande,
    'CLIE' + CAST(app.Id_Demande AS varchar) AS ClientCode,

    app.Genre, app.Possede_Voiture, app.Possede_Immobilier,
    app.Nb_Enfants, app.Revenu_Total, app.Montant_Credit,
    app.Mensualite, app.Prix_Bien, app.Type_Revenu,
    app.Niveau_Education, app.Situation_Familiale,
    app.Type_Logement, app.Profession, app.Type_Contrat,
    app.Nb_Membres_Famille, app.Age,
    app.Score_Externe_1, app.Score_Externe_2, app.Score_Externe_3,
    (ISNULL(app.Score_Externe_1,0) + ISNULL(app.Score_Externe_2,0)
     + ISNULL(app.Score_Externe_3,0)) / 3.0    AS Score_Externe_Moyen,
    app.Req_Bureau_Credit_Mois,
    app.Req_Bureau_Credit_Trimestre,
    app.Req_Bureau_Credit_An,
    app.Densite_Population_Region,
    app.Note_Region, app.Note_Region_Ville,
    app.Region_Enreg_Diff_Residence,
    app.Ville_Enreg_Diff_Residence,

    ISNULL(h.Nb_Echeances_Total,    0) AS Nb_Echeances_Total,
    ISNULL(h.Nb_Retards_Total,      0) AS Nb_Retards_Total,
    ISNULL(h.Avg_Retard_Global,     0) AS Avg_Retard_Global,
    ISNULL(h.Max_Retard_Global,     0) AS Max_Retard_Global,
    ISNULL(h.Montant_Impaye_Total,  0) AS Montant_Impaye_Total,
    ISNULL(h.Ratio_Paiement_Global, 1) AS Ratio_Paiement_Global,
    ISNULL(h.Avg_Retard_M3,         0) AS Avg_Retard_M3,
    ISNULL(h.Max_Retard_M3,         0) AS Max_Retard_M3,
    ISNULL(h.Nb_Retards_M3,         0) AS Nb_Retards_M3,
    ISNULL(h.Avg_Retard_M6,         0) AS Avg_Retard_M6,
    ISNULL(h.Max_Retard_M6,         0) AS Max_Retard_M6,
    ISNULL(h.Nb_Retards_M6,         0) AS Nb_Retards_M6,
    ISNULL(h.Avg_Retard_M12,        0) AS Avg_Retard_M12,
    ISNULL(h.Nb_Retards_M12,        0) AS Nb_Retards_M12,
    ISNULL(h.Delta_Retard_Tendance, 0) AS Delta_Retard_Tendance,
    ISNULL(h.Ratio_Paiement_M3,     1) AS Ratio_Paiement_M3,
    ISNULL(h.Nb_Retards_Graves_M3,  0) AS Nb_Retards_Graves_M3,

    ISNULL(b.Jours_Retard_Bureau_Max,    0) AS Jours_Retard_Bureau_Max,
    ISNULL(b.Montant_Max_Retard_Bureau,  0) AS Montant_Max_Retard_Bureau,
    ISNULL(b.Montant_Total_Bureau,       0) AS Montant_Total_Bureau,
    ISNULL(b.Montant_En_Retard_Bureau,   0) AS Montant_En_Retard_Bureau,
    ISNULL(b.Montant_Restant_Bureau,     0) AS Montant_Restant_Bureau,
    ISNULL(b.Nb_Credits_Bureau,          0) AS Nb_Credits_Bureau,
    ISNULL(b.Max_Prolongations,          0) AS Max_Prolongations,

    ISNULL(c.Jours_Retard_Card_Max,   0) AS Jours_Retard_Card_Max,
    ISNULL(c.Jours_Defaut_Card_Max,   0) AS Jours_Defaut_Card_Max,
    ISNULL(c.Solde_Moy_Card,          0) AS Solde_Moy_Card,
    ISNULL(c.Taux_Utilisation_Card,   0) AS Taux_Utilisation_Card,
    ISNULL(c.Nb_Mois_Card,            0) AS Nb_Mois_Card,
    ISNULL(c.Nb_Mois_Retard_Card,     0) AS Nb_Mois_Retard_Card,

    ISNULL(p.Jours_Retard_Pos_Max,        0) AS Jours_Retard_Pos_Max,
    ISNULL(p.Jours_Defaut_Pos_Max,        0) AS Jours_Defaut_Pos_Max,
    ISNULL(p.Echeances_Restantes_Min,     0) AS Echeances_Restantes_Min,
    ISNULL(p.Echeances_Restantes_Moy,     0) AS Echeances_Restantes_Moy,
    ISNULL(p.Nb_Mois_Pos,                 0) AS Nb_Mois_Pos,
    ISNULL(p.Nb_Mois_Retard_Pos,          0) AS Nb_Mois_Retard_Pos,

    ISNULL(pr.Nb_Credits_Precedents,  0) AS Nb_Credits_Precedents,
    ISNULL(pr.Nb_Approuves,           0) AS Nb_Approuves,
    ISNULL(pr.Nb_Refuses,             0) AS Nb_Refuses,
    ISNULL(pr.Moy_Montant_Precedent,  0) AS Moy_Montant_Precedent

FROM      SA_Application       app
LEFT JOIN Hist_Paie             h    ON app.Id_Demande = h.Id_Demande
LEFT JOIN Bur                   b    ON app.Id_Demande = b.Id_Demande
LEFT JOIN Card                  c    ON app.Id_Demande = c.Id_Demande
LEFT JOIN Pos                   p    ON app.Id_Demande = p.Id_Demande
LEFT JOIN Prec                  pr   ON app.Id_Demande = pr.Id_Demande
WHERE app.Id_Demande = :id_demande
"""


def client_code_to_id(client_code: str) -> int:
    """
    Convertit un ClientCode ('CLIE157753') en Id_Demande (157753).

    Raises:
        ValueError si le format est invalide.
    """
    code = client_code.strip().upper()
    if not code.startswith("CLIE"):
        raise ValueError(
            f"Format de code client invalide : '{client_code}'. "
            "Attendu : 'CLIE' suivi de l'identifiant (ex: CLIE157753)."
        )
    try:
        return int(code.replace("CLIE", ""))
    except ValueError:
        raise ValueError(f"Identifiant non numérique dans '{client_code}'.")


def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """
    Feature engineering — DOIT rester strictement synchronisé avec
    la fonction feature_engineering() du notebook v5 d'entraînement.
    """
    df = df.copy()

    # Ratio endettement
    df['Ratio_Endettement'] = df['Mensualite'] / (df['Revenu_Total'] + 1)

    # Pression financière avec crédit bureau
    df['Pression_Totale'] = (
        df['Mensualite'] + df['Montant_En_Retard_Bureau'] / 12
    ) / (df['Revenu_Total'] + 1)

    # Score bureau composite (minimum des 3 scores)
    df['Score_Bureau_Min'] = df[
        ['Score_Externe_1', 'Score_Externe_2', 'Score_Externe_3']
    ].min(axis=1)

    # Tendance retard : positif = aggravation
    df['Tendance_Retard'] = df['Avg_Retard_M3'] - df['Avg_Retard_M6']

    # Ratio retards récents / total
    df['Ratio_Retards_Recents'] = (
        df['Nb_Retards_M3'] / (df['Nb_Echeances_Total'] + 1)
    )

    # Sévérité retard bucket (0=aucun, 1=léger, 2=moyen, 3=grave)
    df['Retard_Bucket_M3'] = pd.cut(
        df['Avg_Retard_M3'].fillna(0),
        bins=[-1, 0, 7, 30, 9999], labels=[0, 1, 2, 3]
    ).astype(float)

    # Mobilité géographique
    df['Mobilite_Score'] = (
        df['Region_Enreg_Diff_Residence']
        + df['Ville_Enreg_Diff_Residence']
    )

    # Signal retard externe grave
    df['Retard_Externe_Grave'] = (
        df['Jours_Retard_Bureau_Max'] > 30
    ).astype(int)

    # LTV approximative
    df['Ratio_LTV'] = df['Montant_Credit'] / (df['Prix_Bien'] + 1)

    return df


def fetch_client(engine, client_code: str) -> pd.DataFrame:
    """
    Récupère toutes les données d'un client depuis SA_CREDIT
    et applique le feature engineering identique au notebook v5.

    Args:
        engine      : SQLAlchemy engine connecté à la base SA_CREDIT
        client_code : ex. 'CLIE157753'

    Returns:
        DataFrame (1 ligne) prêt pour preprocessor.transform()

    Raises:
        ValueError si le client_code est introuvable ou mal formé.
    """
    id_demande = client_code_to_id(client_code)

    with engine.connect() as conn:
        df = pd.read_sql(
            text(_QUERY),
            conn,
            params={"id_demande": id_demande}
        )

    if df.empty:
        raise ValueError(
            f"ClientCode '{client_code}' (Id_Demande={id_demande}) "
            "introuvable dans SA_CREDIT."
        )

    df = df.head(1).reset_index(drop=True)
    df = feature_engineering(df)

    return df


def build_client_info(row: pd.Series) -> dict:
    """Extrait les infos de présentation du client (pour le front)."""
    return {
        "age":                 int(row.get("Age", 0) or 0),
        "genre":               str(row.get("Genre", "") or ""),
        "situation_familiale": str(row.get("Situation_Familiale", "") or ""),
        "type_contrat":        str(row.get("Type_Contrat", "") or ""),
        "profession":          str(row.get("Profession", "") or ""),
        "montant_credit":      float(row.get("Montant_Credit", 0) or 0),
        "mensualite":          float(row.get("Mensualite", 0) or 0),
        "revenu_total":        float(row.get("Revenu_Total", 0) or 0),
    }
