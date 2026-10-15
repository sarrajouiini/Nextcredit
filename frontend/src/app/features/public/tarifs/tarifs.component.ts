import { Component } from '@angular/core';
import { NgFor, NgIf, NgClass, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

interface Plan {
  id: string;
  nameFr: string;
  nameEn: string;
  badge?: string;
  price: number | null;
  priceSuffix: string;
  descFr: string;
  descEn: string;
  color: string;
  bgColor: string;
  highlight: boolean;
  features: { fr: string; en: string; included: boolean }[];
}

@Component({
  selector: 'app-tarifs',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, TranslatePipe, DecimalPipe],
  template: `
    <section class="tr-hero">
      <div class="tr-hero-inner">
        <div class="tr-badge">
          <i class="bi bi-tags-fill"></i>
          {{ ts.isEn() ? 'Simple, transparent pricing' : 'Tarification simple et transparente' }}
        </div>
        <h1>{{ ts.isEn() ? 'Choose the plan that fits your institution' : 'Choisissez le plan adapté à votre institution' }}</h1>
        <p>{{ ts.isEn()
          ? 'All plans include a 30-day free trial. No commitment.'
          : "Tous les plans incluent 30 jours d'essai gratuit. Sans engagement." }}</p>

        <div class="tr-toggle">
          <span [class.active]="!annuel">{{ ts.isEn() ? 'Monthly' : 'Mensuel' }}</span>
          <button class="tr-switch" (click)="annuel = !annuel" [class.on]="annuel">
            <span class="tr-switch-thumb"></span>
          </button>
          <span [class.active]="annuel">
            {{ ts.isEn() ? 'Annual' : 'Annuel' }}
            <span class="tr-save-badge">-20%</span>
          </span>
        </div>
      </div>
    </section>

    <section class="tr-plans">
      <div class="tr-plans-inner">
        <div class="tr-grid">
          <div *ngFor="let p of plans" class="tr-card" [class.highlight]="p.highlight">
            <div class="tr-card-top" [style.background]="p.highlight ? p.color : p.bgColor">
              <div class="tr-plan-badge" *ngIf="p.badge" [style.background]="p.color" [style.color]="p.highlight ? '#fff' : '#fff'">
                {{ p.badge }}
              </div>
              <div class="tr-plan-name" [style.color]="p.highlight ? '#fff' : p.color">
                {{ ts.isEn() ? p.nameEn : p.nameFr }}
              </div>

              <div class="tr-plan-price" [style.color]="p.highlight ? '#fff' : '#152247'">
                <ng-container *ngIf="p.price !== null">
                  <span class="tr-price-val">{{ getPrix(p) | number:'1.0-0' }}</span>
                  <span class="tr-price-cur">DT</span>
                  <span class="tr-price-per">/ {{ ts.isEn() ? 'mo' : 'mois' }}</span>
                </ng-container>
                <ng-container *ngIf="p.price === null">
                  <span class="tr-price-custom">{{ ts.isEn() ? 'Custom' : 'Sur mesure' }}</span>
                </ng-container>
              </div>

              <p class="tr-plan-desc" [style.color]="p.highlight ? 'rgba(255,255,255,.8)' : '#6b7488'">
                {{ ts.isEn() ? p.descEn : p.descFr }}
              </p>

              <div class="tr-annual-note" *ngIf="annuel && p.price !== null" [style.color]="p.highlight ? 'rgba(255,255,255,.7)' : '#9aa1b3'">
                {{ ts.isEn() ? 'Billed' : 'Facturé' }} {{ getPrixAnnuel(p) | number:'1.0-0' }} DT / {{ ts.isEn() ? 'year' : 'an' }}
              </div>
            </div>

            <div class="tr-card-body">
              <ul class="tr-feats">
                <li *ngFor="let f of p.features" [class.excluded]="!f.included">
                  <i class="bi" [ngClass]="f.included ? 'bi-check-circle-fill' : 'bi-x-circle'" [style.color]="f.included ? p.color : '#cbd5e1'"></i>
                  <span>{{ ts.isEn() ? f.en : f.fr }}</span>
                </li>
              </ul>

              <a *ngIf="p.price !== null"
                [routerLink]="['/entreprise']" fragment="demo"
                class="tr-cta"
                [style.background]="p.highlight ? p.color : ''"
                [style.color]="p.highlight ? '#fff' : ''"
                [class.outlined]="!p.highlight">
                <i class="bi bi-calendar-check"></i>
                {{ ts.isEn() ? 'Start free trial' : 'Essai gratuit 30 jours' }}
              </a>
              <a *ngIf="p.price === null"
                [routerLink]="['/entreprise']"
                class="tr-cta"
                [style.background]="p.color"
                style="color:#fff">
                <i class="bi bi-telephone-fill"></i>
                {{ ts.isEn() ? 'Contact us' : 'Nous contacter' }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ / Inclus dans tous les plans -->
    <section class="tr-included">
      <div class="tr-included-inner">
        <h2>{{ ts.isEn() ? 'Included in every plan' : 'Inclus dans tous les plans' }}</h2>
        <div class="tr-inc-grid">
          <div class="tr-inc-item" *ngFor="let item of included">
            <div class="tr-inc-ico" [style.background]="item.bg" [style.color]="item.color">
              <i class="bi" [ngClass]="item.icon"></i>
            </div>
            <div>
              <div class="tr-inc-title">{{ ts.isEn() ? item.titleEn : item.titleFr }}</div>
              <div class="tr-inc-sub">{{ ts.isEn() ? item.descEn : item.descFr }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="tr-cta-section">
      <div class="tr-cta-inner">
        <h2>{{ ts.isEn() ? 'Not sure which plan is right for you?' : 'Pas sûr du plan qui vous convient ?' }}</h2>
        <p>{{ ts.isEn() ? 'Our team will guide you to the best option for your institution.' : 'Notre équipe vous oriente vers la meilleure option pour votre institution.' }}</p>
        <a [routerLink]="['/entreprise']" class="tr-cta-btn">
          <i class="bi bi-chat-dots-fill"></i>
          {{ ts.isEn() ? 'Talk to an expert' : 'Parler à un expert' }}
        </a>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    /* Hero */
    .tr-hero {
      background: linear-gradient(135deg, #f8faff 0%, #eef3ff 100%);
      padding: 80px 24px 60px;
      text-align: center;
      border-bottom: 1px solid #e8edf6;
    }
    .tr-hero-inner { max-width: 720px; margin: 0 auto; }
    .tr-badge {
      display: inline-flex; align-items: center; gap: 7px;
      background: #deeeff; color: #1E6FD9;
      font-size: 13px; font-weight: 700;
      padding: 7px 16px; border-radius: 20px;
      margin-bottom: 22px;
    }
    .tr-hero h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: clamp(28px, 4vw, 44px);
      color: #152247; line-height: 1.2; margin-bottom: 14px;
    }
    .tr-hero p { font-size: 16px; color: #6b7488; margin-bottom: 32px; }

    .tr-toggle { display: inline-flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; color: #9aa1b3; }
    .tr-toggle span.active { color: #152247; }
    .tr-save-badge { background: #d1fae5; color: #065f46; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; margin-left: 6px; }
    .tr-switch {
      width: 48px; height: 26px; border-radius: 13px;
      background: #e8edf6; border: none; cursor: pointer;
      position: relative; transition: background .2s;
    }
    .tr-switch.on { background: #1E6FD9; }
    .tr-switch-thumb {
      position: absolute; width: 20px; height: 20px;
      background: #fff; border-radius: 50%; top: 3px; left: 3px;
      transition: transform .2s; box-shadow: 0 1px 4px rgba(0,0,0,.2);
    }
    .tr-switch.on .tr-switch-thumb { transform: translateX(22px); }

    /* Plans grid */
    .tr-plans { padding: 60px 24px; background: #fff; }
    .tr-plans-inner { max-width: 1200px; margin: 0 auto; }
    .tr-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      align-items: start;
    }

    .tr-card {
      border-radius: 24px; overflow: hidden;
      border: 1.5px solid #e8edf6;
      transition: transform .2s, box-shadow .2s;
    }
    .tr-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(21,34,71,.1); }
    .tr-card.highlight {
      border-color: transparent;
      box-shadow: 0 8px 40px rgba(21,34,71,.15);
      transform: scale(1.03);
    }
    .tr-card.highlight:hover { transform: scale(1.03) translateY(-4px); }

    .tr-card-top { padding: 28px 26px 24px; position: relative; }
    .tr-plan-badge {
      display: inline-block;
      font-size: 10.5px; font-weight: 800;
      padding: 3px 10px; border-radius: 10px;
      margin-bottom: 12px;
      text-transform: uppercase; letter-spacing: .05em;
    }
    .tr-plan-name {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 20px;
      margin-bottom: 16px;
    }
    .tr-plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 12px; }
    .tr-price-val {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 900; font-size: 42px; line-height: 1;
    }
    .tr-price-cur { font-size: 20px; font-weight: 700; margin-top: 8px; }
    .tr-price-per { font-size: 14px; color: inherit; opacity: .6; margin-left: 2px; }
    .tr-price-custom {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 32px;
    }
    .tr-plan-desc { font-size: 13.5px; line-height: 1.6; margin-bottom: 0; }
    .tr-annual-note { font-size: 12px; margin-top: 8px; }

    .tr-card-body { background: #fff; padding: 24px 26px 28px; }
    .tr-feats { list-style: none; padding: 0; margin: 0 0 24px; display: flex; flex-direction: column; gap: 11px; }
    .tr-feats li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: #374151; }
    .tr-feats li.excluded { color: #cbd5e1; }
    .tr-feats li i { font-size: 15px; flex-shrink: 0; margin-top: 1px; }

    .tr-cta {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; padding: 14px; border-radius: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700; font-size: 14px;
      text-decoration: none; transition: all .18s;
      border: 1.5px solid transparent;
    }
    .tr-cta.outlined {
      background: #fff; color: #152247 !important;
      border-color: #e8edf6;
    }
    .tr-cta.outlined:hover { border-color: #1E6FD9; color: #1E6FD9 !important; }
    .tr-cta:not(.outlined):hover { opacity: .88; transform: translateY(-1px); }

    /* Included section */
    .tr-included { background: #f8faff; padding: 64px 24px; border-top: 1px solid #e8edf6; }
    .tr-included-inner { max-width: 1000px; margin: 0 auto; }
    .tr-included h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 26px; color: #152247;
      text-align: center; margin-bottom: 40px;
    }
    .tr-inc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .tr-inc-item { display: flex; align-items: flex-start; gap: 14px; }
    .tr-inc-ico {
      width: 42px; height: 42px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .tr-inc-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 14px; color: #152247; margin-bottom: 3px; }
    .tr-inc-sub { font-size: 13px; color: #6b7488; line-height: 1.5; }

    /* CTA section */
    .tr-cta-section { background: #152247; padding: 72px 24px; text-align: center; }
    .tr-cta-inner { max-width: 600px; margin: 0 auto; }
    .tr-cta-section h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 28px; color: #fff; margin-bottom: 12px; }
    .tr-cta-section p { font-size: 15px; color: rgba(255,255,255,.65); margin-bottom: 32px; }
    .tr-cta-btn {
      display: inline-flex; align-items: center; gap: 10px;
      background: #f5c518; color: #152247;
      padding: 16px 32px; border-radius: 30px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 15px; text-decoration: none;
      transition: opacity .18s, transform .15s;
    }
    .tr-cta-btn:hover { opacity: .9; transform: translateY(-2px); }

    @media (max-width: 900px) { .tr-card.highlight { transform: none; } }
  `]
})
export class TarifsComponent {
  annuel = false;

