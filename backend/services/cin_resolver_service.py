"""
╔══════════════════════════════════════════════════════════════════════╗
║  CinResolverService — Résolution CIN -> Scores bureau réels          ║
║                                                                        ║
║  Logique métier :                                                     ║
║  1. Le CIN saisi par l'agent fait 8 chiffres.                         ║
║  2. On extrait les 6 derniers chiffres du CIN.                        ║
║  3. On cherche un ClientCode ('CLIE' + 6 chiffres) qui se termine     ║
║     par ces 6 chiffres :                                              ║
║       a. D'abord dans Dwh_Credit (Dim_Client JOIN Fait_Demande)       ║
║       b. Si rien trouvé, dans SA_CREDIT (SA_Application)              ║
║  4. Si un client est trouvé : on récupère ses 3 vrais scores bureau   ║
║     (Score_Externe_1/2/3) depuis la source où il a été trouvé.        ║
║  5. Si aucun client ne correspond : on retombe sur 600/600/600 par    ║
║     défaut — un score neutre, ni favorable ni défavorable.            ║
║                                                                        ║
║  Le score bureau n'est JAMAIS saisi manuellement par l'agent — il      ║
║  est toujours soit récupéré depuis l'historique réel du client,       ║
║  soit forcé à une valeur neutre par défaut.                           ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import re
from sqlalchemy import text


# Valeur neutre si le client n'a aucun historique bureau : 600 sur l'échelle
# /900 affichée, soit 600/900 ≈ 0.667 sur l'échelle 0-1 utilisée par le modèle
# (Score_Externe_1/2/3 sont normalisés entre 0 et 1 dans le DWH).
SCORE_DEFAUT = 600 / 900


def extraire_6_derniers_chiffres_cin(cin: str) -> str:
    """
    Valide et extrait les 6 derniers chiffres d'un CIN à 8 chiffres.

    Args:
        cin : chaîne saisie par l'agent (ex: "12345678")

    Returns:
        Les 6 derniers chiffres sous forme de chaîne (ex: "345678")

    Raises:
        ValueError si le CIN ne fait pas exactement 8 chiffres.
    """
    cin_propre = re.sub(r"\D", "", str(cin).strip())  # garde uniquement les chiffres
    if len(cin_propre) != 8:
        raise ValueError(
            f"Le CIN doit contenir exactement 8 chiffres (reçu : '{cin}', "
            f"{len(cin_propre)} chiffre(s) détecté(s))."
        )
    return cin_propre[-6:]


def _chercher_dans_dwh(engine_dwh, six_chiffres: str):
    """
    Cherche un ClientCode se terminant par les 6 chiffres dans Dwh_Credit
    (Dim_Client), et récupère ses scores bureau via Fait_Demande.

    Returns:
        dict {score1, score2, score3, client_code} ou None si rien trouvé.
    """
    if engine_dwh is None:
        return None

    query = text("""
        SELECT TOP 1
            dc.ClientCode,
            fd.Score_Externe_1,
            fd.Score_Externe_2,
            fd.Score_Externe_3
        FROM      Dim_Client   dc
        JOIN      Fait_Demande fd ON dc.Pk_Client = fd.Fk_Client
        WHERE     RIGHT(dc.ClientCode, 6) = :six_chiffres
        ORDER BY  fd.FK_Date DESC
    """)
    try:
        with engine_dwh.connect() as conn:
            row = conn.execute(query, {"six_chiffres": six_chiffres}).mappings().first()
    except Exception:
        return None

    if not row:
        return None

    return {
        "client_code": row["ClientCode"],
        "score1": float(row["Score_Externe_1"] or 0),
        "score2": float(row["Score_Externe_2"] or 0),
        "score3": float(row["Score_Externe_3"] or 0),
        "source": "Dwh_Credit",
    }


def _chercher_dans_sa_credit(engine_sa, six_chiffres: str):
    """
    Cherche un Id_Demande dont 'CLIE'+Id_Demande se termine par les
    6 chiffres dans SA_CREDIT (SA_Application).

    Returns:
        dict {score1, score2, score3, client_code} ou None si rien trouvé.
    """
    if engine_sa is None:
        return None

    query = text("""
        SELECT TOP 1
            Id_Demande,
            Score_Externe_1,
            Score_Externe_2,
            Score_Externe_3
        FROM SA_Application
        WHERE RIGHT('CLIE' + CAST(Id_Demande AS varchar), 6) = :six_chiffres
    """)
    try:
        with engine_sa.connect() as conn:
            row = conn.execute(query, {"six_chiffres": six_chiffres}).mappings().first()
    except Exception:
        return None

    if not row:
        return None

    return {
        "client_code": "CLIE" + str(row["Id_Demande"]),
        "score1": float(row["Score_Externe_1"] or 0),
        "score2": float(row["Score_Externe_2"] or 0),
        "score3": float(row["Score_Externe_3"] or 0),
        "source": "SA_CREDIT",
    }


def resoudre_scores_bureau(engine_dwh, engine_sa, cin: str) -> dict:
    """
    Point d'entrée principal — résout les scores bureau à partir d'un CIN.

    Args:
        engine_dwh : SQLAlchemy engine connecté à Dwh_Credit (ou None)
        engine_sa  : SQLAlchemy engine connecté à SA_CREDIT (ou None)
        cin        : CIN saisi par l'agent (8 chiffres)

    Returns:
        {
            "score_externe_1": float,
            "score_externe_2": float,
            "score_externe_3": float,
            "client_trouve": bool,
            "client_code": str | None,
            "source": "Dwh_Credit" | "SA_CREDIT" | "defaut",
        }
    """
    six_chiffres = extraire_6_derniers_chiffres_cin(cin)

    resultat = _chercher_dans_dwh(engine_dwh, six_chiffres)
    if resultat is None:
        resultat = _chercher_dans_sa_credit(engine_sa, six_chiffres)

    if resultat is not None:
        return {
            "score_externe_1": resultat["score1"],
            "score_externe_2": resultat["score2"],
            "score_externe_3": resultat["score3"],
            "client_trouve":   True,
            "client_code":     resultat["client_code"],
            "source":          resultat["source"],
        }

    # Aucun client trouvé -> score neutre par défaut
    return {
        "score_externe_1": float(SCORE_DEFAUT),
        "score_externe_2": float(SCORE_DEFAUT),
        "score_externe_3": float(SCORE_DEFAUT),
        "client_trouve":   False,
        "client_code":     None,
        "source":          "defaut",
    }
