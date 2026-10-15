import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="np-hero">
      <div class="np-container">
        <span class="np-badge">{{ ts.isEn() ? 'Our Product' : 'Notre Produit' }}</span>
        <h1>{{ ts.isEn() ? 'A complete platform for' : 'Une plateforme complète pour' }}<br/><span class="np-accent">{{ ts.isEn() ? 'the entire credit lifecycle' : 'tout le cycle de crédit' }}</span></h1>
        <p>{{ ts.isEn() ? 'From scoring capture to final decision, NextCredit supports every step of the credit origination and monitoring process.' : 'De la capture du scoring à la décision finale, NextCredit accompagne chaque étape du processus d’octroi et de suivi des crédits.' }}</p>
        <a [routerLink]="['/entreprise']" fragment="contact" class="np-btn-primary">
          {{ ts.isEn() ? 'Request a demo' : 'Demander une démo' }} <i class="bi bi-arrow-right"></i>
        </a>
      </div>
      <div class="np-hero-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f4f6fb"/>
        </svg>
      </div>
    </section>

    <!-- Secteurs -->
    <section class="np-section" style="background:#f4f6fb">
      <div class="np-container">
        <div class="np-head">
          <span class="np-badge">{{ ts.isEn() ? 'Target Sectors' : 'Secteurs d’activité visés' }}</span>
          <h2>{{ ts.isEn() ? 'Designed for two pillars of financing' : 'Conçu pour deux piliers du financement' }}</h2>
          <p>{{ ts.isEn() ? 'NextCredit adapts to the business specifics of each sector with dedicated models and workflows.' : 'NextCredit s’adapte aux spécificités métier de chaque secteur avec des modèles et des workflows dédiés.' }}</p>
        </div>
        <div class="np-secteurs-grid">
          <div class="np-secteur-card np-bank">
            <div class="np-sc-ico"><i class="bi bi-bank"></i></div>
            <h3>{{ ts.isEn() ? 'Banking' : 'Banque' }}</h3>
            <p>{{ ts.isEn() ? 'Manage your entire portfolio of personal, professional, and mortgage loans with scoring models tailored to the Tunisian and African banking sector.' : 'Gérez l’ensemble du portefeuille de crédits personnels, professionnels et immobiliers avec des modèles de scoring adaptés au secteur bancaire tunisien et africain.' }}</p>
            <ul class="np-sc-list">
              <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Consumer credit' : 'Crédit à la consommation' }}</li>
              <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Mortgage credit' : 'Crédit immobilier' }}</li>
              <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Business credit & SME' : 'Crédit professionnel & PME' }}</li>
              <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'BCT / Basel III compliance' : 'Conformité BCT / Bâle III' }}</li>
            </ul>
          </div>
          <div class="np-secteur-card np-leasing">
            <div class="np-sc-ico"><i class="bi bi-truck"></i></div>
            <h3>Leasing</h3>
            <p>{{ ts.isEn() ? 'Assess and monitor risk on your movable and real estate leasing contracts with specialized models accounting for the specifics of the rental market.' : 'Évaluez et suivez le risque sur vos contrats de leasing mobilier et immobilier avec des modèles spécialisés tenant compte des spécificités du marché locatif.' }}</p>
            <ul class="np-sc-list">
              <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Movable leasing (vehicles, equipment)' : 'Leasing mobilier (véhicules, équipements)' }}</li>
              <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Real estate leasing' : 'Leasing immobilier' }}</li>
              <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Behavioral monitoring of lessee' : 'Suivi comportemental du locataire' }}</li>
              <li><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'Arrears management' : 'Gestion des impayés' }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment on capture le scoring -->
    <section class="np-section" id="scoring">
      <div class="np-container">
        <div class="np-head">
          <span class="np-badge">{{ ts.isEn() ? 'Technology' : 'Technologie' }}</span>
          <h2>{{ ts.isEn() ? 'How NextCredit captures the scoring' : 'Comment NextCredit capture le scoring' }}</h2>
          <p>{{ ts.isEn() ? 'A 3-step AI pipeline for precise and explainable decisions.' : 'Un pipeline IA en 3 étapes pour des décisions précises et explicables.' }}</p>
        </div>
        <div class="np-steps">
          <div class="np-step">
            <div class="np-step-num">01</div>
            <div class="np-step-body">
              <h4>{{ ts.isEn() ? 'Data collection and enrichment' : 'Collecte et enrichissement des données' }}</h4>
              <p>{{ ts.isEn() ? 'NextCredit aggregates data from the credit bureau, core banking, client forms, and alternative sources (digital behavior, transactions) to build a 360° profile of the applicant.' : 'NextCredit agrège les données du bureau de crédit, du core banking, des formulaires clients et de sources alternatives (comportement digital, transactions) pour construire un profil 360° du demandeur.' }}</p>
            </div>
          </div>
          <div class="np-step-arrow"><i class="bi bi-arrow-down-circle-fill"></i></div>
          <div class="np-step">
            <div class="np-step-num">02</div>
            <div class="np-step-body">
              <h4>{{ ts.isEn() ? 'AI modeling & scoring' : 'Modélisation IA & scoring' }}</h4>
              <p>{{ ts.isEn() ? 'Machine Learning models (XGBoost, LightGBM, neural networks) calculate a real-time risk score, enriched by SHAP/LIME explanations for each contributing variable.' : 'Les modèles de Machine Learning (XGBoost, LightGBM, réseaux de neurones) calculent un score de risque en temps réel, enrichi par des explications SHAP/LIME pour chaque variable contributive.' }}</p>
            </div>
          </div>
          <div class="np-step-arrow"><i class="bi bi-arrow-down-circle-fill"></i></div>
          <div class="np-step">
            <div class="np-step-num">03</div>
            <div class="np-step-body">
              <h4>{{ ts.isEn() ? 'Decision & recommendation' : 'Décision & recommandation' }}</h4>
              <p>{{ ts.isEn() ? 'The rules engine applies the institution’s credit policies, generates a recommendation (Approved / Review / Refused), and produces a detailed analysis report for the credit officer.' : 'Le moteur de règles applique les politiques de crédit de l’institution, génère une recommandation (Approuvé / Révision / Refusé) et produit un rapport d’analyse détaillé pour le chargé de crédit.' }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scoring Octroi -->
    <section class="np-section np-two-col" style="background:#f4f6fb" id="octroi">
      <div class="np-container">
        <div class="np-two-layout">
          <div class="np-two-text">
            <span class="np-badge">{{ ts.isEn() ? 'Origination Scoring' : 'Scoring Octroi' }}</span>
            <h2>{{ ts.isEn() ? 'Assess risk from the very first request' : 'Évaluez le risque dès la demande' }}</h2>
            <p>{{ ts.isEn() ? 'Origination scoring analyzes the complete profile of the applicant at the time of the credit request to predict the probability of default with over 98% accuracy.' : 'Le scoring d’octroi analyse le profil complet du demandeur au moment de la demande de crédit pour prédire la probabilité de défaut avec une précision supérieure à 98 %.' }}</p>
            <div class="np-feature-list">
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#1E6FD9"></i><span>{{ ts.isEn() ? 'Score from 0 to 1000 with risk classes' : 'Score de 0 à 1000 avec classes de risque' }}</span></div>
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#1E6FD9"></i><span>{{ ts.isEn() ? 'Contributing factors explanation (SHAP)' : 'Explication facteurs contributifs (SHAP)' }}</span></div>
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#1E6FD9"></i><span>{{ ts.isEn() ? 'Integrated credit bureau consultation' : 'Consultation bureau de crédit intégrée' }}</span></div>
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#1E6FD9"></i><span>{{ ts.isEn() ? 'Result in under 3 seconds' : 'Résultat en moins de 3 secondes' }}</span></div>
            </div>
          </div>
          <div class="np-two-visual np-vis-blue">
            <div class="np-mock-card">
              <div class="np-mock-header"><i class="bi bi-bank"></i> {{ ts.isEn() ? 'Origination Scoring' : 'Scoring d’octroi' }}</div>
              <div class="np-mock-score">847 <small>/1000</small></div>
              <div class="np-mock-badge np-badge-green">{{ ts.isEn() ? 'Class A — Low risk' : 'Classe A — Faible risque' }}</div>
              <div class="np-mock-bars">
                <div class="np-mb-row"><span>{{ ts.isEn() ? 'Income' : 'Revenus' }}</span><div class="np-mb-track"><div class="np-mb-fill" style="width:85%;background:#1E6FD9"></div></div></div>
                <div class="np-mb-row"><span>{{ ts.isEn() ? 'History' : 'Historique' }}</span><div class="np-mb-track"><div class="np-mb-fill" style="width:92%;background:#1E6FD9"></div></div></div>
                <div class="np-mb-row"><span>{{ ts.isEn() ? 'Liabilities' : 'Charges' }}</span><div class="np-mb-track"><div class="np-mb-fill" style="width:60%;background:#f59e0b"></div></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scoring Comportemental -->
    <section class="np-section np-two-col" id="comportemental">
      <div class="np-container">
        <div class="np-two-layout np-reverse">
          <div class="np-two-visual np-vis-green">
            <div class="np-mock-card">
              <div class="np-mock-header"><i class="bi bi-graph-up-arrow" style="color:#0a8f60"></i> {{ ts.isEn() ? 'Behavioral Scoring' : 'Scoring comportemental' }}</div>
              <div class="np-mock-trend">
                <svg viewBox="0 0 200 80" width="100%">
                  <polyline points="0,70 40,60 80,40 120,35 160,20 200,15"
                    fill="none" stroke="#3EC98B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="0,70 40,60 80,40 120,35 160,20 200,15"
                    fill="url(#gr)" stroke="none" opacity=".15"/>
                  <defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3EC98B"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
                </svg>
                <div class="np-trend-label">{{ ts.isEn() ? 'Behavioral improvement — 6 months' : 'Amélioration du comportement — 6 mois' }}</div>
              </div>
              <div class="np-mock-badges-row">
                <span class="np-mbadge np-mbadge-green"><i class="bi bi-check-circle-fill"></i> {{ ts.isEn() ? 'On-time payments' : 'Paiements à temps' }}</span>
                <span class="np-mbadge np-mbadge-blue"><i class="bi bi-graph-up-arrow"></i> Score +12 pts</span>
              </div>
            </div>
          </div>
          <div class="np-two-text">
            <span class="np-badge" style="background:#d8f5e9;color:#0a8f60">{{ ts.isEn() ? 'Behavioral Scoring' : 'Scoring Comportemental' }}</span>
            <h2>{{ ts.isEn() ? 'Monitor risk throughout the credit lifecycle' : 'Suivez le risque tout au long de la vie du crédit' }}</h2>
            <p>{{ ts.isEn() ? 'Behavioral scoring analyzes the real payment behavior of active clients to detect early signs of financial distress.' : 'Le scoring comportemental analyse le comportement de paiement réel des clients actifs pour détecter précocement les signaux de détresse financière.' }}</p>
            <div class="np-feature-list">
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#0a8f60"></i><span>{{ ts.isEn() ? 'Monthly score updates' : 'Mise à jour mensuelle des scores' }}</span></div>
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#0a8f60"></i><span>{{ ts.isEn() ? 'Automatic alerts on score degradation' : 'Alertes automatiques sur dégradation' }}</span></div>
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#0a8f60"></i><span>{{ ts.isEn() ? 'Dynamic portfolio segmentation' : 'Segmentation dynamique du portefeuille' }}</span></div>
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#0a8f60"></i><span>{{ ts.isEn() ? 'Restructuring recommendations' : 'Recommandations de restructuration' }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rapports & BI -->
    <section class="np-section" style="background:#f4f6fb" id="rapports">
      <div class="np-container">
        <div class="np-head">
          <span class="np-badge" style="background:#fff3e0;color:#e65100">{{ ts.isEn() ? 'Reports & Dashboards' : 'Rapports & Tableaux de bord' }}</span>
          <h2>{{ ts.isEn() ? 'Turn your data into decisions' : 'Transformez vos données en décisions' }}</h2>
          <p>{{ ts.isEn() ? 'Powerful visualizations to pilot your credit portfolio in real time.' : 'Des visualisations puissantes pour piloter votre portefeuille de crédit en temps réel.' }}</p>
        </div>
        <div class="np-rapports-grid">
          <div class="np-rap-card">
            <i class="bi bi-bar-chart-fill" style="color:#e65100"></i>
            <h4>{{ ts.isEn() ? 'Per-module reports' : 'Rapports par module' }}</h4>
            <p>{{ ts.isEn() ? 'Origination, behavioral, collection — each module generates its own detailed reports.' : 'Octroi, comportemental, recouvrement — chaque module génère ses propres rapports détaillés.' }}</p>
          </div>
          <div class="np-rap-card">
            <i class="bi bi-speedometer2" style="color:#1E6FD9"></i>
            <h4>{{ ts.isEn() ? 'Executive dashboard' : 'Tableau de bord exécutif' }}</h4>
            <p>{{ ts.isEn() ? 'Consolidated portfolio view with key KPIs: default rate, approval rate, NPL, etc.' : 'Vue consolidée du portefeuille avec KPIs clés : taux de défaut, taux d’approbation, NPA, etc.' }}</p>
          </div>
          <div class="np-rap-card">
            <i class="bi bi-download" style="color:#0a8f60"></i>
            <h4>{{ ts.isEn() ? 'Multi-format export' : 'Export multi-formats' }}</h4>
            <p>{{ ts.isEn() ? 'Export your reports in PDF, Excel or connect directly to Power BI / Tableau.' : 'Exportez vos rapports en PDF, Excel ou connectez-vous directement à Power BI / Tableau.' }}</p>
          </div>
          <div class="np-rap-card">
            <i class="bi bi-bell-fill" style="color:#6c5ce7"></i>
            <h4>{{ ts.isEn() ? 'Smart alerts' : 'Alertes intelligentes' }}</h4>
            <p>{{ ts.isEn() ? 'Automatic email or SMS notifications whenever a risk threshold is crossed.' : 'Notifications automatiques par email ou SMS dès qu’un seuil de risque est franchi.' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Assistant IA -->
    <section class="np-section" id="assistant">
      <div class="np-container">
        <div class="np-two-layout">
          <div class="np-two-text">
            <span class="np-badge" style="background:#ede8ff;color:#6c5ce7">{{ ts.isEn() ? 'AI Assistant' : 'Assistant IA' }}</span>
            <h2>{{ ts.isEn() ? 'Your intelligent banking co-pilot' : 'Votre copilote bancaire intelligent' }}</h2>
            <p>{{ ts.isEn() ? 'NextCredit’s AI assistant understands natural language in Arabic, French, and English to answer agent and client questions in real time.' : 'L’assistant IA de NextCredit comprend le langage naturel en arabe, français et anglais pour répondre aux questions des agents et des clients en temps réel.' }}</p>
            <div class="np-feature-list">
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#6c5ce7"></i><span>{{ ts.isEn() ? 'Contextual responses based on the client file' : 'Réponses contextuelles basées sur le dossier client' }}</span></div>
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#6c5ce7"></i><span>{{ ts.isEn() ? 'Multilingual support (FR / AR / EN)' : 'Support multilingue (FR / AR / EN)' }}</span></div>
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#6c5ce7"></i><span>{{ ts.isEn() ? 'Integration into the decision workflow' : 'Intégration dans le workflow de décision' }}</span></div>
              <div class="np-fl-item"><i class="bi bi-check-circle-fill" style="color:#6c5ce7"></i><span>{{ ts.isEn() ? 'Conversation history and audit trail' : 'Historique des conversations et audit trail' }}</span></div>
            </div>
          </div>
          <div class="np-two-visual np-vis-purple">
            <div class="np-chat-mock">
              <div class="np-chat-header"><i class="bi bi-robot"></i> Assistant NextCredit</div>
              <div class="np-chat-msg np-bot-msg">{{ ts.isEn() ? 'Hello! How can I help you with this file?' : 'Bonjour ! Comment puis-je vous aider avec ce dossier ?' }}</div>
              <div class="np-chat-msg np-user-msg">{{ ts.isEn() ? 'What is the origination score of client Dupont M.?' : 'Quel est le score d’octroi du client Dupont M. ?' }}</div>
              <div class="np-chat-msg np-bot-msg">
                {{ ts.isEn() ? 'Client' : 'Le client' }} <b>Dupont Mohamed</b> {{ ts.isEn() ? 'has an origination score of' : 'a un score d’octroi de' }} <b>847/1000</b> ({{ ts.isEn() ? 'Class A' : 'Classe A' }}).
                {{ ts.isEn() ? 'The main positive factors are an excellent payment history and a low debt ratio.' : 'Les principaux facteurs positifs sont l’historique de paiement excellent et un ratio d’endettement faible.' }}
              </div>
              <div class="np-chat-input"><span>{{ ts.isEn() ? 'Ask a question...' : 'Poser une question...' }}</span><i class="bi bi-send-fill"></i></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="np-cta">
      <div class="np-container">
        <h2>{{ ts.isEn() ? 'Ready to discover NextCredit in action?' : 'Prêt à découvrir NextCredit en action ?' }}</h2>
        <p>{{ ts.isEn() ? 'Request a personalized demo tailored to your sector.' : 'Demandez une démonstration personnalisée adaptée à votre secteur.' }}</p>
        <a [routerLink]="['/entreprise']" fragment="contact" class="np-btn-white">
          {{ ts.isEn() ? 'Request a demo' : 'Demander une démo' }} <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .np-hero {
      background: linear-gradient(135deg, #152247, #1a3f7a);
      padding: 100px 0 0; text-align: center; color: #fff; position: relative;
    }
    .np-container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .np-badge {
      display: inline-block; font-size: 11.5px; font-weight: 700;
      color: #1E6FD9; background: #deeeff; padding: 5px 14px;
      border-radius: 20px; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 16px;
    }
    .np-hero .np-badge { background: rgba(137,180,232,.15); color: #89B4E8; border: 1px solid rgba(137,180,232,.3); }
    .np-hero h1 {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(32px, 4vw, 50px); line-height: 1.15; margin-bottom: 18px;
    }
    .np-accent { color: #89B4E8; }
    .np-hero p { font-size: 16px; color: rgba(255,255,255,.72); max-width: 560px; margin: 0 auto 32px; line-height: 1.7; }
    .np-btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      background: #1E6FD9; color: #fff; padding: 14px 28px;
      border-radius: 14px; font-family: 'Syne', sans-serif;
      font-weight: 700; font-size: 14.5px; text-decoration: none;
      margin-bottom: 64px; transition: background .2s, transform .15s;
    }
    .np-btn-primary:hover { background: #1557b0; transform: translateY(-2px); color: #fff; }
    .np-hero-wave { line-height: 0; margin-bottom: -1px; }
    .np-hero-wave svg { width: 100%; height: 50px; display: block; }

    .np-section { padding: 88px 0; }
    .np-head { text-align: center; margin-bottom: 52px; }
    .np-head h2 {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(26px, 3vw, 36px); color: #152247; margin-bottom: 14px; line-height: 1.2;
    }
    .np-head p { font-size: 15.5px; color: #6b7488; max-width: 520px; margin: 0 auto; line-height: 1.65; }

    /* Secteurs */
    .np-secteurs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
    .np-secteur-card { background: #fff; border-radius: 24px; padding: 36px; border: 1px solid #eaeef6; }
    .np-sc-ico {
      width: 60px; height: 60px; border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; margin-bottom: 20px;
    }
    .np-bank .np-sc-ico { background: #deeeff; color: #1E6FD9; }
    .np-leasing .np-sc-ico { background: #d8f5e9; color: #0a8f60; }
    .np-secteur-card h3 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: #152247; margin-bottom: 12px; }
    .np-secteur-card p { font-size: 14px; color: #6b7488; line-height: 1.65; margin-bottom: 20px; }
    .np-sc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .np-sc-list li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #152247; }
    .np-bank .np-sc-list i { color: #1E6FD9; }
    .np-leasing .np-sc-list i { color: #0a8f60; }

    /* Steps */
    .np-steps { max-width: 720px; margin: 0 auto; }
    .np-step { display: flex; gap: 24px; align-items: flex-start; }
    .np-step-num {
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 36px;
      color: #1E6FD9; min-width: 60px; opacity: .3; line-height: 1;
    }
    .np-step-body h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; color: #152247; margin-bottom: 8px; }
    .np-step-body p { font-size: 14px; color: #6b7488; line-height: 1.7; }
    .np-step-arrow { text-align: center; font-size: 22px; color: #c4d9f5; margin: 12px 0 12px 17px; }

    /* Two-col */
    .np-two-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
    .np-reverse { direction: rtl; }
    .np-reverse > * { direction: ltr; }
    .np-two-text { display: flex; flex-direction: column; gap: 16px; }
    .np-two-text h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: #152247; line-height: 1.25; }
    .np-two-text p { font-size: 14.5px; color: #6b7488; line-height: 1.7; }
    .np-feature-list { display: flex; flex-direction: column; gap: 10px; }
    .np-fl-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #152247; }

    .np-two-visual { border-radius: 24px; padding: 28px; }
    .np-vis-blue { background: linear-gradient(135deg, #deeeff, #f0f7ff); }
    .np-vis-green { background: linear-gradient(135deg, #d8f5e9, #eafaf3); }
    .np-vis-purple { background: linear-gradient(135deg, #ede8ff, #f7f4ff); }

    .np-mock-card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(21,34,71,.1); }
    .np-mock-header { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13.5px; color: #152247; margin-bottom: 14px; }
    .np-mock-header i { color: #1E6FD9; font-size: 18px; }
    .np-mock-score { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 40px; color: #152247; }
    .np-mock-score small { font-size: 16px; color: #9aa1b3; font-weight: 500; }
    .np-mock-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin: 8px 0 14px; }
    .np-badge-green { background: #d8f5e9; color: #0a8f60; }
    .np-mock-bars { display: flex; flex-direction: column; gap: 10px; }
    .np-mb-row { display: flex; align-items: center; gap: 10px; }
    .np-mb-row span { font-size: 12px; color: #6b7488; min-width: 70px; }
    .np-mb-track { flex: 1; height: 6px; background: #eaeef6; border-radius: 3px; overflow: hidden; }
    .np-mb-fill { height: 100%; border-radius: 3px; }

    .np-mock-trend { margin-bottom: 14px; }
    .np-trend-label { font-size: 11.5px; color: #6b7488; text-align: center; margin-top: 4px; }
    .np-mock-badges-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .np-mbadge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 10px; font-size: 12px; font-weight: 600; }
    .np-mbadge-green { background: #d8f5e9; color: #0a8f60; }
    .np-mbadge-blue { background: #deeeff; color: #1E6FD9; }

    .np-chat-mock { background: #fff; border-radius: 16px; padding: 18px; box-shadow: 0 8px 32px rgba(21,34,71,.1); }
    .np-chat-header { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13.5px; color: #152247; margin-bottom: 14px; border-bottom: 1px solid #eaeef6; padding-bottom: 12px; }
    .np-chat-header i { color: #6c5ce7; font-size: 18px; }
    .np-chat-msg { padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.6; margin-bottom: 8px; max-width: 90%; }
    .np-bot-msg { background: #f4f6fb; color: #152247; border-bottom-left-radius: 4px; }
    .np-user-msg { background: #1E6FD9; color: #fff; margin-left: auto; border-bottom-right-radius: 4px; }
    .np-chat-input { display: flex; align-items: center; justify-content: space-between; border: 1px solid #eaeef6; border-radius: 10px; padding: 10px 14px; margin-top: 10px; }
    .np-chat-input span { font-size: 13px; color: #9aa1b3; }
    .np-chat-input i { color: #1E6FD9; }

    /* Rapports grid */
    .np-rapports-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .np-rap-card { background: #fff; border-radius: 18px; padding: 26px; border: 1px solid #eaeef6; transition: transform .2s; }
    .np-rap-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(21,34,71,.07); }
    .np-rap-card i { font-size: 28px; display: block; margin-bottom: 14px; }
    .np-rap-card h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #152247; margin-bottom: 8px; }
    .np-rap-card p { font-size: 13px; color: #6b7488; line-height: 1.6; }

    /* CTA */
    .np-cta { background: linear-gradient(135deg, #152247, #1E6FD9); padding: 80px 0; text-align: center; color: #fff; }
    .np-cta h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 32px; margin-bottom: 14px; }
    .np-cta p { font-size: 16px; color: rgba(255,255,255,.75); margin-bottom: 28px; }
    .np-btn-white {
      display: inline-flex; align-items: center; gap: 10px;
      background: #fff; color: #152247; padding: 14px 28px;
      border-radius: 14px; font-family: 'Syne', sans-serif;
      font-weight: 700; font-size: 14.5px; text-decoration: none;
      transition: transform .15s;
    }
    .np-btn-white:hover { transform: translateY(-2px); color: #1E6FD9; }

    @media (max-width: 1024px) {
      .np-rapports-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .np-secteurs-grid { grid-template-columns: 1fr; }
      .np-two-layout { grid-template-columns: 1fr; }
      .np-reverse { direction: ltr; }
    }
    @media (max-width: 640px) {
      .np-rapports-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProduitComponent {
  constructor(public ts: TranslationService) {}
}