  constructor(public ts: TranslationService) {}

  plans: Plan[] = [
    {
      id: 'starter',
      nameFr: 'Starter', nameEn: 'Starter',
      price: 490,
      priceSuffix: '/mois',
      descFr: 'Idéal pour les petites banques et coopératives de crédit.',
      descEn: 'Ideal for small banks and credit cooperatives.',
      color: '#1E6FD9', bgColor: '#deeeff',
      highlight: false,
      features: [
        { fr: '1 agent bancaire', en: '1 banking agent', included: true },
        { fr: 'Scoring d\'octroi (IA)', en: 'Loan scoring (AI)', included: true },
        { fr: 'Jusqu\'à 200 dossiers/mois', en: 'Up to 200 files/month', included: true },
        { fr: 'Tableau de bord basique', en: 'Basic dashboard', included: true },
        { fr: 'Scoring comportemental', en: 'Behavioral scoring', included: false },
        { fr: 'Assistant IA (RAG)', en: 'AI Assistant (RAG)', included: false },
        { fr: 'Dashboards Power BI', en: 'Power BI dashboards', included: false },
        { fr: 'Support prioritaire', en: 'Priority support', included: false },
      ]
    },
    {
      id: 'pro',
      nameFr: 'Professionnel', nameEn: 'Professional',
      badge: '⭐ Populaire',
      price: 1190,
      priceSuffix: '/mois',
      descFr: 'La solution complète pour les établissements financiers en croissance.',
      descEn: 'The complete solution for growing financial institutions.',
      color: '#152247', bgColor: '#152247',
      highlight: true,
      features: [
        { fr: 'Jusqu\'à 5 agents bancaires', en: 'Up to 5 banking agents', included: true },
        { fr: 'Scoring d\'octroi (IA)', en: 'Loan scoring (AI)', included: true },
        { fr: 'Dossiers illimités', en: 'Unlimited files', included: true },
        { fr: 'Scoring comportemental', en: 'Behavioral scoring', included: true },
        { fr: 'Assistant IA (RAG)', en: 'AI Assistant (RAG)', included: true },
        { fr: '2 Dashboards Power BI', en: '2 Power BI dashboards', included: true },
        { fr: 'Alertes risque automatiques', en: 'Automatic risk alerts', included: true },
        { fr: 'Support prioritaire (48h)', en: 'Priority support (48h)', included: false },
      ]
    },
    {
      id: 'enterprise',
      nameFr: 'Entreprise', nameEn: 'Enterprise',
      badge: '🏆 Premium',
      price: 2490,
      priceSuffix: '/mois',
      descFr: 'Pour les grandes banques avec des besoins avancés et un volume élevé.',
      descEn: 'For large banks with advanced needs and high volume.',
      color: '#6c5ce7', bgColor: '#ede8ff',
      highlight: false,
      features: [
        { fr: 'Agents bancaires illimités', en: 'Unlimited banking agents', included: true },
        { fr: 'Scoring d\'octroi (IA)', en: 'Loan scoring (AI)', included: true },
        { fr: 'Dossiers illimités', en: 'Unlimited files', included: true },
        { fr: 'Scoring comportemental avancé', en: 'Advanced behavioral scoring', included: true },
        { fr: 'Assistant IA multi-modèles', en: 'Multi-model AI Assistant', included: true },
        { fr: '4 Dashboards Power BI complets', en: '4 complete Power BI dashboards', included: true },
        { fr: 'API privée + intégrations', en: 'Private API + integrations', included: true },
        { fr: 'Support dédié 24/7 (4h)', en: 'Dedicated 24/7 support (4h)', included: true },
      ]
    },
    {
      id: 'custom',
      nameFr: 'Sur Mesure', nameEn: 'Custom',
      price: null,
      priceSuffix: '',
      descFr: 'Solution personnalisée pour les groupes bancaires et banques centrales.',
      descEn: 'Customized solution for banking groups and central banks.',
      color: '#ef4444', bgColor: '#fee2e2',
      highlight: false,
      features: [
        { fr: 'Infrastructure dédiée on-premise', en: 'Dedicated on-premise infrastructure', included: true },
        { fr: 'Modèles IA personnalisés', en: 'Custom AI models', included: true },
        { fr: 'SLA contractuel garanti', en: 'Guaranteed contractual SLA', included: true },
        { fr: 'Formation équipe incluse', en: 'Team training included', included: true },
        { fr: 'Conformité BCT/réglementaire', en: 'BCT/regulatory compliance', included: true },
        { fr: 'Intégrations CBS sur mesure', en: 'Custom CBS integrations', included: true },
        { fr: 'Support dédié 24/7 (1h)', en: 'Dedicated 24/7 support (1h)', included: true },
        { fr: 'Audit & reporting avancé', en: 'Advanced audit & reporting', included: true },
      ]
    }
  ];

