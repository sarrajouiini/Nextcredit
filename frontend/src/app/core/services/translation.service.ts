import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'fr' | 'en';

const DICT: Record<Lang, Record<string, string>> = {
  fr: {
    /* ── Navigation publique ── */
    'pub.home': 'Accueil',
    'pub.product': 'Produit',
    'pub.solutions': 'Solutions',
    'pub.services': 'Services IA',
    'pub.articles': 'Article',
    'pub.company': 'Entreprise',
    'pub.demo': 'Réserver une démo',
    'pub.pricing': 'Tarifs',
    'pub.sol_octroi': 'Octroi',
    'pub.sol_octroi_sub': 'Scoring d\'attribution de crédit',
    'pub.sol_comport': 'Comportemental',
    'pub.sol_comport_sub': 'Analyse du comportement de paiement',
    'pub.sol_assistant': 'Assistant IA',
    'pub.sol_assistant_sub': 'Chatbot bancaire intelligent',
    'pub.sol_dash': 'Dashboarding',
    'pub.sol_dash_sub': 'Tableaux de bord en temps réel',

    /* ── Navigation agent ── */
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.scoring': 'Scoring',
    'nav.octroi': 'Octroi de crédit',
    'nav.comportement': 'Scoring Comportemental',
    'nav.intelligence': 'Intelligence IA',
    'nav.assistant': 'Assistant IA',
    'nav.dossiers': 'Dossiers en attente',
    'nav.risque': 'Alertes Risque',
    'nav.pilotage': 'Dashboards BI',
    'nav.bi': 'Dashboards Power BI',
    'nav.bi_global': 'Vue Globale',
    'nav.bi_retard': 'Retard & Défaut',
    'nav.bi_profil': 'Profil Clients',
    'nav.bi_perf': 'Performance Portefeuille',
    'nav.bi_evolution': 'Évolution IA',
    'nav.aide': 'Aide',
    'nav.guide': 'Guide utilisateur',
    'nav.admin': 'Administration',
    'nav.admin_comptes': 'Gestion des comptes',
    'nav.monitoring': 'Monitoring IA',
    'nav.profile': 'Mon Profil',
    'nav.logout': 'Déconnexion',
    'nav.online': 'En ligne',

    /* ── Dashboard ── */
    'dash.greeting': 'Bonjour',
    'dash.subtitle': 'Voici l\'état de votre activité du jour.',
    'dash.pending': 'Dossiers en attente',
    'dash.pending_sub': 'Décisions à confirmer',
    'dash.risk': 'Alertes risque',
    'dash.risk_sub': 'Clients à surveiller',
    'dash.server': 'Statut IA',
    'dash.server_ok': 'Opérationnel',
    'dash.server_err': 'Hors ligne',
    'dash.server_sub': 'Modèles de scoring',
    'dash.today': 'Actions rapides',
    'dash.today_sub': 'Accès direct à vos outils',
    'dash.goto_octroi': 'Nouvelle demande de crédit',
    'dash.goto_comportement': 'Analyser un client',
    'dash.goto_assistant': 'Interroger l\'assistant IA',
    'dash.goto_dossiers': 'Voir les dossiers',
    'dash.goto_bi': 'Ouvrir les dashboards',
    'dash.goto_guide': 'Consulter le guide',
    'dash.loading': 'Chargement des données...',
    'dash.view_all': 'Voir tous',

    /* ── Iframe wrapper ── */
    'iframe.loading': 'Chargement de l\'interface...',
    'iframe.fullscreen': 'Plein écran',
    'iframe.refresh': 'Actualiser',
    'iframe.octroi_title': 'Scoring d\'Octroi',
    'iframe.octroi_sub': 'Évaluation des nouvelles demandes de crédit',
    'iframe.comportement_title': 'Scoring Comportemental',
    'iframe.comportement_sub': 'Analyse du comportement de remboursement',
    'iframe.assistant_title': 'Assistant IA Bancaire',
    'iframe.assistant_sub': 'Assistant intelligent basé sur vos données et la réglementation',

    /* ── Dossiers ── */
    'dos.title': 'Dossiers en attente',
    'dos.subtitle': 'Décisions de scoring en attente de confirmation par un agent',
    'dos.empty': 'Aucun dossier en attente',
    'dos.empty_sub': 'Toutes les décisions ont été traitées.',
    'dos.loading': 'Chargement des dossiers...',
    'dos.error': 'Impossible de charger les dossiers. Vérifiez la connexion au serveur.',
    'dos.refresh': 'Actualiser',
    'dos.col_id': 'ID Décision',
    'dos.col_cin': 'CIN / Client',
    'dos.col_score': 'Score',
    'dos.col_decision': 'Décision IA',
    'dos.col_date': 'Date',
    'dos.col_action': 'Action',
    'dos.confirm': 'Confirmer',
    'dos.override': 'Modifier',
    'dos.count': 'dossiers trouvés',
    'dos.server_offline': 'Serveur IA hors ligne — vérifiez que Flask est démarré sur le port 5000.',

    /* ── Guide ── */
    'guide.title': 'Guide utilisateur',
    'guide.subtitle': 'Apprenez à utiliser NextCredit en quelques minutes',
    'guide.step': 'Étape',
    'guide.of': 'sur',
    'guide.prev': 'Précédent',
    'guide.next': 'Suivant',
    'guide.finish': 'Terminer le guide',
    'guide.restart': 'Recommencer',
    'guide.tip': 'Conseil',
    'guide.shortcut': 'Raccourci',
    'guide.done_title': 'Félicitations !',
    'guide.done_sub': 'Vous maîtrisez maintenant les fonctionnalités essentielles de NextCredit.',
    'guide.go_dashboard': 'Aller au tableau de bord',

    /* ── Common ── */
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.retry': 'Réessayer',
    'common.close': 'Fermer',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.search': 'Rechercher...',
    'common.notifications': 'Notifications',
    'common.no_notif': 'Aucune notification',
    'common.lang_fr': 'Français',
    'common.lang_en': 'English',
    'common.new': 'Nouveau',
    'common.view': 'Voir',
  },

  en: {
    /* ── Public nav ── */
    'pub.home': 'Home',
    'pub.product': 'Product',
    'pub.solutions': 'Solutions',
    'pub.services': 'AI Services',
    'pub.articles': 'Articles',
    'pub.company': 'Company',
    'pub.demo': 'Book a demo',
    'pub.pricing': 'Pricing',
    'pub.sol_octroi': 'Loan Scoring',
    'pub.sol_octroi_sub': 'Credit attribution scoring',
    'pub.sol_comport': 'Behavioral',
    'pub.sol_comport_sub': 'Payment behavior analysis',
    'pub.sol_assistant': 'AI Assistant',
    'pub.sol_assistant_sub': 'Intelligent banking chatbot',
    'pub.sol_dash': 'Dashboarding',
    'pub.sol_dash_sub': 'Real-time dashboards',

    /* ── Agent nav ── */
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.scoring': 'Scoring',
    'nav.octroi': 'Loan Scoring',
    'nav.comportement': 'Behavioral Scoring',
    'nav.intelligence': 'AI Intelligence',
    'nav.assistant': 'AI Assistant',
    'nav.dossiers': 'Pending Files',
    'nav.risque': 'Risk Alerts',
    'nav.pilotage': 'BI Dashboards',
    'nav.bi': 'Power BI Dashboards',
    'nav.bi_global': 'Global Overview',
    'nav.bi_retard': 'Delays & Defaults',
    'nav.bi_profil': 'Client Profiles',
    'nav.bi_perf': 'Portfolio Performance',
    'nav.bi_evolution': 'AI Evolution',
    'nav.aide': 'Help',
    'nav.guide': 'User Guide',
    'nav.admin': 'Administration',
    'nav.admin_comptes': 'Account Management',
    'nav.monitoring': 'AI Monitoring',
    'nav.profile': 'My Profile',
    'nav.logout': 'Logout',
    'nav.online': 'Online',

    /* ── Dashboard ── */
    'dash.greeting': 'Hello',
    'dash.subtitle': 'Here\'s your activity status for today.',
    'dash.pending': 'Pending Files',
    'dash.pending_sub': 'Decisions to confirm',
    'dash.risk': 'Risk Alerts',
    'dash.risk_sub': 'Clients to monitor',
    'dash.server': 'AI Status',
    'dash.server_ok': 'Operational',
    'dash.server_err': 'Offline',
    'dash.server_sub': 'Scoring models',
    'dash.today': 'Quick Actions',
    'dash.today_sub': 'Direct access to your tools',
    'dash.goto_octroi': 'New credit application',
    'dash.goto_comportement': 'Analyze a client',
    'dash.goto_assistant': 'Query AI assistant',
    'dash.goto_dossiers': 'View files',
    'dash.goto_bi': 'Open dashboards',
    'dash.goto_guide': 'View guide',
    'dash.loading': 'Loading data...',
    'dash.view_all': 'View all',

    /* ── Iframe wrapper ── */
    'iframe.loading': 'Loading interface...',
    'iframe.fullscreen': 'Fullscreen',
    'iframe.refresh': 'Refresh',
    'iframe.octroi_title': 'Loan Scoring',
    'iframe.octroi_sub': 'Evaluation of new credit applications',
    'iframe.comportement_title': 'Behavioral Scoring',
    'iframe.comportement_sub': 'Repayment behavior analysis',
    'iframe.assistant_title': 'Banking AI Assistant',
    'iframe.assistant_sub': 'Intelligent assistant based on your data and regulations',

    /* ── Dossiers ── */
    'dos.title': 'Pending Files',
    'dos.subtitle': 'Scoring decisions awaiting agent confirmation',
    'dos.empty': 'No pending files',
    'dos.empty_sub': 'All decisions have been processed.',
    'dos.loading': 'Loading files...',
    'dos.error': 'Unable to load files. Check server connection.',
    'dos.refresh': 'Refresh',
    'dos.col_id': 'Decision ID',
    'dos.col_cin': 'CIN / Client',
    'dos.col_score': 'Score',
    'dos.col_decision': 'AI Decision',
    'dos.col_date': 'Date',
    'dos.col_action': 'Action',
    'dos.confirm': 'Confirm',
    'dos.override': 'Override',
    'dos.count': 'files found',
    'dos.server_offline': 'AI Server offline — make sure Flask is running on port 5000.',

    /* ── Guide ── */
    'guide.title': 'User Guide',
    'guide.subtitle': 'Learn to use NextCredit in a few minutes',
    'guide.step': 'Step',
    'guide.of': 'of',
    'guide.prev': 'Previous',
    'guide.next': 'Next',
    'guide.finish': 'Finish guide',
    'guide.restart': 'Restart',
    'guide.tip': 'Tip',
    'guide.shortcut': 'Shortcut',
    'guide.done_title': 'Congratulations!',
    'guide.done_sub': 'You now master the essential features of NextCredit.',
    'guide.go_dashboard': 'Go to dashboard',

    /* ── Common ── */
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search...',
    'common.notifications': 'Notifications',
    'common.no_notif': 'No notifications',
    'common.lang_fr': 'Français',
    'common.lang_en': 'English',
    'common.new': 'New',
    'common.view': 'View',
  }
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly lang = signal<Lang>((localStorage.getItem('nc_lang') as Lang) || 'fr');

  readonly isEn = computed(() => this.lang() === 'en');

  toggle(): void {
    const next: Lang = this.lang() === 'fr' ? 'en' : 'fr';
    this.lang.set(next);
    localStorage.setItem('nc_lang', next);
  }

  set(l: Lang): void {
    this.lang.set(l);
    localStorage.setItem('nc_lang', l);
  }

  t(key: string): string {
    return DICT[this.lang()][key] ?? DICT['fr'][key] ?? key;
  }
}
