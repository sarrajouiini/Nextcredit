# Base de Connaissances Bancaires — NextCredit Assistant

## SCORING & RISQUE DE CRÉDIT

### Probabilité de défaut (PD)
La PD (Probability of Default) mesure la probabilité qu'un emprunteur ne
rembourse pas son crédit dans les 12 mois suivants (définition Bâle II/III
standard). Elle s'exprime en pourcentage : une PD de 5% signifie que sur
100 clients avec un profil similaire, environ 5 feront défaut. La PD est
calculée à partir de modèles statistiques (régression logistique, arbres
de décision, ou réseaux de neurones) entraînés sur l'historique des
défauts passés.

### Perte en cas de défaut (LGD)
La LGD (Loss Given Default) représente le pourcentage du montant prêté
que la banque perd réellement si le client fait défaut, après recouvrement
des garanties (hypothèque, nantissement, etc.). Une LGD de 40% signifie
que sur un crédit de 100 000 DT en défaut, la banque récupère 60 000 DT
et perd 40 000 DT. La LGD dépend fortement du type de garantie : un
crédit immobilier garanti a généralement une LGD plus faible qu'un
crédit à la consommation non garanti.

### Exposition au moment du défaut (EAD)
L'EAD (Exposure at Default) est le montant total que la banque risque de
perdre au moment du défaut, incluant le capital restant dû et les intérêts
courus. Pour un crédit amortissable classique, l'EAD diminue avec le temps
au fur et à mesure du remboursement.

### Perte attendue (Expected Loss)
La perte attendue se calcule par la formule : EL = PD × LGD × EAD.
C'est le montant que la banque doit provisionner comptablement pour
couvrir les risques de son portefeuille de crédits, conformément aux
normes IFRS 9.

### Scoring d'octroi
Le scoring d'octroi évalue le risque AU MOMENT de la demande de crédit,
avant que le client n'ait d'historique avec la banque. Il s'appuie sur
les informations déclarées (revenu, profession, situation familiale) et
les données des bureaux de crédit externes. C'est une décision "go/no-go"
qui détermine si le crédit est accordé, refusé, ou envoyé en revue
manuelle.

### Scoring comportemental
Le scoring comportemental évalue le risque d'un client qui a DÉJÀ un
historique de remboursement avec la banque. Il analyse les patterns de
paiement (retards, montants, régularité) pour anticiper une dégradation
future, permettant des actions préventives (relance, restructuration).

---

## TYPES DE CRÉDIT

### Prêt en espèces (Cash Loan)
Crédit accordé directement en liquide ou par virement, sans affectation
obligatoire à un achat précis. Le client peut l'utiliser librement.
Généralement remboursé par mensualités fixes sur une durée déterminée.

### Crédit revolving
Ligne de crédit renouvelable : le client dispose d'un plafond qu'il peut
utiliser, rembourser, puis réutiliser sans nouvelle demande. Les intérêts
ne s'appliquent que sur le montant effectivement utilisé. Souvent associé
à une carte de crédit.

### Crédit à la consommation
Financement destiné à l'achat d'un bien ou service précis (voiture,
électroménager, voyage). Le montant est généralement plus faible et la
durée plus courte qu'un crédit immobilier.

### Crédit immobilier
Financement de l'achat d'un bien immobilier, garanti par une hypothèque
sur le bien lui-même. Durée longue (10 à 25 ans), montants élevés, taux
généralement plus avantageux car le risque est mieux garanti.

---

## INDICATEURS FINANCIERS CLÉS

### Taux d'endettement (DTI - Debt to Income)
Rapport entre les charges de remboursement mensuelles totales d'un client
et son revenu mensuel net. Formule : DTI = (mensualités totales / revenu) × 100.
La norme bancaire usuelle limite ce taux à 33-40% maximum pour accorder
un nouveau crédit, au-delà le risque de surendettement devient trop élevé.