  included = [
    {
      icon: 'bi-shield-check-fill', bg: '#d1fae5', color: '#065f46',
      titleFr: 'Essai 30 jours', titleEn: '30-day trial',
      descFr: 'Sans carte bancaire requise', descEn: 'No credit card required'
    },
    {
      icon: 'bi-lock-fill', bg: '#deeeff', color: '#1E6FD9',
      titleFr: 'Données sécurisées', titleEn: 'Secure data',
      descFr: 'Chiffrement AES-256 bout en bout', descEn: 'End-to-end AES-256 encryption'
    },
    {
      icon: 'bi-arrow-up-circle-fill', bg: '#ede8ff', color: '#6c5ce7',
      titleFr: 'Mises à jour incluses', titleEn: 'Updates included',
      descFr: 'Nouvelles fonctionnalités IA automatiques', descEn: 'Automatic new AI features'
    },
    {
      icon: 'bi-people-fill', bg: '#fff3e0', color: '#f59e0b',
      titleFr: 'Onboarding gratuit', titleEn: 'Free onboarding',
      descFr: 'Formation initiale de votre équipe', descEn: 'Initial team training'
    },
    {
      icon: 'bi-headset', bg: '#fee2e2', color: '#ef4444',
      titleFr: 'Support technique', titleEn: 'Technical support',
      descFr: 'Par email et chat en semaine', descEn: 'Via email and chat on weekdays'
    },
    {
      icon: 'bi-file-earmark-text-fill', bg: '#e8edf6', color: '#152247',
      titleFr: 'Conformité BCT', titleEn: 'BCT compliance',
      descFr: 'Réglementation tunisienne respectée', descEn: 'Tunisian regulation compliant'
    },
  ];

  getPrix(p: Plan): number {
    if (p.price === null) return 0;
    return this.annuel ? Math.round(p.price * 0.8) : p.price;
  }

  getPrixAnnuel(p: Plan): number {
    if (p.price === null) return 0;
    return Math.round(p.price * 0.8) * 12;
  }
}
