import { Injectable, signal } from '@angular/core';

export interface TourStep {
  selector: string | null;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  position: 'right' | 'left' | 'top' | 'bottom' | 'center';
  icon: string;
}

const TOUR_KEY = 'nc_tour_done';

export const TOUR_STEPS: TourStep[] = [
  {
    selector: null,
    titleFr: 'Bienvenue sur NextCredit IA',
    titleEn: 'Welcome to NextCredit AI',
    descFr: 'Votre plateforme intelligente de scoring crédit. Ce guide rapide vous présente les fonctionnalités essentielles en quelques étapes.',
    descEn: 'Your intelligent credit scoring platform. This quick guide walks you through the key features in a few steps.',
    position: 'center',
    icon: 'bi-stars',
  },
  {
    selector: '[data-tour="dashboard"]',
    titleFr: 'Accueil',
    titleEn: 'Home',
    descFr: 'Vue d\'ensemble de votre activité : KPIs en temps réel, dossiers traités, alertes actives et raccourcis vers vos outils.',
    descEn: 'Overview of your activity: real-time KPIs, processed files, active alerts and shortcuts to your tools.',
    position: 'right',
    icon: 'bi-house-door-fill',
  },
  {
    selector: '[data-tour="bi-vue-globale"]',
    titleFr: 'Vue Globale',
    titleEn: 'Global Overview',
    descFr: 'Dashboard Power BI de la performance globale du portefeuille de crédit.',
    descEn: 'Power BI dashboard for the overall credit portfolio performance.',
    position: 'right',
    icon: 'bi-globe2',
  },
  {
    selector: '[data-tour="bi-retard-defaut"]',
    titleFr: 'Retard & Défaut',
    titleEn: 'Delays & Defaults',
    descFr: 'Analyse des tendances de retard de paiement et des défauts de remboursement.',
    descEn: 'Analysis of payment delay trends and repayment defaults.',
    position: 'right',
    icon: 'bi-graph-down-arrow',
  },
  {
    selector: '[data-tour="bi-profil-clients"]',
    titleFr: 'Profil Clients',
    titleEn: 'Client Profiles',
    descFr: 'Segmentation et répartition démographique de votre base de clients.',
    descEn: 'Segmentation and demographic breakdown of your client base.',
    position: 'right',
    icon: 'bi-people-fill',
  },
  {
    selector: '[data-tour="bi-performance"]',
    titleFr: 'Performance Portefeuille',
    titleEn: 'Portfolio Performance',
    descFr: 'Rentabilité et exposition au risque de l\'ensemble du portefeuille crédit.',
    descEn: 'Profitability and risk exposure of the entire credit portfolio.',
    position: 'right',
    icon: 'bi-briefcase-fill',
  },
  {
    selector: '[data-tour="bi-evolution-ia"]',
    titleFr: 'Évolution IA',
    titleEn: 'AI Evolution',
    descFr: 'Suivi en direct de la performance du modèle : AUC-ROC, précision, rappel et courbe ROC.',
    descEn: 'Live monitoring of model performance: AUC-ROC, precision, recall and ROC curve.',
    position: 'right',
    icon: 'bi-cpu-fill',
  },
  {
    selector: '[data-tour="octroi"]',
    titleFr: 'Scoring Octroi',
    titleEn: 'Credit Scoring',
    descFr: 'Soumettez un dossier de demande de crédit. Le modèle IA analyse le profil et retourne un score, une notation et une décision expliquée.',
    descEn: 'Submit a credit application. The AI model analyzes the profile and returns a score, rating and explained decision.',
    position: 'right',
    icon: 'bi-bank',
  },
  {
    selector: '[data-tour="comportement"]',
    titleFr: 'Scoring Comportemental',
    titleEn: 'Behavioral Scoring',
    descFr: 'Analysez le comportement de remboursement d\'un client existant : probabilité de défaut, historique de paiements et recommandations.',
    descEn: 'Analyze an existing client\'s repayment behavior: default probability, payment history and recommendations.',
    position: 'right',
    icon: 'bi-graph-up-arrow',
  },
  {
    selector: '[data-tour="assistant"]',
    titleFr: 'Assistant IA',
    titleEn: 'AI Assistant',
    descFr: 'Posez vos questions à notre assistant intelligent : réglementation bancaire, interprétation de scores, conseils clients.',
    descEn: 'Ask our intelligent assistant: banking regulations, score interpretation, client advice.',
    position: 'right',
    icon: 'bi-robot',
  },
  {
    selector: '[data-tour="dossiers"]',
    titleFr: 'Dossiers en attente',
    titleEn: 'Pending Files',
    descFr: 'Consultez et validez les dossiers en attente de décision agent. Approuvez, refusez ou modifiez la décision du modèle.',
    descEn: 'Review and validate files awaiting agent decision. Approve, reject or override the model\'s decision.',
    position: 'right',
    icon: 'bi-folder2-open',
  },
  {
    selector: '[data-tour="risque"]',
    titleFr: 'Alertes Risque',
    titleEn: 'Risk Alerts',
    descFr: 'Liste des clients identifiés à haut risque par le modèle comportemental. Agissez avant que la situation ne se dégrade.',
    descEn: 'List of clients identified as high risk by the behavioral model. Act before the situation worsens.',
    position: 'right',
    icon: 'bi-exclamation-triangle-fill',
  },
  {
    selector: '[data-tour="guide"]',
    titleFr: 'Guide utilisateur',
    titleEn: 'User Guide',
    descFr: 'Consultez la documentation complète, les tutoriels vidéo et la FAQ à tout moment depuis ce menu.',
    descEn: 'Access the full documentation, video tutorials and FAQ at any time from this menu.',
    position: 'right',
    icon: 'bi-book-fill',
  },
];

@Injectable({ providedIn: 'root' })
export class TourService {
  active   = signal(false);
  step     = signal(0);
  total    = TOUR_STEPS.length;
  steps    = TOUR_STEPS;

  startIfFirstTime(): void {
    if (!localStorage.getItem(TOUR_KEY)) {
      setTimeout(() => this.start(), 800);
    }
  }

  start(): void {
    this.step.set(0);
    this.active.set(true);
  }

  next(): void {
    if (this.step() < this.total - 1) {
      this.step.set(this.step() + 1);
    } else {
      this.finish();
    }
  }

  prev(): void {
    if (this.step() > 0) this.step.set(this.step() - 1);
  }

  finish(): void {
    this.active.set(false);
    localStorage.setItem(TOUR_KEY, '1');
  }
}