### Loan-to-Value (LTV)
Rapport entre le montant du crédit accordé et la valeur du bien financé.
Formule : LTV = montant du crédit / valeur du bien. Un LTV de 90% signifie
que la banque finance 90% de la valeur du bien, le client apportant les
10% restants. Un LTV élevé (>95%) est plus risqué car la garantie couvre
moins bien le crédit en cas de revente forcée.

### Taux d'apport personnel
Pourcentage du prix du bien financé directement par le client (apport),
le reste étant couvert par le crédit. Un apport élevé réduit le risque
pour la banque et témoigne généralement d'une meilleure capacité
d'épargne du client.

### Score bureau de crédit
Note attribuée par des organismes externes (bureaux de crédit) évaluant
la solvabilité d'une personne à partir de son historique financier global
(tous établissements confondus). Permet de détecter un surendettement
non visible dans les seules données internes de la banque.

---

## DÉCISIONS & PROCESSUS

### Décision automatique vs revue manuelle
Les dossiers avec un score très favorable ou très défavorable peuvent
être traités automatiquement (approbation ou refus direct). Les dossiers
dans une zone intermédiaire (souvent appelée "zone grise") sont envoyés
en revue manuelle pour qu'un analyste humain examine le contexte complet
avant de trancher.

### Override (dérogation) de l'agent
Un agent bancaire peut décider de ne pas suivre la recommandation du
modèle (approuver malgré un refus du score, ou refuser malgré une
approbation). Cette dérogation doit être justifiée et documentée — elle
sert aussi à réentraîner et améliorer le modèle avec le temps.

### Motifs de refus courants
- Taux d'endettement excessif (> seuil réglementaire)
- Revenu insuffisant par rapport au montant demandé
- Historique de retards de paiement significatif
- Incohérences dans le dossier (revenus, identité, adresse)
- Score bureau de crédit externe défavorable
- Absence de garantie suffisante pour le montant demandé

---

## RÉGLEMENTATION & CONFORMITÉ

### Bâle II / Bâle III
Accords internationaux définissant les exigences de fonds propres des
banques en fonction du risque de leurs actifs (dont les crédits accordés).
Imposent notamment le calcul de la PD, LGD et EAD pour chaque exposition.

### IFRS 9
Norme comptable internationale imposant aux banques de provisionner les
pertes attendues sur leurs crédits dès l'octroi (et pas seulement au
moment du défaut constaté), via un modèle de perte attendue (Expected
Credit Loss).

### Taux d'usure
Taux d'intérêt maximum légal qu'une banque ne peut pas dépasser lors de
l'octroi d'un crédit, fixé par les autorités monétaires pour protéger les
emprunteurs contre des taux abusifs.

### Lutte contre le blanchiment (LAB/FT)
Obligations réglementaires de vérification de l'identité du client (KYC -
Know Your Customer) et de surveillance des transactions suspectes pour
prévenir le blanchiment d'argent et le financement du terrorisme.

---

## RECOMMANDATIONS TYPES PAR SITUATION

### Score élevé, dossier cohérent
Recommandation : approbation directe, conditions standards. Le client
présente un profil de risque faible avec des indicateurs financiers
sains.

### Score moyen, taux d'endettement limite (35-40%)
Recommandation : revue manuelle. Proposer éventuellement une réduction
du montant demandé ou un allongement de la durée pour réduire la
mensualité et ramener le taux d'endettement sous le seuil de 33%.

### Score faible, historique de retards
Recommandation : refus probable, ou proposition d'un montant réduit avec
garantie additionnelle. Envisager un crédit-relais plus petit pour
reconstruire un historique positif avant un crédit plus important.

### Revenu instable (intérimaire, indépendant récent)
Recommandation : demander des justificatifs complémentaires (3 derniers
relevés bancaires, avis d'imposition) avant de statuer, car le revenu
déclaré peut ne pas refléter la stabilité réelle.

### Incohérences géographiques ou documentaires
Recommandation : vérification renforcée avant toute décision — demander
des pièces justificatives complémentaires (facture récente, attestation
employeur) pour confirmer la cohérence du dossier.
