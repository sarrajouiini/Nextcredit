import { Component, signal, computed } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

interface GuideStep {
  navIcon: string;
  navLabel: string;
  navLabelEn: string;
  navColor: string;
  route: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  tipFr: string;
  tipEn: string;
  features: { fr: string; en: string }[];
  isNew?: boolean;
}

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink],
  template: `
    <div class="gt-page">

      <!-- Header -->
      <div class="gt-header">
        <div>
          <h1>{{ lang === 'fr' ? 'Guide utilisateur' : 'User Guide' }}</h1>
          <p>{{ lang === 'fr' ? 'Découvrez chaque fonctionnalité en quelques secondes' : 'Discover each feature in seconds' }}</p>
        </div>
        <div class="gt-header-pills">
          <button *ngFor="let s of steps; let i = index"
            class="gt-hpill"
            [class.active]="i === idx()"
            [class.done]="i < idx()"
            (click)="goTo(i)">
            <i class="bi" [ngClass]="i < idx() ? 'bi-check-lg' : s.navIcon"></i>
            <span class="gt-hpill-label">{{ lang === 'fr' ? s.navLabel : s.navLabelEn }}</span>
          </button>
        </div>
      </div>

      <!-- TOUR AREA -->
      <div class="gt-tour" *ngIf="!done()">

        <!-- Mock sidebar -->
        <div class="gt-sidebar">
          <div class="gt-sb-logo">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
              <path d="M24 3 L45 42 L3 42 Z" fill="#fff"/>
              <path d="M24 13 L39 40 L9 40 Z" fill="rgba(255,255,255,.25)"/>
              <rect x="10" y="23" width="28" height="5" rx="1.5" fill="#f5c518"/>
            </svg>
            <span>NextCredit</span>
          </div>

          <div class="gt-sb-section">
            <div class="gt-sb-label">{{ lang === 'fr' ? 'Principal' : 'Main' }}</div>
            <div *ngFor="let s of steps; let i = index"
              class="gt-sb-item"
              [class.highlight]="i === idx()"
              (click)="goTo(i)">
              <i class="bi" [ngClass]="s.navIcon" [style.color]="i === idx() ? s.navColor : ''"></i>
              <span>{{ lang === 'fr' ? s.navLabel : s.navLabelEn }}</span>
              <span class="gt-sb-new" *ngIf="s.isNew">NEW</span>
              <!-- Arrow pointing to tooltip -->
              <div class="gt-sb-arrow" *ngIf="i === idx()"></div>
            </div>
          </div>

          <!-- Progress bar at bottom -->
          <div class="gt-sb-bottom">
            <div class="gt-sb-prog-track">
              <div class="gt-sb-prog-fill" [style.width.%]="progress()"></div>
            </div>
            <div class="gt-sb-prog-label">{{ idx() + 1 }} / {{ steps.length }}</div>
          </div>
        </div>

        <!-- Tooltip card -->
        <div class="gt-tooltip">
          <div class="gt-tt-top">
            <div class="gt-tt-ico" [style.background]="step().navColor + '22'" [style.color]="step().navColor">
              <i class="bi" [ngClass]="step().navIcon"></i>
            </div>
            <button class="gt-tt-close" (click)="done.set(true)">✕</button>
          </div>

          <h2>{{ lang === 'fr' ? step().titleFr : step().titleEn }}</h2>
          <p class="gt-tt-desc">{{ lang === 'fr' ? step().descFr : step().descEn }}</p>

          <div class="gt-tt-features">
            <div class="gt-tt-feat" *ngFor="let f of step().features">
              <i class="bi bi-check-circle-fill"></i>
              <span>{{ lang === 'fr' ? f.fr : f.en }}</span>
            </div>
          </div>

          <div class="gt-tt-tip">
            <i class="bi bi-lightbulb-fill"></i>
            {{ lang === 'fr' ? step().tipFr : step().tipEn }}
          </div>

          <!-- Buttons like the image -->
          <div class="gt-tt-actions">
            <button class="gt-btn-later" (click)="prev()" [disabled]="idx() === 0">
              <i class="bi bi-chevron-left"></i>
              {{ lang === 'fr' ? 'Précédent' : 'Later' }}
            </button>
            <button class="gt-btn-go" (click)="next()">
              {{ idx() === steps.length - 1
                ? (lang === 'fr' ? 'Terminer' : "Let's go")
                : (lang === 'fr' ? 'Suivant' : "Next") }}
              <i class="bi" [ngClass]="idx() === steps.length - 1 ? 'bi-check-lg' : 'bi-chevron-right'"></i>
            </button>
          </div>

          <!-- Step counter -->
          <div class="gt-tt-counter">
            <div class="gt-tt-dots">
              <span *ngFor="let s of steps; let i = index"
                class="gt-dot"
                [class.active]="i === idx()"
                (click)="goTo(i)"></span>
            </div>
            <span class="gt-tt-count">{{ idx() + 1 }} / {{ steps.length }}</span>
          </div>
        </div>

      </div>

      <!-- Done screen -->
      <div class="gt-done" *ngIf="done()">
        <div class="gt-done-trophy">🏆</div>
        <h2>{{ lang === 'fr' ? 'Félicitations !' : 'Congratulations!' }}</h2>
        <p>{{ lang === 'fr'
          ? 'Vous maîtrisez maintenant toutes les fonctionnalités de NextCredit.'
          : 'You now master all NextCredit features.' }}</p>
        <div class="gt-done-btns">
          <a routerLink="/agent/dashboard" class="gt-done-primary">
            <i class="bi bi-grid-1x2-fill"></i>
            {{ lang === 'fr' ? 'Aller au dashboard' : 'Go to dashboard' }}
          </a>
          <button class="gt-done-secondary" (click)="restart()">
            <i class="bi bi-arrow-counterclockwise"></i>
            {{ lang === 'fr' ? 'Recommencer' : 'Restart' }}
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .gt-page { max-width: 1100px; }

    /* Header */
    .gt-header { margin-bottom: 28px; }
    .gt-header h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 22px; color: #152247; }
    .gt-header p { font-size: 13.5px; color: #6b7488; margin-top: 4px; margin-bottom: 16px; }
    .gt-header-pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .gt-hpill {
      display: flex; align-items: center; gap: 7px;
      padding: 7px 13px; border-radius: 20px;
      border: 1.5px solid #e8edf6; background: #fff;
      font-size: 12px; font-weight: 600; color: #9aa1b3;
      cursor: pointer; transition: all .16s;
    }
    .gt-hpill:hover { border-color: #f5c518; color: #152247; }
    .gt-hpill.active { background: #1a1a2e; border-color: #1a1a2e; color: #f5c518; }
    .gt-hpill.done { background: #d1fae5; border-color: #a7f3d0; color: #065f46; }
    .gt-hpill-label { display: none; }
    @media (min-width: 700px) { .gt-hpill-label { display: inline; } }

    /* Tour layout */
    .gt-tour {
      display: flex;
      gap: 0;
      align-items: flex-start;
    }

    /* Mock sidebar */
    .gt-sidebar {
      width: 220px;
      flex-shrink: 0;
      background: #1a1a2e;
      border-radius: 20px 0 0 20px;
      padding: 20px 14px;
      min-height: 520px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .gt-sb-logo {
      display: flex; align-items: center; gap: 9px;
      padding: 0 8px 16px;
      border-bottom: 1px solid rgba(255,255,255,.08);
      margin-bottom: 10px;
    }
    .gt-sb-logo span {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 14px; color: #fff;
    }
    .gt-sb-label {
      font-size: 9.5px; font-weight: 700; color: rgba(255,255,255,.3);
      text-transform: uppercase; letter-spacing: .07em;
      padding: 0 10px; margin-bottom: 4px;
    }
    .gt-sb-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; border-radius: 10px;
      font-size: 12.5px; color: rgba(255,255,255,.45);
      cursor: pointer; transition: all .16s;
      position: relative;
    }
    .gt-sb-item:hover { background: rgba(255,255,255,.06); color: rgba(255,255,255,.7); }
    .gt-sb-item.highlight {
      background: rgba(245,197,24,.12);
      color: #f5c518;
      border: 1.5px solid rgba(245,197,24,.4);
      font-weight: 700;
    }
    .gt-sb-item i { font-size: 15px; flex-shrink: 0; }
    .gt-sb-new {
      margin-left: auto;
      background: #f5c518; color: #1a1a2e;
      font-size: 8px; font-weight: 800;
      padding: 2px 6px; border-radius: 6px;
    }

    /* Arrow from sidebar to tooltip */
    .gt-sb-arrow {
      position: absolute;
      right: -14px;
      top: 50%;
      transform: translateY(-50%);
      width: 0; height: 0;
      border-top: 9px solid transparent;
      border-bottom: 9px solid transparent;
      border-left: 13px solid rgba(245,197,24,.4);
      z-index: 10;
    }

    .gt-sb-bottom {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,.08);
    }
    .gt-sb-prog-track { height: 4px; background: rgba(255,255,255,.1); border-radius: 2px; overflow: hidden; margin-bottom: 8px; }
    .gt-sb-prog-fill { height: 100%; background: #f5c518; border-radius: 2px; transition: width .4s ease; }
    .gt-sb-prog-label { font-size: 11px; color: rgba(255,255,255,.35); text-align: center; }

    /* Tooltip card */
    .gt-tooltip {
      flex: 1;
      background: #1a1a2e;
      border-radius: 0 20px 20px 0;
      padding: 28px 28px 24px;
      position: relative;
      border-left: 1px solid rgba(255,255,255,.06);
    }

    .gt-tt-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
    .gt-tt-ico {
      width: 44px; height: 44px; border-radius: 13px;
      display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .gt-tt-close {
      background: rgba(255,255,255,.08); border: none; color: rgba(255,255,255,.4);
      width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 12px;
      display: flex; align-items: center; justify-content: center;
      transition: background .15s, color .15s;
    }
    .gt-tt-close:hover { background: rgba(255,255,255,.15); color: #fff; }

    .gt-tooltip h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 20px; color: #fff;
      margin-bottom: 10px; line-height: 1.3;
    }
    .gt-tt-desc { font-size: 13.5px; color: rgba(255,255,255,.6); line-height: 1.7; margin-bottom: 20px; }

    .gt-tt-features { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
    .gt-tt-feat { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(255,255,255,.75); }
    .gt-tt-feat i { color: #f5c518; font-size: 13px; flex-shrink: 0; }

    .gt-tt-tip {
      display: flex; align-items: flex-start; gap: 9px;
      background: rgba(245,197,24,.08); border: 1px solid rgba(245,197,24,.2);
      border-radius: 12px; padding: 12px 14px;
      font-size: 12.5px; color: rgba(245,197,24,.85);
      line-height: 1.55; margin-bottom: 24px;
    }
    .gt-tt-tip i { flex-shrink: 0; margin-top: 1px; }

    /* Action buttons — like the image */
    .gt-tt-actions { display: flex; gap: 12px; margin-bottom: 20px; }
    .gt-btn-later {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
      padding: 13px; border-radius: 30px;
      background: #f5c518; color: #1a1a2e;
      border: none; font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13.5px; font-weight: 800; cursor: pointer;
      transition: opacity .15s, transform .15s;
      text-transform: uppercase; letter-spacing: .04em;
    }
    .gt-btn-later:disabled { opacity: .3; cursor: not-allowed; }
    .gt-btn-later:not(:disabled):hover { opacity: .88; transform: translateY(-1px); }

    .gt-btn-go {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
      padding: 13px; border-radius: 30px;
      background: #f5c518; color: #1a1a2e;
      border: none; font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13.5px; font-weight: 800; cursor: pointer;
      transition: opacity .15s, transform .15s;
      text-transform: uppercase; letter-spacing: .04em;
    }
    .gt-btn-go:hover { opacity: .88; transform: translateY(-1px); }

    /* Counter row */
    .gt-tt-counter {
      display: flex; align-items: center; justify-content: space-between;
      border-top: 1px solid rgba(255,255,255,.08); padding-top: 16px;
    }
    .gt-tt-dots { display: flex; gap: 5px; }
    .gt-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(255,255,255,.15); cursor: pointer; transition: all .18s;
    }
    .gt-dot.active { background: #f5c518; width: 20px; border-radius: 4px; }
    .gt-tt-count { font-size: 12.5px; font-weight: 700; color: #f5c518; }

    /* Done screen */
    .gt-done {
      background: #1a1a2e; border-radius: 20px;
      padding: 64px; text-align: center;
    }
    .gt-done-trophy { font-size: 64px; margin-bottom: 20px; animation: pop .5s cubic-bezier(.36,.07,.19,.97); }
    @keyframes pop { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
    .gt-done h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 26px; color: #fff; margin-bottom: 10px; }
    .gt-done p { font-size: 14px; color: rgba(255,255,255,.55); margin-bottom: 32px; }
    .gt-done-btns { display: flex; gap: 12px; justify-content: center; }
    .gt-done-primary {
      display: flex; align-items: center; gap: 8px;
      background: #f5c518; color: #1a1a2e;
      padding: 13px 24px; border-radius: 30px;
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 14px;
      text-decoration: none; text-transform: uppercase; letter-spacing: .04em;
      transition: opacity .15s;
    }
    .gt-done-primary:hover { opacity: .88; }
    .gt-done-secondary {
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,.08); border: 1.5px solid rgba(255,255,255,.15); color: rgba(255,255,255,.7);
      padding: 13px 24px; border-radius: 30px;
      font-weight: 600; font-size: 14px; cursor: pointer;
      transition: all .15s;
    }
    .gt-done-secondary:hover { background: rgba(255,255,255,.14); color: #fff; }

    @media (max-width: 700px) {
      .gt-tour { flex-direction: column; }
      .gt-sidebar { width: 100%; border-radius: 20px 20px 0 0; min-height: auto; flex-direction: row; flex-wrap: wrap; padding: 14px; }
      .gt-sb-logo, .gt-sb-label, .gt-sb-bottom { display: none; }
      .gt-tooltip { border-radius: 0 0 20px 20px; }
      .gt-sb-arrow { display: none; }
    }
  `]
})
export class GuideComponent {
  idx = signal(0);
  done = signal(false);

