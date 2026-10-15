"""
╔══════════════════════════════════════════════════════════════════════╗
║  validators.py — Validation des entrées formulaire                  ║
║                                                                      ║
║  Retourne une liste d'erreurs (vide = données valides).             ║
╚══════════════════════════════════════════════════════════════════════╝
"""


def validate_octroi_input(data: dict) -> list[str]:
    """
    Valide les champs obligatoires pour le scoring d'octroi.

    Args:
        data : dict JSON reçu de la requête (labels FR acceptés)

    Returns:
        list[str] : liste des messages d'erreur (vide si tout est OK)
    """
    errors = []

    # ── CIN obligatoire, exactement 8 chiffres ────────────────────────
    cin = str(data.get("CIN", "")).strip()
    cin_chiffres = "".join(c for c in cin if c.isdigit())
    if not cin:
        errors.append("Le CIN est obligatoire")
    elif len(cin_chiffres) != 8:
        errors.append(
            f"Le CIN doit contenir exactement 8 chiffres "
            f"({len(cin_chiffres)} chiffre(s) détecté(s))"
        )

    # ── Possède une voiture : valeur catégorielle obligatoire ─────────
    possede_voiture = data.get("Possede_Voiture")
    if possede_voiture not in ("Oui", "Non"):
        errors.append("'Possède une voiture' doit être 'Oui' ou 'Non'")

    # ── Champs numériques obligatoires ────────────────────────────────
    required_numeric = {
        "Revenu_Total":         "Revenu mensuel",
        "Montant_Credit":       "Montant du crédit",
        "Mensualite":           "Mensualité",
        "Age":                  "Âge",
        "Nb_Membres_Famille":   "Nombre de membres de la famille",
    }
    for field, label in required_numeric.items():
        val = data.get(field)
        if val is None or val == "" or val == 0:
            errors.append(f"'{label}' est obligatoire et doit être > 0")
        elif not isinstance(val, (int, float)) or float(val) < 0:
            errors.append(f"'{label}' doit être un nombre positif")

    # ── Champs catégoriels obligatoires ───────────────────────────────
    required_categorical = {
        "Genre":               "Genre",
        "Situation_Familiale": "Situation familiale",
        "Type_Revenu":         "Type de revenu",
        "Type_Contrat":        "Type de contrat",
        "Type_Client":         "Type de client",
        "Type_Logement":       "Type de logement",
    }
    for field, label in required_categorical.items():
        val = data.get(field)
        if not val or str(val).strip() == "":
            errors.append(f"'{label}' est obligatoire")

    # ── Cohérence âge ────────────────────────────────────────────────
    age = data.get("Age", 0)
    if isinstance(age, (int, float)) and not (18 <= int(age) <= 100):
        errors.append("L'âge doit être compris entre 18 et 100 ans")

    # ── Cohérence taux d'endettement ─────────────────────────────────
    revenu    = float(data.get("Revenu_Total",   0))
    mensualite = float(data.get("Mensualite",    0))
    if revenu > 0 and mensualite / revenu > 0.99:
        errors.append(
            "La mensualité ne peut pas dépasser le revenu total "
            f"({mensualite} > {revenu})"
        )

    # ── Cohérence crédit externe ─────────────────────────────────────
    has_ext = data.get("Flag_Credit_Externe", "Non")
    if has_ext == "Oui":
        for field, label in [
            ("AMT_CREDIT_EXT",   "Montant crédit externe"),
            ("AMT_ANNUITY_EXT",  "Mensualité externe"),
            ("CNT_PAYMENT_EXT",  "Nombre d'échéances restantes"),
        ]:
            val = data.get(field)
            if val is None or val == "" or float(val) <= 0:
                errors.append(
                    f"'{label}' est obligatoire quand un crédit externe est déclaré"
                )

    return errors