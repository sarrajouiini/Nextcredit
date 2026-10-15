"""
╔══════════════════════════════════════════════════════════════════════╗
║  mapping.py — Tables de correspondance FR → EN                      ║
║                                                                      ║
║  Le formulaire HTML affiche les labels en français.                 ║
║  Ces maps convertissent vers les valeurs anglaises originales        ║
║  utilisées lors de l'entraînement du modèle.                        ║
╚══════════════════════════════════════════════════════════════════════╝
"""

# ── Genre ─────────────────────────────────────────────────────────────────
GENDER_MAP = {
    "Homme": "M",
    "Femme": "F",
}

# ── Type de contrat de crédit ─────────────────────────────────────────────
CONTRACT_MAP = {
    "Prêt en espèces":    "Cash loans",
    "Prêt consommation":  "Consumer loans",
    "Prêt revolving":     "Revolving loans",
}

# ── Type de client ────────────────────────────────────────────────────────
CLIENT_TYPE_MAP = {
    "Nouveau client":     "New",
    "Client régulier":    "Repeater",
    "Client renouvelé":   "Refreshed",
}

# ── Type de revenu ────────────────────────────────────────────────────────
INCOME_MAP = {
    "Salarié(e)":                   "Working",
    "Fonctionnaire":                "State servant",
    "Associé(e) commercial(e)":     "Commercial associate",
    "Retraité(e)":                  "Pensioner",
    "Sans emploi":                  "Unemployed",
    "Étudiant(e)":                  "Student",
    "Chef d'entreprise":            "Businessman",
    "En congé maternité":           "Maternity leave",
}

# ── Profession ────────────────────────────────────────────────────────────
PROFESSION_MAP = {
    "Ouvrier / Manœuvre":               "Laborers",
    "Personnel de base":                "Core staff",
    "Comptable":                        "Accountants",
    "Cadre / Manager":                  "Managers",
    "Chauffeur":                        "Drivers",
    "Commercial / Vendeur":             "Sales staff",
    "Agent d'entretien":                "Cleaning staff",
    "Cuisinier(ère)":                   "Cooking staff",
    "Service privé à domicile":         "Private service staff",
    "Personnel médical":                "Medicine staff",
    "Agent de sécurité":                "Security staff",
    "Technicien hautement qualifié":    "High skill tech staff",
    "Serveur / Barman":                 "Waiters/barmen staff",
    "Ouvrier peu qualifié":             "Low-skill Laborers",
    "Agent immobilier":                 "Realty agents",
    "Secrétaire / Assistante":          "Secretaries",
    "Informaticien(ne)":                "IT staff",
    "Chargé(e) des ressources humaines":"HR staff",
}

# ── Situation familiale ───────────────────────────────────────────────────
MARITAL_MAP = {
    "Célibataire":              "Single / not married",
    "Marié(e)":                 "Married",
    "Union libre":              "Civil marriage",
    "Veuf / Veuve":             "Widow",
    "Séparé(e)":                "Separated",
    "Non renseigné":            "Unknown",
}

# ── Niveau d'éducation ────────────────────────────────────────────────────
EDUCATION_MAP = {
    "Études secondaires":       "Secondary / secondary special",
    "Enseignement supérieur":   "Higher education",
    "Formation incomplète":     "Incomplete higher",
    "Études inférieures":       "Lower secondary",
    "Formation académique":     "Academic degree",
}

# ── Type de logement ─────────────────────────────────────────────────────
HOUSING_MAP = {
    "Propriétaire":             "House / apartment",
    "Appartement loué":         "Rented apartment",
    "Avec les parents":         "With parents",
    "Logement municipal":       "Municipal apartment",
    "Bureau / logement de fonction": "Office apartment",
    "Logement en copropriété":  "Co-op apartment",
}

# ── Flag (Oui / Non) → 1 / 0 ─────────────────────────────────────────────
FLAG_MAP = {
    "Oui": 1,
    "Non": 0,
}
