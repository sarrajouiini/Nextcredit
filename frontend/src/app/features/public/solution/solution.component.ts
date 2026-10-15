import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="ns-hero">
      <div class="ns-container">
        <span class="ns-badge">{{ ts.isEn() ? 'Our Solutions' : 'Nos Solutions' }}</span>
        <h1>{{ ts.isEn() ? 'Solutions tailored to' : 'Des solutions adaptées à' }}<br/><span class="ns-accent">{{ ts.isEn() ? 'every credit challenge' : 'chaque défi du crédit' }}</span></h1>
        <p>{{ ts.isEn() ? 'Four complementary solutions to cover the entire credit lifecycle, from origination to behavioral monitoring.' : 'Quatre solutions complémentaires pour couvrir l’intégralité du cycle de vie du crédit, de l’octroi au suivi comportemental.' }}</p>
        <div class="ns-hero-nav">
          <a href="#octroi" class="ns-tab">
            <i class="bi bi-bank"></i> {{ ts.isEn() ? 'Origination' : 'Octroi' }}
          </a>
          <a href="#comportemental" class="ns-tab">
            <i class="bi bi-graph-up-arrow"></i> {{ ts.isEn() ? 'Behavioral' : 'Comportemental' }}
          </a>
          <a href="#assistant-ia" class="ns-tab">
            <i class="bi bi-robot"></i> {{ ts.isEn() ? 'AI Assistant' : 'Assistant IA' }}
          </a>
          <a href="#dashboarding" class="ns-tab">
            <i class="bi bi-bar-chart-line"></i> Dashboarding
          </a>
        </div>
      </div>
    </section>

    <!-- OCTROI -->
    <section class="ns-section" id="octroi">
      <div class="ns-container">
        <div class="ns-sol-layout">
          <div class="ns-sol-text">
            <div class="ns-sol-badge ns-blue">
              <i class="bi bi-bank"></i> {{ ts.isEn() ? 'Origination Solution' : 'Solution Octroi' }}
            </div>
            <h2>{{ ts.isEn() ? 'Faster, more precise origination decisions' : 'Décisions d’octroi plus rapides, plus précises' }}</h2>
            <p>{{ ts.isEn() ? 'NextCredit’s Origination solution automates and optimizes the entire credit attribution process, from file reception to final decision, using the latest generation of AI models.' : 'La solution Octroi de NextCredit automatise et optimise l’ensemble du processus d’attribution de crédit, de la réception du dossier à la décision finale, en s’appuyant sur des modèles IA de dernière génération.' }}</p>
            <div class="ns-capabilities">
              <h4>{{ ts.isEn() ? 'Key capabilities' : 'Capacités clés' }}</h4>
              <div class="ns-cap-grid">
                <div class="ns-cap">
                  <i class="bi bi-speedometer2" style="color:#1E6FD9"></i>
                  <span>{{ ts.isEn() ? 'Real-time score < 3 seconds' : 'Score temps réel < 3 secondes' }}</span>
                </div>
                <div class="ns-cap">
                  <i class="bi bi-bullseye" style="color:#1E6FD9"></i>
                  <span>{{ ts.isEn() ? 'Accuracy > 98%' : 'Précision > 98%' }}</span>
                </div>
                <div class="ns-cap">
                  <i class="bi bi-shield-check" style="color:#1E6FD9"></i>
                  <span>{{ ts.isEn() ? 'BCT / Basel III compliant' : 'Conforme BCT / Bâle III' }}</span>
                </div>
                <div class="ns-cap">
                  <i class="bi bi-lightbulb" style="color:#1E6FD9"></i>
                  <span>{{ ts.isEn() ? 'SHAP / LIME explainability' : 'Explicabilité SHAP / LIME' }}</span>
                </div>
              </div>
            </div>
            <div class="ns-process">
              <div class="ns-proc-step">
                <div class="ns-proc-num ns-num-blue">1</div>
                <div><b>{{ ts.isEn() ? 'File reception' : 'Réception du dossier' }}</b><br/><small>{{ ts.isEn() ? 'Automated collection of client and credit bureau data' : 'Collecte automatisée des données client et bureau de crédit' }}</small></div>
              </div>
              <div class="ns-proc-step">
                <div class="ns-proc-num ns-num-blue">2</div>
                <div><b>{{ ts.isEn() ? 'AI Scoring' : 'Scoring IA' }}</b><br/><small>{{ ts.isEn() ? 'Score calculation and business rules application' : 'Calcul du score et application des règles métier' }}</small></div>
              </div>
              <div class="ns-proc-step">
                <div class="ns-proc-num ns-num-blue">3</div>
                <div><b>{{ ts.isEn() ? 'Decision & report' : 'Décision & rapport' }}</b><br/><small>{{ ts.isEn() ? 'Explained recommendation transmitted to the credit officer' : 'Recommandation expliquée transmise au chargé de crédit' }}</small></div>
              </div>
            </div>
          </div>
          <div class="ns-sol-visual ns-vis-blue">
            <div class="ns-kpi-card">
              <div class="ns-kpi-row">
                <div class="ns-kpi"><div class="ns-kpi-val" style="color:#1E6FD9">94%</div><div class="ns-kpi-lbl">{{ ts.isEn() ? 'Approval rate' : 'Taux approbation' }}</div></div>
                <div class="ns-kpi"><div class="ns-kpi-val" style="color:#3EC98B">1.2%</div><div class="ns-kpi-lbl">{{ ts.isEn() ? 'Default rate' : 'Taux de défaut' }}</div></div>
                <div class="ns-kpi"><div class="ns-kpi-val" style="color:#f59e0b">2.8s</div><div class="ns-kpi-lbl">{{ ts.isEn() ? 'Avg. time' : 'Temps moyen' }}</div></div>
              </div>
              <div class="ns-bar-chart">
                <div class="ns-bc-bar" style="height:80%;background:#1E6FD9"><span>{{ ts.isEn() ? 'Jan' : 'Jan' }}</span></div>
                <div class="ns-bc-bar" style="height:65%;background:#1E6FD9"><span>{{ ts.isEn() ? 'Feb' : 'Fév' }}</span></div>
                <div class="ns-bc-bar" style="height:90%;background:#1E6FD9"><span>{{ ts.isEn() ? 'Mar' : 'Mar' }}</span></div>
                <div class="ns-bc-bar" style="height:75%;background:#1E6FD9"><span>{{ ts.isEn() ? 'Apr' : 'Avr' }}</span></div>
                <div class="ns-bc-bar" style="height:95%;background:#1E6FD9"><span>{{ ts.isEn() ? 'May' : 'Mai' }}</span></div>
                <div class="ns-bc-bar" style="height:85%;background:#1E6FD9"><span>Jun</span></div>
              </div>
              <div class="ns-kpi-footer">{{ ts.isEn() ? 'Files processed — last 6 months' : 'Dossiers traités — 6 derniers mois' }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COMPORTEMENTAL -->
    <section class="ns-section ns-alt" id="comportemental">
      <div class="ns-container">
        <div class="ns-sol-layout ns-reverse">
          <div class="ns-sol-visual ns-vis-green">
            <div class="ns-kpi-card">
              <div class="ns-risk-dist">
                <div class="ns-rd-label">{{ ts.isEn() ? 'Risk distribution — Active portfolio' : 'Distribution du risque — Portefeuille actif' }}</div>
                <div class="ns-rd-bars">
                  <div class="ns-rd-item">
                    <span class="ns-rd-class">{{ ts.isEn() ? 'A — Low' : 'A — Faible' }}</span>
                    <div class="ns-rd-track"><div class="ns-rd-fill" style="width:48%;background:#3EC98B"></div></div>
                    <span class="ns-rd-pct">48%</span>
                  </div>
                  <div class="ns-rd-item">
                    <span class="ns-rd-class">{{ ts.isEn() ? 'B — Moderate' : 'B — Modéré' }}</span>
                    <div class="ns-rd-track"><div class="ns-rd-fill" style="width:31%;background:#f59e0b"></div></div>
                    <span class="ns-rd-pct">31%</span>
                  </div>
                  <div class="ns-rd-item">
                    <span class="ns-rd-class">{{ ts.isEn() ? 'C — High' : 'C — Élevé' }}</span>
                    <div class="ns-rd-track"><div class="ns-rd-fill" style="width:14%;background:#f97316"></div></div>
                    <span class="ns-rd-pct">14%</span>
                  </div>
                  <div class="ns-rd-item">
                    <span class="ns-rd-class">{{ ts.isEn() ? 'D — Critical' : 'D — Critique' }}</span>
                    <div class="ns-rd-track"><div class="ns-rd-fill" style="width:7%;background:#ef4444"></div></div>
                    <span class="ns-rd-pct">7%</span>
                  </div>
                </div>
              </div>
              <div class="ns-alert-box">
                <i class="bi bi-exclamation-triangle-fill" style="color:#f97316"></i>
                <div>
                  <b>{{ ts.isEn() ? '12 clients on alert' : '12 clients en alerte' }}</b>
                  <small>{{ ts.isEn() ? 'Degradation detected — Action recommended' : 'Dégradation détectée — Action recommandée' }}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="ns-sol-text">
            <div class="ns-sol-badge ns-green">
              <i class="bi bi-graph-up-arrow"></i> {{ ts.isEn() ? 'Behavioral Solution' : 'Solution Comportementale' }}
            </div>
            <h2>{{ ts.isEn() ? 'Anticipate defaults before they happen' : 'Anticipez les défaillances avant qu’elles surviennent' }}</h2>
            <p>{{ ts.isEn() ? 'The behavioral solution continuously analyzes the payment behavior of each active client to detect early warning signals and take preventive measures before any default.' : 'La solution comportementale analyse en continu le comportement de paiement de chaque client actif pour détecter les signaux faibles et prendre des mesures préventives avant toute défaillance.' }}</p>
            <div class="ns-capabilities">
              <h4>{{ ts.isEn() ? 'Key capabilities' : 'Capacités clés' }}</h4>
              <div class="ns-cap-grid">
                <div class="ns-cap">
                  <i class="bi bi-arrow-repeat" style="color:#0a8f60"></i>
                  <span>{{ ts.isEn() ? 'Monthly update' : 'Mise à jour mensuelle' }}</span>
                </div>
                <div class="ns-cap">
                  <i class="bi bi-bell" style="color:#0a8f60"></i>
                  <span>{{ ts.isEn() ? 'Early alerts' : 'Alertes précoces' }}</span>
                </div>
                <div class="ns-cap">
                  <i class="bi bi-pie-chart" style="color:#0a8f60"></i>
                  <span>{{ ts.isEn() ? 'Dynamic segmentation' : 'Segmentation dynamique' }}</span>
                </div>
                <div class="ns-cap">
                  <i class="bi bi-tools" style="color:#0a8f60"></i>
                  <span>{{ ts.isEn() ? 'Restructuring plan' : 'Plan de restructuration' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ASSISTANT IA -->
    <section class="ns-section" id="assistant-ia">
      <div class="ns-container">
        <div class="ns-sol-layout">
          <div class="ns-sol-text">
            <div class="ns-sol-badge ns-purple">
              <i class="bi bi-robot"></i> {{ ts.isEn() ? 'Banking AI Assistant' : 'Assistant IA Bancaire' }}
            </div>
            <h2>{{ ts.isEn() ? 'Conversational AI at the heart of your operations' : 'L’IA conversationnelle au cœur de vos opérations' }}</h2>
            <p>{{ ts.isEn() ? 'The NextCredit AI assistant is an intelligent co-pilot for your teams. It answers agent questions, explains scoring decisions, guides clients through their journey, and automates repetitive tasks.' : 'L’assistant IA NextCredit est un copilote intelligent pour vos équipes. Il répond aux questions des agents, explique les décisions de scoring, guide les clients dans leur parcours et automatise les tâches répétitives.' }}</p>
            <div class="ns-ai-features">
              <div class="ns-ai-feat">
                <div class="ns-ai-ico" style="background:#ede8ff;color:#6c5ce7"><i class="bi bi-translate"></i></div>
                <div><b>{{ ts.isEn() ? 'Multilingual' : 'Multilingue' }}</b><p>{{ ts.isEn() ? 'French, Arabic, English' : 'Français, Arabe, Anglais' }}</p></div>
              </div>
              <div class="ns-ai-feat">
                <div class="ns-ai-ico" style="background:#deeeff;color:#1E6FD9"><i class="bi bi-database-check"></i></div>
                <div><b>{{ ts.isEn() ? 'Based on your data' : 'Basé sur vos données' }}</b><p>{{ ts.isEn() ? 'Contextual responses to the file' : 'Réponses contextuelles au dossier' }}</p></div>
              </div>
              <div class="ns-ai-feat">
                <div class="ns-ai-ico" style="background:#d8f5e9;color:#0a8f60"><i class="bi bi-shield-lock"></i></div>
                <div><b>{{ ts.isEn() ? 'Secure' : 'Sécurisé' }}</b><p>{{ ts.isEn() ? 'Sovereign data, audit trail' : 'Données souveraines, audit trail' }}</p></div>
              </div>
              <div class="ns-ai-feat">
                <div class="ns-ai-ico" style="background:#fff3e0;color:#e65100"><i class="bi bi-lightning-charge"></i></div>
                <div><b>{{ ts.isEn() ? 'Instant response' : 'Réponse instantanée' }}</b><p>{{ ts.isEn() ? 'Less than 1 second latency' : 'Moins de 1 seconde de latence' }}</p></div>
              </div>
            </div>
          </div>
          <div class="ns-sol-visual ns-vis-purple">
            <div class="ns-kpi-card">
              <div class="ns-chat-demo">
                <div class="ns-cd-msg ns-cd-bot">
                  <i class="bi bi-robot"></i>
                  <div class="ns-cd-bubble">{{ ts.isEn() ? 'Hello! I can analyze a file, explain a score, or generate a report. How can I help?' : 'Bonjour ! Je peux analyser un dossier, expliquer un score ou générer un rapport. Comment vous aider ?' }}</div>
                </div>
                <div class="ns-cd-msg ns-cd-user">
                  <div class="ns-cd-bubble">{{ ts.isEn() ? 'Summarize the risk profile of Mr. Ben Ali' : 'Résume le profil de risque de M. Ben Ali' }}</div>
                </div>
                <div class="ns-cd-msg ns-cd-bot">
                  <i class="bi bi-robot"></i>
                  <div class="ns-cd-bubble"><b>{{ ts.isEn() ? 'Mr. Ben Ali — Score: 720/1000 (Class B)' : 'M. Ben Ali — Score : 720/1000 (Classe B)' }}</b><br/>{{ ts.isEn() ? 'Stable income, slight rise in debt ratio. Recommendation: monthly monitoring.' : 'Revenus stables, légère hausse du ratio d’endettement. Recommandation : surveillance mensuelle.' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DASHBOARDING -->
    <section class="ns-section ns-alt" id="dashboarding">
      <div class="ns-container">
        <div class="ns-sol-layout ns-reverse">
          <div class="ns-sol-visual ns-vis-orange">
            <div class="ns-kpi-card">
              <div class="ns-dash-kpis">
                <div class="ns-dk"><div class="ns-dk-val" style="color:#e65100">1 248</div><div class="ns-dk-lbl">{{ ts.isEn() ? 'Active files' : 'Dossiers actifs' }}</div></div>
                <div class="ns-dk"><div class="ns-dk-val" style="color:#3EC98B">97.3%</div><div class="ns-dk-lbl">{{ ts.isEn() ? 'Recovery rate' : 'Taux recouvrement' }}</div></div>
                <div class="ns-dk"><div class="ns-dk-val" style="color:#1E6FD9">23.4M</div><div class="ns-dk-lbl">{{ ts.isEn() ? 'Total outstanding (DT)' : 'Encours total (DT)' }}</div></div>
              </div>
              <div class="ns-spark">
                <div class="ns-spark-label">{{ ts.isEn() ? 'Outstanding evolution — 12 months' : 'Évolution encours — 12 mois' }}</div>
                <svg viewBox="0 0 280 60" width="100%">
                  <polyline points="0,50 25,44 50,38 75,42 100,30 125,26 150,22 175,18 200,15 225,12 250,10 280,6"
                    fill="none" stroke="#e65100" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="ns-sol-text">
            <div class="ns-sol-badge ns-orange">
              <i class="bi bi-bar-chart-line"></i> Dashboarding
            </div>
            <h2>{{ ts.isEn() ? 'Pilot your portfolio with precision' : 'Pilotez votre portefeuille avec précision' }}</h2>
            <p>{{ ts.isEn() ? 'NextCredit’s Dashboarding module offers a 360° view of your credit portfolio with real-time indicators, customizable reports, and multi-format exports.' : 'Le module Dashboarding de NextCredit offre une vue 360° de votre portefeuille de crédit avec des indicateurs en temps réel, des rapports personnalisables et des exports multi-formats.' }}</p>
            <div class="ns-dash-features">
              <div class="ns-df"><i class="bi bi-check-lg" style="color:#e65100"></i><span>{{ ts.isEn() ? 'Executive dashboard with customizable KPIs' : 'Dashboard exécutif avec KPIs personnalisables' }}</span></div>
              <div class="ns-df"><i class="bi bi-check-lg" style="color:#e65100"></i><span>{{ ts.isEn() ? 'Automatic email reports (daily/weekly)' : 'Rapports automatiques par email (quotidien/hebdo)' }}</span></div>
              <div class="ns-df"><i class="bi bi-check-lg" style="color:#e65100"></i><span>{{ ts.isEn() ? 'Native PDF, Excel, Power BI export' : 'Export PDF, Excel, Power BI natif' }}</span></div>
              <div class="ns-df"><i class="bi bi-check-lg" style="color:#e65100"></i><span>{{ ts.isEn() ? 'Views by branch, product, segment, or manager' : 'Vues par agence, produit, segment ou gestionnaire' }}</span></div>
              <div class="ns-df"><i class="bi bi-check-lg" style="color:#e65100"></i><span>{{ ts.isEn() ? 'Configurable threshold-exceeded alerts' : 'Alertes configurables sur dépassement de seuils' }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="ns-cta">
      <div class="ns-container">
        <h2>{{ ts.isEn() ? 'Which solution suits your institution?' : 'Quelle solution convient à votre institution ?' }}</h2>
        <p>{{ ts.isEn() ? 'Our experts help you identify the best combination of solutions tailored to your context.' : 'Nos experts vous aident à identifier la meilleure combinaison de solutions adaptée à votre contexte.' }}</p>
        <a [routerLink]="['/entreprise']" fragment="contact" class="ns-btn-white">
          {{ ts.isEn() ? 'Consult an expert' : 'Consulter un expert' }} <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .ns-hero {
      background: linear-gradient(135deg, #152247, #1a3f7a);
      padding: 100px 0 60px; text-align: center; color: #fff;
    }
    .ns-container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .ns-badge {
      display: inline-block; font-size: 11.5px; font-weight: 700;
      color: #89B4E8; background: rgba(137,180,232,.15);
      border: 1px solid rgba(137,180,232,.3);
      padding: 5px 14px; border-radius: 20px;
      text-transform: uppercase; letter-spacing: .07em; margin-bottom: 16px;
    }
    .ns-hero h1 {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(32px, 4vw, 50px); line-height: 1.15; margin-bottom: 18px;
    }
    .ns-accent { color: #89B4E8; }
    .ns-hero p { font-size: 16px; color: rgba(255,255,255,.72); max-width: 560px; margin: 0 auto 36px; line-height: 1.7; }
    .ns-hero-nav { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .ns-tab {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,.1); color: rgba(255,255,255,.85);
      border: 1px solid rgba(255,255,255,.2);
      padding: 10px 20px; border-radius: 24px;
      font-size: 13.5px; font-weight: 600; text-decoration: none;
      transition: background .2s;
    }
    .ns-tab:hover { background: rgba(255,255,255,.18); color: #fff; }

    .ns-section { padding: 88px 0; }
    .ns-alt { background: #f4f6fb; }

    .ns-sol-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .ns-reverse { direction: rtl; }
    .ns-reverse > * { direction: ltr; }

    .ns-sol-badge {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em;
      padding: 6px 14px; border-radius: 20px; margin-bottom: 16px;
    }
    .ns-blue { background: #deeeff; color: #1E6FD9; }
    .ns-green { background: #d8f5e9; color: #0a8f60; }
    .ns-purple { background: #ede8ff; color: #6c5ce7; }
    .ns-orange { background: #fff3e0; color: #e65100; }

    .ns-sol-text h2 {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: 28px; color: #152247; line-height: 1.25; margin-bottom: 14px;
    }
    .ns-sol-text p { font-size: 14.5px; color: #6b7488; line-height: 1.7; margin-bottom: 24px; }
    .ns-capabilities h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #152247; margin-bottom: 14px; }
    .ns-cap-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .ns-cap {
      background: #f4f6fb; border-radius: 12px; padding: 14px 10px;
      text-align: center; font-size: 12px; color: #152247; font-weight: 500;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .ns-cap i { font-size: 20px; }

    .ns-process { margin-top: 20px; display: flex; flex-direction: column; gap: 14px; }
    .ns-proc-step { display: flex; gap: 14px; align-items: flex-start; }
    .ns-proc-num {
      min-width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; color: #fff; flex-shrink: 0;
    }
    .ns-num-blue { background: #1E6FD9; }
    .ns-proc-step b { display: block; font-size: 14px; color: #152247; margin-bottom: 2px; }
    .ns-proc-step small { font-size: 12.5px; color: #6b7488; }

    .ns-sol-visual { border-radius: 24px; padding: 28px; }
    .ns-vis-blue  { background: linear-gradient(135deg, #deeeff, #f0f7ff); }
    .ns-vis-green { background: linear-gradient(135deg, #d8f5e9, #eafaf3); }
    .ns-vis-purple{ background: linear-gradient(135deg, #ede8ff, #f7f4ff); }
    .ns-vis-orange{ background: linear-gradient(135deg, #fff3e0, #fff9f0); }

    .ns-kpi-card { background: #fff; border-radius: 16px; padding: 22px; box-shadow: 0 8px 32px rgba(21,34,71,.09); }
    .ns-kpi-row { display: flex; justify-content: space-around; margin-bottom: 22px; }
    .ns-kpi-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px; }
    .ns-kpi-lbl { font-size: 11.5px; color: #6b7488; margin-top: 2px; }
    .ns-bar-chart { display: flex; gap: 8px; align-items: flex-end; height: 80px; }
    .ns-bc-bar {
      flex: 1; border-radius: 6px 6px 0 0; opacity: .7;
      display: flex; align-items: flex-end; justify-content: center;
      padding-bottom: 4px;
    }
    .ns-bc-bar span { font-size: 10px; color: #fff; font-weight: 600; }
    .ns-kpi-footer { text-align: center; font-size: 11.5px; color: #9aa1b3; margin-top: 10px; }

    .ns-risk-dist { margin-bottom: 16px; }
    .ns-rd-label { font-size: 12px; color: #6b7488; margin-bottom: 12px; }
    .ns-rd-bars { display: flex; flex-direction: column; gap: 8px; }
    .ns-rd-item { display: flex; align-items: center; gap: 10px; }
    .ns-rd-class { font-size: 12px; color: #152247; min-width: 80px; }
    .ns-rd-track { flex: 1; height: 8px; background: #eaeef6; border-radius: 4px; overflow: hidden; }
    .ns-rd-fill { height: 100%; border-radius: 4px; }
    .ns-rd-pct { font-size: 12px; font-weight: 600; color: #152247; min-width: 32px; text-align: right; }
    .ns-alert-box {
      display: flex; align-items: center; gap: 12px;
      background: #fff8f0; border: 1px solid #fed7aa; border-radius: 10px;
      padding: 12px 14px;
    }
    .ns-alert-box b { display: block; font-size: 13.5px; color: #152247; }
    .ns-alert-box small { font-size: 12px; color: #6b7488; }

    .ns-ai-features { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px; }
    .ns-ai-feat { display: flex; align-items: flex-start; gap: 12px; }
    .ns-ai-ico {
      width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 18px;
    }
    .ns-ai-feat b { display: block; font-size: 13.5px; color: #152247; font-weight: 700; margin-bottom: 2px; }
    .ns-ai-feat p { font-size: 12px; color: #6b7488; margin: 0; }

    .ns-chat-demo { display: flex; flex-direction: column; gap: 12px; }
    .ns-cd-msg { display: flex; align-items: flex-start; gap: 10px; }
    .ns-cd-bot i { font-size: 20px; color: #6c5ce7; margin-top: 2px; flex-shrink: 0; }
    .ns-cd-bubble { padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.6; }
    .ns-cd-bot .ns-cd-bubble { background: #f4f6fb; color: #152247; border-bottom-left-radius: 4px; }
    .ns-cd-user { justify-content: flex-end; }
    .ns-cd-user .ns-cd-bubble { background: #6c5ce7; color: #fff; border-bottom-right-radius: 4px; }

    .ns-dash-kpis { display: flex; justify-content: space-around; margin-bottom: 20px; }
    .ns-dk-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; }
    .ns-dk-lbl { font-size: 11px; color: #6b7488; margin-top: 2px; }
    .ns-spark-label { font-size: 11.5px; color: #6b7488; margin-bottom: 6px; }

    .ns-dash-features { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
    .ns-df { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #152247; }
    .ns-df i { font-size: 16px; }

    .ns-cta {
      background: linear-gradient(135deg, #152247, #1E6FD9);
      padding: 80px 0; text-align: center; color: #fff;
    }
    .ns-cta h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 32px; margin-bottom: 14px; }
    .ns-cta p { font-size: 16px; color: rgba(255,255,255,.75); margin-bottom: 28px; }
    .ns-btn-white {
      display: inline-flex; align-items: center; gap: 10px;
      background: #fff; color: #152247; padding: 14px 28px;
      border-radius: 14px; font-family: 'Syne', sans-serif;
      font-weight: 700; font-size: 14.5px; text-decoration: none;
      transition: transform .15s;
    }
    .ns-btn-white:hover { transform: translateY(-2px); color: #1E6FD9; }

    @media (max-width: 900px) {
      .ns-sol-layout { grid-template-columns: 1fr; }
      .ns-reverse { direction: ltr; }
      .ns-cap-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .ns-ai-features { grid-template-columns: 1fr; }
    }
  `]
})
export class SolutionComponent {
  constructor(public ts: TranslationService) {}
}
