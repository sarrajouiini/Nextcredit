import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-services-ia',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="ni-hero">
      <div class="ni-container">
        <span class="ni-badge">{{ ts.isEn() ? 'AI Services' : 'Services IA' }}</span>
        <h1>{{ ts.isEn() ? 'Artificial Intelligence' : 'L’Intelligence Artificielle' }}<br/><span class="ni-accent">{{ ts.isEn() ? 'powering credit' : 'au service du crédit' }}</span></h1>
        <p>{{ ts.isEn() ? 'Cutting-edge AI services developed specifically for the challenges of the African financial sector. Machine Learning, NLP, Computer Vision and more.' : 'Des services IA de pointe développés spécifiquement pour les défis du secteur financier africain. Machine Learning, NLP, Computer Vision et bien plus.' }}</p>
        <div class="ni-hero-chips">
          <span><i class="bi bi-cpu-fill"></i> Machine Learning</span>
          <span><i class="bi bi-chat-dots-fill"></i> NLP / LLM</span>
          <span><i class="bi bi-eye-fill"></i> Computer Vision</span>
          <span><i class="bi bi-arrow-repeat"></i> AutoML</span>
          <span><i class="bi bi-shield-check-fill"></i> {{ ts.isEn() ? 'Explainable AI' : 'IA Explicable' }}</span>
        </div>
      </div>
    </section>

    <!-- Services principaux -->
    <section class="ni-section">
      <div class="ni-container">
        <div class="ni-head">
          <span class="ni-badge-section">{{ ts.isEn() ? 'Our services' : 'Nos services' }}</span>
          <h2>{{ ts.isEn() ? 'Six pillars of our AI expertise' : 'Six piliers de notre expertise IA' }}</h2>
          <p>{{ ts.isEn() ? 'Each service is designed to integrate natively into your banking ecosystem.' : 'Chaque service est conçu pour s’intégrer nativement dans votre écosystème bancaire.' }}</p>
        </div>
        <div class="ni-services-grid">
          <div class="ni-srv-card">
            <div class="ni-srv-ico" style="background:#deeeff;color:#1E6FD9">
              <i class="bi bi-cpu-fill"></i>
            </div>
            <h3>{{ ts.isEn() ? 'Advanced Machine Learning' : 'Machine Learning avancé' }}</h3>
            <p>{{ ts.isEn() ? 'XGBoost, LightGBM, Random Forest models and neural networks trained on millions of financial transactions for maximum precision scoring.' : 'Modèles XGBoost, LightGBM, Random Forest et réseaux de neurones entraînés sur des millions de transactions financières pour un scoring de précision maximale.' }}</p>
            <div class="ni-srv-tags">
              <span>XGBoost</span><span>LightGBM</span><span>Deep Learning</span>
            </div>
          </div>
          <div class="ni-srv-card">
            <div class="ni-srv-ico" style="background:#ede8ff;color:#6c5ce7">
              <i class="bi bi-chat-dots-fill"></i>
            </div>
            <h3>{{ ts.isEn() ? 'Banking NLP & LLM' : 'NLP & LLM bancaire' }}</h3>
            <p>{{ ts.isEn() ? 'Natural language processing for contract analysis, report generation, client chatbot, and information extraction from financial documents.' : 'Traitement automatique du langage naturel pour l’analyse de contrats, la génération de rapports, le chatbot client et l’extraction d’informations de documents financiers.' }}</p>
            <div class="ni-srv-tags">
              <span>LLM</span><span>NER</span><span>Summarization</span>
            </div>
          </div>
          <div class="ni-srv-card">
            <div class="ni-srv-ico" style="background:#d8f5e9;color:#0a8f60">
              <i class="bi bi-lightbulb-fill"></i>
            </div>
            <h3>{{ ts.isEn() ? 'Explainable AI (XAI)' : 'IA Explicable (XAI)' }}</h3>
            <p>{{ ts.isEn() ? 'SHAP, LIME, and Counterfactuals techniques to make every AI decision understandable by agents, credit committees, and regulators.' : 'Techniques SHAP, LIME et Counterfactuals pour rendre chaque décision IA compréhensible par les agents, les comités de crédit et les régulateurs.' }}</p>
            <div class="ni-srv-tags">
              <span>SHAP</span><span>LIME</span><span>{{ ts.isEn() ? 'Compliance' : 'Conformité' }}</span>
            </div>
          </div>
          <div class="ni-srv-card">
            <div class="ni-srv-ico" style="background:#fff3e0;color:#e65100">
              <i class="bi bi-eye-fill"></i>
            </div>
            <h3>Computer Vision & OCR</h3>
            <p>{{ ts.isEn() ? 'Automatic data extraction from documents (ID cards, pay slips, bank statements) with high-precision character recognition.' : 'Extraction automatique de données depuis des documents (CIN, bulletins de paie, relevés bancaires) avec reconnaissance de caractères de haute précision.' }}</p>
            <div class="ni-srv-tags">
              <span>OCR</span><span>Document AI</span><span>e-KYC</span>
            </div>
          </div>
          <div class="ni-srv-card">
            <div class="ni-srv-ico" style="background:#fce7f3;color:#db2777">
              <i class="bi bi-arrow-repeat"></i>
            </div>
            <h3>AutoML & MLOps</h3>
            <p>{{ ts.isEn() ? 'Automated training, evaluation, and model deployment pipeline with production monitoring to maintain optimal performance over time.' : 'Pipeline automatisé d’entraînement, d’évaluation et de déploiement de modèles avec monitoring en production pour maintenir des performances optimales dans le temps.' }}</p>
            <div class="ni-srv-tags">
              <span>AutoML</span><span>MLflow</span><span>Monitoring</span>
            </div>
          </div>
          <div class="ni-srv-card">
            <div class="ni-srv-ico" style="background:#ecfdf5;color:#059669">
              <i class="bi bi-graph-up-arrow"></i>
            </div>
            <h3>{{ ts.isEn() ? 'Fraud Detection' : 'Détection de fraude' }}</h3>
            <p>{{ ts.isEn() ? 'Real-time anomaly algorithms to detect fraudulent behavior in credit applications, transactions, and client identities.' : 'Algorithmes d’anomalie en temps réel pour détecter les comportements frauduleux sur les demandes de crédit, les transactions et les identités clients.' }}</p>
            <div class="ni-srv-tags">
              <span>Anomaly Detection</span><span>Real-time</span><span>AML</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stack technologique -->
    <section class="ni-section ni-tech-section">
      <div class="ni-container">
        <div class="ni-head">
          <span class="ni-badge-section" style="background:#ede8ff;color:#6c5ce7">{{ ts.isEn() ? 'Technology stack' : 'Stack technologique' }}</span>
          <h2>{{ ts.isEn() ? 'The best technologies, integrated in one platform' : 'Les meilleures technologies, intégrées en une plateforme' }}</h2>
        </div>
        <div class="ni-tech-grid">
          <div class="ni-tech-cat">
            <h4><i class="bi bi-layers-fill" style="color:#1E6FD9"></i> {{ ts.isEn() ? 'ML Frameworks' : 'Frameworks ML' }}</h4>
            <div class="ni-tech-items">
              <span>Python / scikit-learn</span>
              <span>TensorFlow / PyTorch</span>
              <span>XGBoost / LightGBM</span>
              <span>Hugging Face</span>
            </div>
          </div>
          <div class="ni-tech-cat">
            <h4><i class="bi bi-cloud-fill" style="color:#0a8f60"></i> Infrastructure</h4>
            <div class="ni-tech-items">
              <span>Kubernetes / Docker</span>
              <span>MLflow / DVC</span>
              <span>FastAPI / REST</span>
              <span>Apache Kafka</span>
            </div>
          </div>
          <div class="ni-tech-cat">
            <h4><i class="bi bi-database-fill" style="color:#e65100"></i> Data</h4>
            <div class="ni-tech-items">
              <span>PostgreSQL / MongoDB</span>
              <span>Apache Spark</span>
              <span>dbt / Airflow</span>
              <span>Elasticsearch</span>
            </div>
          </div>
          <div class="ni-tech-cat">
            <h4><i class="bi bi-shield-fill-check" style="color:#6c5ce7"></i> {{ ts.isEn() ? 'Security' : 'Sécurité' }}</h4>
            <div class="ni-tech-items">
              <span>OAuth 2.0 / JWT</span>
              <span>{{ ts.isEn() ? 'AES-256 encryption' : 'Chiffrement AES-256' }}</span>
              <span>SOC 2 Type II</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment ça marche -->
    <section class="ni-section" style="background:#fff">
      <div class="ni-container">
        <div class="ni-head">
          <span class="ni-badge-section">{{ ts.isEn() ? 'Methodology' : 'Méthodologie' }}</span>
          <h2>{{ ts.isEn() ? 'Our 4-step AI approach' : 'Notre approche IA en 4 étapes' }}</h2>
          <p>{{ ts.isEn() ? 'A rigorous process to guarantee high-performing, robust, and compliant models.' : 'Un processus rigoureux pour garantir des modèles performants, robustes et conformes.' }}</p>
        </div>
        <div class="ni-method-grid">
          <div class="ni-method-card">
            <div class="ni-method-num">01</div>
            <i class="bi bi-database-fill-gear ni-method-ico" style="color:#1E6FD9"></i>
            <h4>{{ ts.isEn() ? 'Data collection & preparation' : 'Collecte & préparation des données' }}</h4>
            <p>{{ ts.isEn() ? 'Audit of available data, cleaning, feature engineering, and building a representative training dataset.' : 'Audit des données disponibles, nettoyage, feature engineering et construction d’un dataset d’entraînement représentatif.' }}</p>
          </div>
          <div class="ni-method-card">
            <div class="ni-method-num">02</div>
            <i class="bi bi-gear-wide-connected ni-method-ico" style="color:#0a8f60"></i>
            <h4>{{ ts.isEn() ? 'Model training & selection' : 'Entraînement & sélection du modèle' }}</h4>
            <p>{{ ts.isEn() ? 'Comparison of multiple algorithms, hyperparameter optimization, and cross-validation on your historical data.' : 'Comparaison de multiples algorithmes, optimisation hyperparamétrique et validation croisée sur vos données historiques.' }}</p>
          </div>
          <div class="ni-method-card">
            <div class="ni-method-num">03</div>
            <i class="bi bi-check-circle-fill ni-method-ico" style="color:#6c5ce7"></i>
            <h4>{{ ts.isEn() ? 'Validation & backtesting' : 'Validation & backtesting' }}</h4>
            <p>{{ ts.isEn() ? 'Robustness tests, bias analysis, and out-of-time backtesting to guarantee production performance.' : 'Tests de robustesse, analyse des biais, backtesting sur données out-of-time pour garantir les performances en production.' }}</p>
          </div>
          <div class="ni-method-card">
            <div class="ni-method-num">04</div>
            <i class="bi bi-activity ni-method-ico" style="color:#e65100"></i>
            <h4>{{ ts.isEn() ? 'Deployment & monitoring' : 'Déploiement & monitoring' }}</h4>
            <p>{{ ts.isEn() ? 'Production deployment via API, continuous monitoring of metrics (PSI, Gini, KS), and automated retraining.' : 'Mise en production via API, monitoring continu des métriques (PSI, Gini, KS) et réentraînement automatisé.' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="ni-cta">
      <div class="ni-container">
        <div class="ni-cta-box">
          <i class="bi bi-robot ni-cta-ico"></i>
          <h2>{{ ts.isEn() ? 'Discover how AI can transform your institution' : 'Découvrez comment l’IA peut transformer votre institution' }}</h2>
          <p>{{ ts.isEn() ? 'Our data scientists guide you from design to deployment.' : 'Nos data scientists vous accompagnent de la conception au déploiement.' }}</p>
          <a [routerLink]="['/entreprise']" fragment="contact" class="ni-btn-white">
            {{ ts.isEn() ? 'Talk to an AI expert' : 'Parler à un expert IA' }} <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .ni-hero {
      background: linear-gradient(135deg, #0d1f4a, #1a3a7a, #2d1b69);
      padding: 100px 0 80px; text-align: center; color: #fff;
    }
    .ni-container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .ni-badge {
      display: inline-block; font-size: 11.5px; font-weight: 700;
      color: #a78bfa; background: rgba(167,139,250,.15);
      border: 1px solid rgba(167,139,250,.3);
      padding: 5px 14px; border-radius: 20px;
      text-transform: uppercase; letter-spacing: .07em; margin-bottom: 16px;
    }
    .ni-hero h1 {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(32px, 4vw, 50px); line-height: 1.15; margin-bottom: 18px;
    }
    .ni-accent { color: #a78bfa; }
    .ni-hero p { font-size: 16px; color: rgba(255,255,255,.72); max-width: 560px; margin: 0 auto 36px; line-height: 1.7; }
    .ni-hero-chips { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
    .ni-hero-chips span {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
      color: rgba(255,255,255,.85); padding: 7px 16px; border-radius: 20px;
      font-size: 13px; font-weight: 500;
    }

    .ni-section { padding: 88px 0; background: #f4f6fb; }
    .ni-head { text-align: center; margin-bottom: 52px; }
    .ni-badge-section {
      display: inline-block; font-size: 11.5px; font-weight: 700;
      color: #1E6FD9; background: #deeeff; padding: 5px 14px;
      border-radius: 20px; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 14px;
    }
    .ni-head h2 {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(26px, 3vw, 36px); color: #152247; margin-bottom: 14px; line-height: 1.2;
    }
    .ni-head p { font-size: 15.5px; color: #6b7488; max-width: 520px; margin: 0 auto; line-height: 1.65; }

    /* Services grid */
    .ni-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
    .ni-srv-card {
      background: #fff; border-radius: 20px; padding: 28px; border: 1px solid #eaeef6;
      transition: transform .25s, box-shadow .25s;
    }
    .ni-srv-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(21,34,71,.09); }
    .ni-srv-ico {
      width: 54px; height: 54px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; margin-bottom: 18px;
    }
    .ni-srv-card h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #152247; margin-bottom: 10px; }
    .ni-srv-card p { font-size: 13.5px; color: #6b7488; line-height: 1.65; margin-bottom: 16px; }
    .ni-srv-tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .ni-srv-tags span {
      background: #f4f6fb; color: #6b7488; font-size: 11.5px;
      padding: 3px 10px; border-radius: 8px; font-weight: 500;
    }

    /* Tech stack */
    .ni-tech-section { background: #fff; }
    .ni-tech-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
    .ni-tech-cat { background: #f4f6fb; border-radius: 18px; padding: 24px; border: 1px solid #eaeef6; }
    .ni-tech-cat h4 {
      display: flex; align-items: center; gap: 8px;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
      color: #152247; margin-bottom: 16px;
    }
    .ni-tech-items { display: flex; flex-direction: column; gap: 8px; }
    .ni-tech-items span {
      background: #fff; border: 1px solid #eaeef6; border-radius: 8px;
      padding: 7px 12px; font-size: 13px; color: #6b7488;
    }

    /* Method */
    .ni-method-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
    .ni-method-card {
      background: #f4f6fb; border-radius: 20px; padding: 28px; border: 1px solid #eaeef6;
      position: relative;
    }
    .ni-method-num {
      position: absolute; top: 20px; right: 20px;
      font-family: 'Syne', sans-serif; font-weight: 900; font-size: 36px;
      color: rgba(21,34,71,.06); line-height: 1;
    }
    .ni-method-ico { font-size: 28px; display: block; margin-bottom: 14px; }
    .ni-method-card h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #152247; margin-bottom: 8px; }
    .ni-method-card p { font-size: 13px; color: #6b7488; line-height: 1.6; }

    /* CTA */
    .ni-cta { background: #f4f6fb; padding: 72px 0; }
    .ni-cta-box {
      background: linear-gradient(135deg, #2d1b69, #1E6FD9);
      border-radius: 28px; padding: 64px; text-align: center; color: #fff;
    }
    .ni-cta-ico { font-size: 48px; color: rgba(255,255,255,.3); display: block; margin-bottom: 18px; }
    .ni-cta-box h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 30px; margin-bottom: 14px; }
    .ni-cta-box p { font-size: 16px; color: rgba(255,255,255,.75); margin-bottom: 28px; }
    .ni-btn-white {
      display: inline-flex; align-items: center; gap: 10px;
      background: #fff; color: #152247; padding: 14px 28px;
      border-radius: 14px; font-family: 'Syne', sans-serif;
      font-weight: 700; font-size: 14.5px; text-decoration: none;
      transition: transform .15s;
    }
    .ni-btn-white:hover { transform: translateY(-2px); color: #6c5ce7; }

    @media (max-width: 1024px) {
      .ni-tech-grid { grid-template-columns: repeat(2, 1fr); }
      .ni-method-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .ni-services-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .ni-tech-grid { grid-template-columns: 1fr; }
      .ni-method-grid { grid-template-columns: 1fr; }
      .ni-cta-box { padding: 40px 24px; }
    }
  `]
})
export class ServicesIaComponent {
  constructor(public ts: TranslationService) {}
}
