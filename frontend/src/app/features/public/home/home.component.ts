import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- ─── HERO ─── -->
    <section class="nc-hero">
      <div class="nc-hero-bg"></div>
      <div class="nc-hero-inner">
        <div class="nc-hero-content" id="hero-content">
          <span class="nc-eyebrow">{{ ts.isEn() ? 'Intelligent credit platform' : 'Plateforme de crédit intelligente' }}</span>
          <h1 class="nc-hero-h1">
            {{ ts.isEn() ? 'Credit decisions' : 'Décisions de crédit' }}<br/>
            <span class="nc-gradient-text">{{ ts.isEn() ? 'faster, safer' : 'plus rapides, plus sûres' }}</span>
          </h1>
          <p class="nc-hero-p">
            {{ ts.isEn()
              ? 'NextCredit combines artificial intelligence and banking expertise to assess the granting risk and payment behavior of each client — in seconds.'
              : 'NextCredit combine l’intelligence artificielle et l’expertise bancaire pour évaluer le risque d’octroi et le comportement de paiement de chaque client — en quelques secondes.' }}
          </p>
          <div class="nc-hero-actions">
            <a [routerLink]="['/entreprise']" fragment="contact" class="nc-btn-primary">
              {{ ts.isEn() ? 'Request a demo' : 'Demander une démo' }} <i class="bi bi-arrow-right"></i>
            </a>
            <a routerLink="/produit" class="nc-btn-outline">
              {{ ts.isEn() ? 'Discover the product' : 'Découvrir le produit' }}
            </a>
          </div>
          <div class="nc-hero-stats">
            <div class="nc-stat">
              <span class="nc-stat-num" id="stat-1">98</span><span class="nc-stat-unit">%</span>
              <span class="nc-stat-label">{{ ts.isEn() ? 'Scoring accuracy' : 'Précision du scoring' }}</span>
            </div>
            <div class="nc-stat-div"></div>
            <div class="nc-stat">
              <span class="nc-stat-num" id="stat-2">3</span><span class="nc-stat-unit">s</span>
              <span class="nc-stat-label">{{ ts.isEn() ? 'Decision time' : 'Délai de décision' }}</span>
            </div>
            <div class="nc-stat-div"></div>
            <div class="nc-stat">
              <span class="nc-stat-num" id="stat-3">50</span><span class="nc-stat-unit">+</span>
              <span class="nc-stat-label">{{ ts.isEn() ? 'Partner institutions' : 'Institutions partenaires' }}</span>
            </div>
          </div>
        </div>
        <div class="nc-hero-visual" id="hero-visual">
          <div class="nc-visual-card nc-vc-main">
            <div class="nc-vc-header">
              <i class="bi bi-shield-check"></i>
              <span>{{ ts.isEn() ? 'Loan score' : 'Score d’octroi' }}</span>
            </div>
            <div class="nc-score-ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e8f1fb" stroke-width="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1E6FD9" stroke-width="10"
                  stroke-dasharray="264" stroke-dashoffset="46" stroke-linecap="round"
                  transform="rotate(-90 60 60)" class="nc-ring-anim"/>
              </svg>
              <div class="nc-ring-value">847<span>/1000</span></div>
            </div>
            <div class="nc-vc-factors">
              <div class="nc-factor">
                <span class="nc-factor-label">{{ ts.isEn() ? 'History' : 'Historique' }}</span>
                <div class="nc-factor-bar"><div class="nc-factor-fill" style="width:88%"></div></div>
              </div>
              <div class="nc-factor">
                <span class="nc-factor-label">{{ ts.isEn() ? 'Income' : 'Revenus' }}</span>
                <div class="nc-factor-bar"><div class="nc-factor-fill" style="width:72%"></div></div>
              </div>
              <div class="nc-factor">
                <span class="nc-factor-label">{{ ts.isEn() ? 'Commitment' : 'Engagement' }}</span>
                <div class="nc-factor-bar"><div class="nc-factor-fill nc-fill-green" style="width:94%"></div></div>
              </div>
            </div>
          </div>
          <div class="nc-visual-card nc-vc-small nc-vc-approve">
            <i class="bi bi-check-circle-fill"></i>
            <div>
              <div class="nc-vc-label">{{ ts.isEn() ? 'Loan decision' : 'Décision octroi' }}</div>
              <div class="nc-vc-value nc-green">{{ ts.isEn() ? 'Approved' : 'Approuvé' }}</div>
            </div>
          </div>
          <div class="nc-visual-card nc-vc-small nc-vc-ai">
            <i class="bi bi-robot"></i>
            <div>
              <div class="nc-vc-label">{{ ts.isEn() ? 'AI Assistant' : 'Assistant IA' }}</div>
              <div class="nc-vc-value">{{ ts.isEn() ? 'Active' : 'Actif' }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="nc-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f4f6fb"/>
        </svg>
      </div>
    </section>

    <!-- ─── POURQUOI NEXTCREDIT ─── -->
    <section class="nc-section nc-why">
      <div class="nc-container">
        <div class="nc-section-head nc-anim">
          <span class="nc-badge">{{ ts.isEn() ? 'Why choose us' : 'Pourquoi nous choisir' }}</span>
          <h2>{{ ts.isEn() ? 'What makes the difference with' : 'Ce qui fait la différence avec' }} <span class="nc-text-blue">NextCredit</span></h2>
          <p>{{ ts.isEn() ? 'Cutting-edge technology specifically designed for the African financial sector.' : 'Une technologie de pointe pensée spécifiquement pour le secteur financier africain.' }}</p>
        </div>
        <div class="nc-why-grid">
          <div class="nc-why-card nc-anim-stagger">
            <div class="nc-why-ico" style="background:#deeeff;color:#1E6FD9">
              <i class="bi bi-lightning-charge-fill"></i>
            </div>
            <h3>{{ ts.isEn() ? 'Speed of execution' : 'Rapidité d’exécution' }}</h3>
            <p>{{ ts.isEn() ? 'Credit decisions in less than 3 seconds thanks to our AI models optimized for high performance.' : 'Décisions de crédit en moins de 3 secondes grâce à nos modèles IA optimisés pour la haute performance.' }}</p>
          </div>
          <div class="nc-why-card nc-anim-stagger">
            <div class="nc-why-ico" style="background:#d8f5e9;color:#0a8f60">
              <i class="bi bi-bullseye"></i>
            </div>
            <h3>{{ ts.isEn() ? 'Exceptional accuracy' : 'Précision exceptionnelle' }}</h3>
            <p>{{ ts.isEn() ? 'An accuracy rate above 98% thanks to algorithms trained on real financial data.' : 'Un taux de précision supérieur à 98 % grâce à des algorithmes entraînés sur des données financières réelles.' }}</p>
          </div>
          <div class="nc-why-card nc-anim-stagger">
            <div class="nc-why-ico" style="background:#ede8ff;color:#6c5ce7">
              <i class="bi bi-shield-lock-fill"></i>
            </div>
            <h3>{{ ts.isEn() ? 'Regulatory compliance' : 'Conformité réglementaire' }}</h3>
            <p>{{ ts.isEn() ? 'Fully compliant with Basel III requirements and BCT standards, with complete audit trail.' : 'Pleinement conforme aux exigences Bâle III et aux normes BCT, avec audit trail complet.' }}</p>
          </div>
          <div class="nc-why-card nc-anim-stagger">
            <div class="nc-why-ico" style="background:#fff3e0;color:#e65100">
              <i class="bi bi-graph-up"></i>
            </div>
            <h3>{{ ts.isEn() ? 'Real-time monitoring' : 'Pilotage en temps réel' }}</h3>
            <p>{{ ts.isEn() ? 'Dynamic dashboards to monitor your credit portfolio at any time.' : 'Tableaux de bord dynamiques pour surveiller votre portefeuille de crédit à tout instant.' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CARACTÉRISTIQUES ─── -->
    <section class="nc-section nc-features-section" style="background:#fff">
      <div class="nc-container">
        <div class="nc-section-head nc-anim">
          <span class="nc-badge">{{ ts.isEn() ? 'Features' : 'Fonctionnalités' }}</span>
          <h2>{{ ts.isEn() ? 'A complete platform for the entire credit cycle' : 'Une plateforme complète pour tout le cycle de crédit' }}</h2>
        </div>
        <div class="nc-features-grid">
          <div class="nc-feat-card nc-anim-stagger">
            <i class="bi bi-bank nc-feat-ico" style="color:#1E6FD9"></i>
            <h4>{{ ts.isEn() ? 'Loan scoring' : 'Scoring d’octroi' }}</h4>
            <p>{{ ts.isEn() ? 'Evaluates the probability of default at the time of the application via client profile and credit bureau.' : 'Évalue la probabilité de défaut au moment de la demande via profil client et bureau de crédit.' }}</p>
          </div>
          <div class="nc-feat-card nc-anim-stagger">
            <i class="bi bi-graph-up-arrow nc-feat-ico" style="color:#0a8f60"></i>
            <h4>{{ ts.isEn() ? 'Behavioral scoring' : 'Scoring comportemental' }}</h4>
            <p>{{ ts.isEn() ? 'Tracks the risk evolution of active clients based on their real payment history.' : 'Suit l’évolution du risque des clients actifs à partir de leur historique de paiement réel.' }}</p>
          </div>
          <div class="nc-feat-card nc-anim-stagger">
            <i class="bi bi-robot nc-feat-ico" style="color:#6c5ce7"></i>
            <h4>{{ ts.isEn() ? 'Banking AI assistant' : 'Assistant IA bancaire' }}</h4>
            <p>{{ ts.isEn() ? 'Intelligent chatbot to support agents and clients throughout the credit journey.' : 'Chatbot intelligent pour accompagner agents et clients tout au long du parcours de crédit.' }}</p>
          </div>
          <div class="nc-feat-card nc-anim-stagger">
            <i class="bi bi-bar-chart-line nc-feat-ico" style="color:#e65100"></i>
            <h4>{{ ts.isEn() ? 'Reports & dashboards' : 'Rapports & tableau de bord' }}</h4>
            <p>{{ ts.isEn() ? 'Interactive visualizations for granular portfolio management.' : 'Visualisations interactives pour un pilotage granulaire du portefeuille.' }}</p>
          </div>
          <div class="nc-feat-card nc-anim-stagger">
            <i class="bi bi-diagram-3 nc-feat-ico" style="color:#d63031"></i>
            <h4>{{ ts.isEn() ? 'Rules engine' : 'Moteur de règles' }}</h4>
            <p>{{ ts.isEn() ? 'Configure complex credit policies without writing a single line of code.' : 'Configurez des politiques de crédit complexes sans écrire une seule ligne de code.' }}</p>
          </div>
          <div class="nc-feat-card nc-anim-stagger">
            <i class="bi bi-plug nc-feat-ico" style="color:#00b894"></i>
            <h4>API plug &amp; play</h4>
            <p>{{ ts.isEn() ? 'Quick integration with your existing systems (core banking, CRM) via documented REST API.' : 'Intégration rapide à vos systèmes existants (core banking, CRM) via REST API documentée.' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── ODD ─── -->
    <section class="nc-section nc-odd-section">
      <div class="nc-container">
        <div class="nc-section-head nc-anim">
          <span class="nc-badge nc-badge-gold">{{ ts.isEn() ? 'Commitment' : 'Engagement' }}</span>
          <h2>{{ ts.isEn() ? 'NextCredit commits to the' : 'NextCredit s’engage pour les' }}<br/>{{ ts.isEn() ? 'Sustainable Development Goals' : 'Objectifs de Développement Durable' }}</h2>
          <p>{{ ts.isEn() ? 'Our platform actively contributes to three priority UN SDGs.' : 'Notre plateforme contribue activement à trois ODD prioritaires des Nations Unies.' }}</p>
        </div>
        <div class="nc-odd-grid">

          <!-- ODD 8 -->
          <div class="nc-odd-card nc-anim-stagger">
            <div class="nc-odd-img-wrap nc-odd-8-bg">
              <img src="assets/images/odd-8.png" alt="ODD 8 – Travail décent et croissance économique" class="nc-odd-img"/>
              <div class="nc-odd-img-overlay"></div>
            </div>
            <div class="nc-odd-body">
              <div class="nc-odd-header">
                <span class="nc-odd-num-badge nc-odd-8-badge">ODD 8</span>
                <h3>{{ ts.isEn() ? 'Decent Work & Economic Growth' : 'Travail décent & Croissance économique' }}</h3>
              </div>
              <p>{{ ts.isEn() ? 'By facilitating access to credit for Tunisian SMEs and entrepreneurs, NextCredit directly supports the creation of formal jobs and inclusive, sustainable economic growth.' : 'En facilitant l’accès au crédit pour les PME et les entrepreneurs tunisiens, NextCredit soutient directement la création d’emplois formels et une croissance économique inclusive et durable.' }}</p>
              <ul class="nc-odd-actions">
                <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Easier access to financing for SMEs' : 'Accès facilité au financement pour les PME' }}</li>
                <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Reduced credit decision times' : 'Réduction des délais de décision de crédit' }}</li>
                <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Support for underbanked entrepreneurs' : 'Soutien aux entrepreneurs sous-bancarisés' }}</li>
              </ul>
            </div>
          </div>

          <!-- ODD 9 -->
          <div class="nc-odd-card nc-anim-stagger">
            <div class="nc-odd-img-wrap nc-odd-9-bg">
              <img src="assets/images/odd-9.png" alt="ODD 9 – Industrie, innovation et infrastructure" class="nc-odd-img"/>
              <div class="nc-odd-img-overlay"></div>
            </div>
            <div class="nc-odd-body">
              <div class="nc-odd-header">
                <span class="nc-odd-num-badge nc-odd-9-badge">ODD 9</span>
                <h3>{{ ts.isEn() ? 'Industry, Innovation & Infrastructure' : 'Industrie, Innovation & Infrastructure' }}</h3>
              </div>
              <p>{{ ts.isEn() ? 'NextCredit modernizes African financial infrastructure with cutting-edge AI technologies — ML scoring, banking NLP, BI dashboards — accessible to local institutions of all sizes.' : 'NextCredit modernise l’infrastructure financière africaine avec des technologies d’IA de pointe — scoring ML, NLP bancaire, dashboards BI — accessibles aux institutions locales de toutes tailles.' }}</p>
              <ul class="nc-odd-actions">
                <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Cutting-edge AI adapted to the African context' : 'IA de pointe adaptée au contexte africain' }}</li>
                <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Scalable and resilient SaaS infrastructure' : 'Infrastructure SaaS scalable et résiliente' }}</li>
                <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Open innovation for local institutions' : 'Innovation ouverte aux institutions locales' }}</li>
              </ul>
            </div>
          </div>

          <!-- ODD 10 -->
          <div class="nc-odd-card nc-anim-stagger">
            <div class="nc-odd-img-wrap nc-odd-10-bg">
              <img src="assets/images/odd-10.png" alt="ODD 10 – Inégalités réduites" class="nc-odd-img"/>
              <div class="nc-odd-img-overlay"></div>
            </div>
            <div class="nc-odd-body">
              <div class="nc-odd-header">
                <span class="nc-odd-num-badge nc-odd-10-badge">ODD 10</span>
                <h3>{{ ts.isEn() ? 'Reduced Inequalities' : 'Inégalités Réduites' }}</h3>
              </div>
              <p>{{ ts.isEn() ? 'Objective, transparent and explainable scoring (SHAP) reduces human bias in credit granting and broadens access to financial services for marginalized populations.' : 'Un scoring objectif, transparent et explicable (SHAP) réduit les biais humains dans l’attribution du crédit et élargit l’accès aux services financiers pour les populations marginalisées.' }}</p>
              <ul class="nc-odd-actions">
                <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Scoring without gender or origin bias' : 'Scoring sans biais de genre ou d’origine' }}</li>
                <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Clear explanations for every decision' : 'Explications claires de chaque décision' }}</li>
                <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Inclusion of unbanked populations' : 'Inclusion des populations non bancarisées' }}</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ─── CTA BANNER ─── -->
    <section class="nc-cta-section nc-anim">
      <div class="nc-container">
        <div class="nc-cta-box">
          <div class="nc-cta-bg"></div>
          <div class="nc-cta-content">
            <h2>{{ ts.isEn() ? 'Ready to transform your credit management?' : 'Prêt à transformer votre gestion du crédit ?' }}</h2>
            <p>{{ ts.isEn() ? 'Join the financial institutions that trust NextCredit for smarter decisions.' : 'Rejoignez les institutions financières qui font confiance à NextCredit pour des décisions plus intelligentes.' }}</p>
            <div class="nc-cta-actions">
              <a [routerLink]="['/entreprise']" fragment="contact" class="nc-btn-white">
                {{ ts.isEn() ? 'Request a free demo' : 'Demander une démo gratuite' }} <i class="bi bi-arrow-right"></i>
              </a>
              <a routerLink="/produit" class="nc-btn-ghost">{{ ts.isEn() ? 'See the product' : 'Voir le produit' }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    /* ─── Hero ─── */
    .nc-hero {
      position: relative; background: linear-gradient(135deg, #152247 0%, #0d3166 60%, #1a4a8a 100%);
      padding: 0 0 0;
      overflow: hidden;
    }
    .nc-hero-bg {
      position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    .nc-hero-inner {
      max-width: 1280px; margin: 0 auto;
      padding: 100px 28px 80px;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 60px; align-items: center;
    }
    .nc-hero-content { color: #fff; }
    .nc-eyebrow {
      display: inline-block; font-size: 12px; font-weight: 700;
      color: #89B4E8; background: rgba(137,180,232,.12);
      padding: 6px 16px; border-radius: 20px; margin-bottom: 22px;
      text-transform: uppercase; letter-spacing: .08em;
      border: 1px solid rgba(137,180,232,.25);
    }
    .nc-hero-h1 {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(36px, 4vw, 52px); line-height: 1.12;
      color: #fff; margin-bottom: 22px;
    }
    .nc-gradient-text {
      background: linear-gradient(90deg, #89B4E8, #3EC98B);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .nc-hero-p { font-size: 16px; color: rgba(255,255,255,.72); line-height: 1.7; max-width: 480px; margin-bottom: 32px; }

    .nc-hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 48px; }
    .nc-btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      background: #1E6FD9; color: #fff;
      padding: 14px 26px; border-radius: 14px;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14.5px;
      text-decoration: none; transition: background .2s, transform .15s;
    }
    .nc-btn-primary:hover { background: #1557b0; transform: translateY(-2px); color: #fff; }
    .nc-btn-outline {
      display: inline-flex; align-items: center; gap: 8px;
      border: 1.5px solid rgba(255,255,255,.3); color: rgba(255,255,255,.85);
      padding: 14px 24px; border-radius: 14px;
      font-weight: 600; font-size: 14px; text-decoration: none;
      transition: border-color .2s, background .2s;
    }
    .nc-btn-outline:hover { border-color: rgba(255,255,255,.7); background: rgba(255,255,255,.06); color: #fff; }

    .nc-hero-stats { display: flex; align-items: center; gap: 28px; }
    .nc-stat { display: flex; flex-direction: column; }
    .nc-stat-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 30px; color: #fff; line-height: 1; }
    .nc-stat-unit { font-size: 18px; color: #89B4E8; font-weight: 700; }
    .nc-stat-label { font-size: 12px; color: rgba(255,255,255,.55); margin-top: 4px; }
    .nc-stat-div { width: 1px; height: 40px; background: rgba(255,255,255,.15); }

    /* Visual */
    .nc-hero-visual { position: relative; height: 440px; }
    .nc-visual-card {
      position: absolute; background: rgba(255,255,255,.97);
      border-radius: 20px; box-shadow: 0 24px 64px rgba(0,0,0,.18);
    }
    .nc-vc-main { width: 260px; top: 20px; left: 20px; padding: 22px; }
    .nc-vc-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .nc-vc-header i { font-size: 18px; color: #1E6FD9; }
    .nc-vc-header span { font-size: 13px; font-weight: 700; color: #152247; }

    .nc-score-ring { position: relative; width: 100px; height: 100px; margin: 0 auto 16px; }
    .nc-score-ring svg { width: 100%; height: 100%; }
    .nc-ring-anim { stroke-dashoffset: 280; animation: nc-ring-fill 1.6s ease-out forwards .5s; }
    @keyframes nc-ring-fill { to { stroke-dashoffset: 46; } }
    .nc-ring-value {
      position: absolute; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: #152247;
    }
    .nc-ring-value span { font-size: 11px; color: #9aa1b3; font-weight: 500; }

    .nc-vc-factors { display: flex; flex-direction: column; gap: 8px; }
    .nc-factor { display: flex; flex-direction: column; gap: 4px; }
    .nc-factor-label { font-size: 11px; color: #6b7488; }
    .nc-factor-bar { height: 5px; background: #eaeef6; border-radius: 3px; overflow: hidden; }
    .nc-factor-fill { height: 100%; background: #1E6FD9; border-radius: 3px; animation: nc-bar-grow .8s ease-out forwards .8s; transform-origin: left; transform: scaleX(0); }
    .nc-fill-green { background: #3EC98B; }
    @keyframes nc-bar-grow { to { transform: scaleX(1); } }

    .nc-vc-small { display: flex; align-items: center; gap: 12px; padding: 14px 18px; width: 190px; }
    .nc-vc-small i { font-size: 22px; }
    .nc-vc-approve { top: 270px; left: 40px; }
    .nc-vc-approve i { color: #3EC98B; }
    .nc-vc-ai { top: 140px; left: 230px; }
    .nc-vc-ai i { color: #6c5ce7; }
    .nc-vc-label { font-size: 11px; color: #6b7488; }
    .nc-vc-value { font-weight: 700; font-size: 15px; color: #152247; }
    .nc-green { color: #3EC98B !important; }

    .nc-wave { line-height: 0; }
    .nc-wave svg { width: 100%; height: 60px; display: block; }

    /* ─── Common ─── */
    .nc-section { padding: 90px 0; }
    .nc-container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .nc-section-head { text-align: center; margin-bottom: 56px; }
    .nc-badge {
      display: inline-block; font-size: 11.5px; font-weight: 700;
      color: #1E6FD9; background: #deeeff; padding: 5px 14px;
      border-radius: 20px; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 14px;
    }
    .nc-badge-gold { background: #fff8e1; color: #f59e0b; }
    .nc-section-head h2 {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(26px, 3vw, 38px); color: #152247; line-height: 1.2; margin-bottom: 14px;
    }
    .nc-text-blue { color: #1E6FD9; }
    .nc-section-head p { font-size: 15.5px; color: #6b7488; max-width: 520px; margin: 0 auto; line-height: 1.65; }

    /* ─── Why grid ─── */
    .nc-why { background: #f4f6fb; }
    .nc-why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
    .nc-why-card {
      background: #fff; border-radius: 20px; padding: 30px 24px;
      border: 1px solid #eaeef6; transition: transform .25s, box-shadow .25s;
    }
    .nc-why-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(21,34,71,.09); }
    .nc-why-ico {
      width: 52px; height: 52px; border-radius: 15px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; margin-bottom: 18px;
    }
    .nc-why-card h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #152247; margin-bottom: 10px; }
    .nc-why-card p { font-size: 13.5px; color: #6b7488; line-height: 1.65; }

    /* ─── Features ─── */
    .nc-features-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
    }
    .nc-feat-card {
      background: #f4f6fb; border-radius: 18px; padding: 28px 24px;
      border: 1px solid #eaeef6; transition: background .2s, transform .2s;
    }
    .nc-feat-card:hover { background: #fff; transform: translateY(-4px); box-shadow: 0 12px 32px rgba(21,34,71,.07); }
    .nc-feat-ico { font-size: 30px; margin-bottom: 14px; display: block; }
    .nc-feat-card h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #152247; margin-bottom: 8px; }
    .nc-feat-card p { font-size: 13px; color: #6b7488; line-height: 1.6; }

    /* ─── ODD ─── */
    .nc-odd-section { background: #f4f6fb; }
    .nc-odd-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .nc-odd-card {
      background: #fff; border-radius: 24px; overflow: hidden;
      border: 1px solid #e8edf6; transition: transform .28s, box-shadow .28s;
    }
    .nc-odd-card:hover { transform: translateY(-8px); box-shadow: 0 20px 56px rgba(21,34,71,.12); }

    /* Image wrapper */
    .nc-odd-img-wrap { position: relative; height: 220px; overflow: hidden; }
    .nc-odd-8-bg  { background: #a21942; }
    .nc-odd-9-bg  { background: #fd6925; }
    .nc-odd-10-bg { background: #dd1367; }
    .nc-odd-img {
      width: 100%; height: 100%; object-fit: contain;
      object-position: center; display: block;
      transition: transform .4s ease;
    }
    .nc-odd-card:hover .nc-odd-img { transform: scale(1.04); }
    .nc-odd-img-overlay {
      position: absolute; bottom: 0; left: 0; right: 0; height: 60%;
      background: linear-gradient(to top, rgba(0,0,0,.35) 0%, transparent 100%);
    }

    /* Body */
    .nc-odd-body { padding: 26px 28px 28px; }
    .nc-odd-header { margin-bottom: 12px; }
    .nc-odd-num-badge {
      display: inline-block; font-size: 10.5px; font-weight: 800;
      padding: 3px 11px; border-radius: 12px; color: #fff;
      text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px;
    }
    .nc-odd-8-badge  { background: #a21942; }
    .nc-odd-9-badge  { background: #fd6925; }
    .nc-odd-10-badge { background: #dd1367; }
    .nc-odd-body h3 {
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;
      font-size: 16.5px; color: #152247; line-height: 1.3;
    }
    .nc-odd-body p { font-size: 13.5px; line-height: 1.7; color: #6b7488; margin-bottom: 16px; }
    .nc-odd-actions {
      display: flex; flex-direction: column; gap: 7px;
      list-style: none; padding: 0; margin: 0;
    }
    .nc-odd-actions li {
      display: flex; align-items: flex-start; gap: 8px;
      font-size: 13px; color: #152247; line-height: 1.5;
    }
    .nc-odd-actions li i { color: #10b981; font-size: 14px; flex-shrink: 0; margin-top: 1px; }

    /* ─── CTA ─── */
    .nc-cta-section { padding: 72px 0; background: #fff; }
    .nc-cta-box {
      position: relative; border-radius: 28px; overflow: hidden;
      background: linear-gradient(135deg, #152247 0%, #1E6FD9 100%);
      padding: 64px 56px; text-align: center;
    }
    .nc-cta-bg {
      position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    .nc-cta-content { position: relative; }
    .nc-cta-box h2 {
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 34px;
      color: #fff; margin-bottom: 14px;
    }
    .nc-cta-box p { font-size: 16px; color: rgba(255,255,255,.75); margin-bottom: 32px; }
    .nc-cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .nc-btn-white {
      display: inline-flex; align-items: center; gap: 10px;
      background: #fff; color: #152247;
      padding: 14px 28px; border-radius: 14px;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14.5px;
      text-decoration: none; transition: transform .15s;
    }
    .nc-btn-white:hover { transform: translateY(-2px); color: #1E6FD9; }
    .nc-btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      border: 1.5px solid rgba(255,255,255,.35); color: rgba(255,255,255,.9);
      padding: 14px 24px; border-radius: 14px;
      font-weight: 600; font-size: 14px; text-decoration: none;
      transition: border-color .2s;
    }
    .nc-btn-ghost:hover { border-color: rgba(255,255,255,.7); color: #fff; }

    /* ─── Responsive ─── */
    @media (max-width: 1024px) {
      .nc-hero-inner { grid-template-columns: 1fr; }
      .nc-hero-visual { display: none; }
      .nc-why-grid { grid-template-columns: repeat(2, 1fr); }
      .nc-features-grid { grid-template-columns: repeat(2, 1fr); }
      .nc-odd-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .nc-why-grid { grid-template-columns: 1fr; }
      .nc-features-grid { grid-template-columns: 1fr; }
      .nc-hero-stats { flex-wrap: wrap; gap: 20px; }
      .nc-cta-box { padding: 40px 28px; }
      .nc-cta-box h2 { font-size: 24px; }
    }

    /* ─── Animations scroll reveal ─── */
    @keyframes nc-fade-up {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes nc-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes nc-float-a {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-12px); }
    }
    @keyframes nc-float-b {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(10px); }
    }

    /* Hero entrance — joue immédiatement au chargement */
    #hero-content { animation: nc-fade-up .9s cubic-bezier(.16,1,.3,1) both; }
    #hero-visual  { animation: nc-fade-up .9s .2s cubic-bezier(.16,1,.3,1) both; }

    /* Floating cards */
    .nc-vc-approve { animation: nc-float-a 3s ease-in-out infinite; }
    .nc-vc-ai      { animation: nc-float-b 3.5s .4s ease-in-out infinite; }

    /* Éléments à révéler au scroll (état initial caché) */
    .nc-anim {
      opacity: 0; transform: translateY(36px);
      transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
    }
    .nc-anim.revealed { opacity: 1; transform: translateY(0); }

    /* Stagger cards */
    .nc-anim-stagger {
      opacity: 0; transform: translateY(40px);
      transition: opacity .65s cubic-bezier(.16,1,.3,1), transform .65s cubic-bezier(.16,1,.3,1);
    }
    .nc-anim-stagger.revealed { opacity: 1; transform: translateY(0); }

    .nc-why-card:nth-child(1).revealed,
    .nc-feat-card:nth-child(1).revealed,
    .nc-odd-card:nth-child(1).revealed { transition-delay: 0s; }

    .nc-why-card:nth-child(2).revealed,
    .nc-feat-card:nth-child(2).revealed,
    .nc-odd-card:nth-child(2).revealed { transition-delay: .1s; }

    .nc-why-card:nth-child(3).revealed,
    .nc-feat-card:nth-child(3).revealed,
    .nc-odd-card:nth-child(3).revealed { transition-delay: .2s; }

    .nc-why-card:nth-child(4).revealed,
    .nc-feat-card:nth-child(4).revealed { transition-delay: .3s; }

    .nc-feat-card:nth-child(5).revealed { transition-delay: .1s; }
    .nc-feat-card:nth-child(6).revealed { transition-delay: .2s; }

    @media (prefers-reduced-motion: reduce) {
      .nc-anim, .nc-anim-stagger { transition: none; }
      .nc-vc-approve, .nc-vc-ai  { animation: none; }
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(public ts: TranslationService) {}

  ngAfterViewInit() {
    // Déclenche .revealed quand les éléments entrent dans le viewport
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.nc-anim, .nc-anim-stagger').forEach(el => {
      this.observer.observe(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