  steps: GuideStep[] = [
    {
      navIcon: 'bi-house-door-fill', navLabel: 'Accueil', navLabelEn: 'Home',
      navColor: '#1E6FD9', route: '/agent/dashboard',
      titleFr: 'Accueil — votre point de départ',
      titleEn: 'Home — your starting point',
      descFr: 'L\'accueil affiche en temps réel les KPIs essentiels : dossiers en attente, alertes risque et statut du serveur IA, ainsi que le top 5 des clients à risque.',
      descEn: 'The home page shows real-time KPIs: pending files, risk alerts and AI server status, plus the top 5 highest-risk clients.',
      tipFr: 'Cliquez sur un indicateur KPI pour être redirigé instantanément vers la section correspondante.',
      tipEn: 'Click a KPI indicator to be redirected instantly to the corresponding section.',
      features: [
        { fr: 'KPIs en temps réel depuis le serveur Flask', en: 'Real-time KPIs from Flask server' },
        { fr: 'Top 5 des alertes risque', en: 'Top 5 risk alerts' },
        { fr: 'Raccourcis vers tous les modules', en: 'Shortcuts to all modules' },
      ]
    },
    {
      navIcon: 'bi-globe2', navLabel: 'Vue Globale', navLabelEn: 'Global Overview',
      navColor: '#152247', route: '/agent/bi/vue-globale',
      titleFr: 'Vue Globale — la performance du portefeuille en un coup d\'œil',
      titleEn: 'Global Overview — portfolio performance at a glance',
      descFr: 'Dashboard Power BI présentant la performance globale du portefeuille de crédit : volumes, taux d\'accord et tendances générales.',
      descEn: 'Power BI dashboard presenting the overall credit portfolio performance: volumes, approval rates and general trends.',
      tipFr: 'Utilisez les filtres du rapport Power BI pour affiner la période ou l\'agence.',
      tipEn: 'Use the Power BI report filters to refine the period or branch.',
      features: [
        { fr: 'Rapport Power BI intégré', en: 'Embedded Power BI report' },
        { fr: 'Données actualisées automatiquement', en: 'Automatically refreshed data' },
        { fr: 'Vue consolidée du portefeuille', en: 'Consolidated portfolio view' },
      ]
    },
    {
      navIcon: 'bi-graph-down-arrow', navLabel: 'Retard & Défaut', navLabelEn: 'Delays & Defaults',
      navColor: '#ef4444', route: '/agent/bi/retard-defaut',
      titleFr: 'Retard & Défaut — anticipez les risques',
      titleEn: 'Delays & Defaults — anticipate risk',
      descFr: 'Analysez les tendances de retard de paiement et de défaut de remboursement à l\'échelle du portefeuille.',
      descEn: 'Analyze payment delay and repayment default trends across the portfolio.',
      tipFr: 'Croisez ce dashboard avec la page Alertes Risque pour agir sur les cas individuels.',
      tipEn: 'Cross-reference this dashboard with the Risk Alerts page to act on individual cases.',
      features: [
        { fr: 'Tendances de retard par période', en: 'Delay trends by period' },
        { fr: 'Analyse des taux de défaut', en: 'Default rate analysis' },
        { fr: 'Rapport Power BI intégré', en: 'Embedded Power BI report' },
      ]
    },
    {
      navIcon: 'bi-people-fill', navLabel: 'Profil Clients', navLabelEn: 'Client Profiles',
      navColor: '#6c5ce7', route: '/agent/bi/profil-clients',
      titleFr: 'Profil Clients — comprenez votre base',
      titleEn: 'Client Profiles — understand your base',
      descFr: 'Segmentation et répartition démographique de votre base de clients : âge, profession, revenus, situation familiale.',
      descEn: 'Segmentation and demographic breakdown of your client base: age, profession, income, family situation.',
      tipFr: 'Utile pour cibler des campagnes ou ajuster les critères d\'octroi.',
      tipEn: 'Useful for targeting campaigns or adjusting granting criteria.',
      features: [
        { fr: 'Segmentation démographique', en: 'Demographic segmentation' },
        { fr: 'Répartition par profil de risque', en: 'Breakdown by risk profile' },
        { fr: 'Rapport Power BI intégré', en: 'Embedded Power BI report' },
      ]
    },
    {
      navIcon: 'bi-briefcase-fill', navLabel: 'Performance Portefeuille', navLabelEn: 'Portfolio Performance',
      navColor: '#0a8f60', route: '/agent/bi/performance-portefeuille',
      titleFr: 'Performance Portefeuille — rentabilité et exposition',
      titleEn: 'Portfolio Performance — profitability and exposure',
      descFr: 'Suivez la rentabilité et l\'exposition au risque de l\'ensemble du portefeuille crédit.',
      descEn: 'Track the profitability and risk exposure of the entire credit portfolio.',
      tipFr: 'Idéal pour les revues mensuelles de portefeuille avec la direction.',
      tipEn: 'Ideal for monthly portfolio reviews with management.',
      features: [
        { fr: 'Indicateurs de rentabilité', en: 'Profitability indicators' },
        { fr: 'Exposition au risque globale', en: 'Overall risk exposure' },
        { fr: 'Rapport Power BI intégré', en: 'Embedded Power BI report' },
      ]
    },
    {
      navIcon: 'bi-cpu-fill', navLabel: 'Évolution IA', navLabelEn: 'AI Evolution',
      navColor: '#1E6FD9', route: '/agent/bi/evolution-ia', isNew: true,
      titleFr: 'Évolution IA — la performance du modèle en direct',
      titleEn: 'AI Evolution — live model performance',
      descFr: 'Suivez en direct l\'AUC-ROC, la précision, le rappel et le F1-score du modèle de scoring, calculés à partir des dossiers réellement confirmés par les agents.',
      descEn: 'Live tracking of the scoring model\'s AUC-ROC, precision, recall and F1-score, computed from files actually confirmed by agents.',
      tipFr: 'Un badge "DÉMO" s\'affiche tant que moins de 10 dossiers ont été confirmés.',
      tipEn: 'A "DEMO" badge shows as long as fewer than 10 files have been confirmed.',
      features: [
        { fr: 'Courbe ROC animée', en: 'Animated ROC curve' },
        { fr: 'Précision, rappel, F1, exactitude', en: 'Precision, recall, F1, accuracy' },
        { fr: 'Calculé sur données réelles confirmées', en: 'Computed on real confirmed data' },
      ]
    },
    {
      navIcon: 'bi-bank', navLabel: 'Octroi crédit', navLabelEn: 'Loan Scoring',
      navColor: '#1557b0', route: '/agent/octroi',
      titleFr: 'Scoring d\'Octroi — évaluez en secondes',
      titleEn: 'Loan Scoring — evaluate in seconds',
      descFr: 'Saisissez le CIN du client pour obtenir automatiquement un score IA avec notation et décision. L\'explicabilité SHAP vous montre les variables qui influencent le résultat.',
      descEn: 'Enter the client CIN to automatically get an AI score with rating and decision. SHAP explainability shows which variables drive the result.',
      tipFr: 'Utilisez le bouton "Plein écran" pour plus de confort lors de la saisie d\'un dossier complexe.',
      tipEn: 'Use the "Fullscreen" button for more comfort when entering a complex file.',
      features: [
        { fr: 'Score 0–1000 avec notation A–D', en: 'Score 0–1000 with A–D rating' },
        { fr: 'Décision IA avec explicabilité SHAP', en: 'AI decision with SHAP explainability' },
        { fr: 'Override agent avec justification', en: 'Agent override with justification' },
      ]
    },
    {
      navIcon: 'bi-graph-up-arrow', navLabel: 'Comportemental', navLabelEn: 'Behavioral',
      navColor: '#0a8f60', route: '/agent/comportement',
      titleFr: 'Scoring Comportemental — surveillez vos clients',
      titleEn: 'Behavioral Scoring — monitor your clients',
      descFr: 'Analysez le comportement de remboursement des clients existants. Détectez les signaux d\'alerte précoce et recevez des recommandations IA personnalisées.',
      descEn: 'Analyze the repayment behavior of existing clients. Detect early warning signals and receive personalized AI recommendations.',
      tipFr: 'Consultez le calendrier de paiements pour visualiser l\'historique complet du client mois par mois.',
      tipEn: 'Check the payments calendar to view the client\'s full month-by-month history.',
      features: [
        { fr: 'Score comportemental + notation Bâle II', en: 'Behavioral score + Basel II rating' },
        { fr: 'Indicateurs PD, LGD, EAD, EL', en: 'PD, LGD, EAD, EL indicators' },
        { fr: 'Recommandations IA (Gemini)', en: 'AI recommendations (Gemini)' },
      ]
    },
    {
      navIcon: 'bi-folder2-open', navLabel: 'Dossiers', navLabelEn: 'Pending Files',
      navColor: '#f59e0b', route: '/agent/dossiers', isNew: true,
      titleFr: 'Dossiers en attente — validez les décisions',
      titleEn: 'Pending Files — validate decisions',
      descFr: 'Retrouvez toutes les décisions IA en attente de validation humaine. Confirmez en un clic ou modifiez la décision avec une justification.',
      descEn: 'Find all AI decisions awaiting human validation. Confirm with one click or modify the decision with a justification.',
      tipFr: 'Les dossiers confirmés disparaissent automatiquement de la liste.',
      tipEn: 'Confirmed files are automatically removed from the list.',
      features: [
        { fr: 'Liste complète des décisions pendantes', en: 'Complete list of pending decisions' },
        { fr: 'Confirmation ou override en 1 clic', en: 'Confirm or override in 1 click' },
        { fr: 'Badge de comptage dans la sidebar', en: 'Count badge in the sidebar' },
      ]
    },
    {
      navIcon: 'bi-exclamation-triangle-fill', navLabel: 'Alertes Risque', navLabelEn: 'Risk Alerts',
      navColor: '#ef4444', route: '/agent/risque', isNew: true,
      titleFr: 'Alertes Risque — clients à surveiller',
      titleEn: 'Risk Alerts — clients to watch',
      descFr: 'Visualisez les clients identifiés à haut risque par le modèle comportemental. Score, PD, taux de retard et notation Bâle II pour chaque client.',
      descEn: 'View clients identified as high risk by the behavioral model. Score, PD, delay rate and Basel II rating for each client.',
      tipFr: 'Cliquez "Analyser" pour ouvrir directement le scoring comportemental du client.',
      tipEn: 'Click "Analyze" to open the client\'s behavioral scoring directly.',
      features: [
        { fr: 'Tri automatique par niveau de risque', en: 'Automatic sort by risk level' },
        { fr: 'Métriques Bâle II par client', en: 'Basel II metrics per client' },
        { fr: 'Accès rapide à l\'assistant IA', en: 'Quick access to AI assistant' },
      ]
    },
    {
      navIcon: 'bi-robot', navLabel: 'Assistant IA', navLabelEn: 'AI Assistant',
      navColor: '#6c5ce7', route: '/agent/assistant',
      titleFr: 'Assistant IA — votre copilote bancaire',
      titleEn: 'AI Assistant — your banking copilot',
      descFr: 'Posez vos questions à l\'assistant alimenté par RAG. Il puise dans la réglementation BCT, Bâle III et vos données clients pour vous donner des réponses précises.',
      descEn: 'Ask your questions to the RAG-powered assistant. It draws from BCT regulations, Basel III and your client data to give accurate answers.',
      tipFr: 'Effacez l\'historique de session si vous changez de sujet pour des réponses plus précises.',
      tipEn: 'Clear the session history when changing topics for more accurate answers.',
      features: [
        { fr: 'RAG sur réglementation BCT / Bâle III', en: 'RAG on BCT / Basel III regulations' },
        { fr: 'Recherche dans vos dossiers clients', en: 'Search through your client files' },
        { fr: 'Historique de conversation persistant', en: 'Persistent conversation history' },
      ]
    },
  ];

  constructor(public ts: TranslationService) {}

  get lang() { return this.ts.lang(); }
  step = computed(() => this.steps[this.idx()]);
  progress = computed(() => Math.round(((this.idx() + 1) / this.steps.length) * 100));

  goTo(i: number): void { this.idx.set(i); this.done.set(false); }

  next(): void {
    if (this.idx() === this.steps.length - 1) this.done.set(true);
    else this.idx.update(i => i + 1);
  }

  prev(): void {
    if (this.idx() > 0) this.idx.update(i => i - 1);
  }

  restart(): void { this.idx.set(0); this.done.set(false); }
}
