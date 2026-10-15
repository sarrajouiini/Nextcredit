import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';

declare const emailjs: any;

/* ── Configuration EmailJS ─────────────────────────────────────────────────
   1. Créez un compte sur https://emailjs.com (gratuit)
   2. Ajoutez un service email (Gmail, Outlook...)
   3. Créez un template avec les variables : {{to_email}}, {{from_name}}, {{demo_date}}, {{institution}}
   4. Remplacez les valeurs ci-dessous par vos propres identifiants
──────────────────────────────────────────────────────────────────────────── */
const EMAILJS_SERVICE_ID  = 'service_fmzwujg';
const EMAILJS_TEMPLATE_ID_DEMO    = 'template_oeh8v7b';
const EMAILJS_TEMPLATE_ID_CONTACT = 'template_nad24of';
const EMAILJS_PUBLIC_KEY  = '6DHikasu4PxHrThV5';

@Component({
  selector: 'app-entreprise',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, NgFor],
  template: `
    <!-- Hero -->
    <section class="ne-hero">
      <div class="ne-ctr">
        <span class="ne-eyebrow">{{ ts.isEn() ? 'Our company' : 'Notre entreprise' }}</span>
        <h1>{{ ts.isEn() ? 'Building the future' : 'Construire l’avenir' }}<br/><span class="ne-accent">{{ ts.isEn() ? 'of credit in Africa' : 'du crédit en Afrique' }}</span></h1>
        <p>{{ ts.isEn() ? 'NextCredit was born from the conviction that every African financial institution deserves world-class AI tools to make better credit decisions.' : 'NextCredit est née de la conviction que chaque institution financière africaine mérite des outils d’IA de classe mondiale pour prendre de meilleures décisions de crédit.' }}</p>
      </div>
    </section>

    <!-- À propos -->
    <section class="ne-section">
      <div class="ne-ctr">
        <div class="ne-about-grid">
          <div class="ne-about-text">
            <span class="ne-badge">{{ ts.isEn() ? 'Our story' : 'Notre histoire' }}</span>
            <h2>{{ ts.isEn() ? 'Born in Tunisia, built for Africa' : 'Née en Tunisie, pensée pour l’Afrique' }}</h2>
            <p *ngIf="!ts.isEn()">Fondée en <strong>2026</strong> par une équipe d’ingénieurs spécialisés en IA et en gestion du risque financier, NextCredit est un projet académique qui ambitionne de démocratiser l’accès aux technologies de scoring IA pour les banques et institutions de microfinance africaines.</p>
            <p *ngIf="ts.isEn()">Founded in <strong>2026</strong> by a team of engineers specialized in AI and financial risk management, NextCredit is an academic project that aims to democratize access to AI scoring technologies for banks and African microfinance institutions.</p>
            <p>{{ ts.isEn() ? 'Our platform is the result of months of applied research, combining Machine Learning expertise, knowledge of the Tunisian banking sector, and a vision of more inclusive credit.' : 'Notre plateforme est le fruit de mois de recherche appliquée, alliant expertise en Machine Learning, connaissance du secteur bancaire tunisien et vision d’un crédit plus inclusif.' }}</p>
            <div class="ne-values">
              <div class="ne-val"><i class="bi bi-stars" style="color:#f59e0b"></i><span><strong>{{ ts.isEn() ? 'Innovation' : 'Innovation' }}</strong> — {{ ts.isEn() ? 'Cutting-edge AI applied to finance' : 'IA de pointe appliquée à la finance' }}</span></div>
              <div class="ne-val"><i class="bi bi-shield-check-fill" style="color:#1E6FD9"></i><span><strong>{{ ts.isEn() ? 'Trust' : 'Confiance' }}</strong> — {{ ts.isEn() ? 'Transparency and explainability of decisions' : 'Transparence et explicabilité des décisions' }}</span></div>
              <div class="ne-val"><i class="bi bi-globe2" style="color:#10b981"></i><span><strong>{{ ts.isEn() ? 'Impact' : 'Impact' }}</strong> — {{ ts.isEn() ? 'Financial inclusion as a social mission' : 'Inclusion financière comme mission sociale' }}</span></div>
            </div>
          </div>
          <div class="ne-stats-grid">
            <div class="ne-stat"><div class="ne-stat-val">2026</div><div class="ne-stat-lbl">{{ ts.isEn() ? 'Year founded' : 'Année de création' }}</div></div>
            <div class="ne-stat"><div class="ne-stat-val">3</div><div class="ne-stat-lbl">{{ ts.isEn() ? 'Founding members' : 'Membres fondateurs' }}</div></div>
            <div class="ne-stat"><div class="ne-stat-val">AI</div><div class="ne-stat-lbl">{{ ts.isEn() ? 'Technology core' : 'Cœur technologique' }}</div></div>
            <div class="ne-stat"><div class="ne-stat-val">🌍</div><div class="ne-stat-lbl">{{ ts.isEn() ? 'Pan-African vision' : 'Vision panafricaine' }}</div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Équipe -->
    <section class="ne-section ne-team-bg">
      <div class="ne-ctr">
        <div class="ne-head">
          <span class="ne-badge">{{ ts.isEn() ? 'Our team' : 'Notre équipe' }}</span>
          <h2>{{ ts.isEn() ? 'The founders of NextCredit' : 'Les fondateurs de NextCredit' }}</h2>
          <p>{{ ts.isEn() ? 'A multidisciplinary team combining AI, product management, and software development.' : 'Une équipe pluridisciplinaire combinant IA, gestion de produit et développement logiciel.' }}</p>
        </div>
        <div class="ne-team-grid">
          <div class="ne-team-card">
            <div class="ne-team-av" style="background:linear-gradient(135deg,#1E6FD9,#6c5ce7)">SJ</div>
            <h4>Sarra Jouini</h4>
            <span class="ne-role">{{ ts.isEn() ? 'Founder & AI Engineer' : 'Fondatrice & Ingénieure IA' }}</span>
            <p>{{ ts.isEn() ? 'AI Engineer, specialized in Machine Learning applied to financial data. Designer of NextCredit’s scoring models.' : 'Ingénieure IA, spécialisée en Machine Learning appliqué aux données financières. Conceptrice des modèles de scoring de NextCredit.' }}</p>
            <div class="ne-team-links">
              <a href="#" class="ne-tl"><i class="bi bi-linkedin"></i></a>
              <a href="#" class="ne-tl"><i class="bi bi-github"></i></a>
            </div>
          </div>
          <div class="ne-team-card">
            <div class="ne-team-av" style="background:linear-gradient(135deg,#0a8f60,#10b981)">KM</div>
            <h4>Khaled Mejbri</h4>
            <span class="ne-role">{{ ts.isEn() ? 'Co-founder & Product Manager' : 'Co-fondateur & Product Manager' }}</span>
            <p>{{ ts.isEn() ? 'Product Manager with 8 years of experience designing B2B financial SaaS products. Guardian of user experience and product roadmap.' : 'Product Manager avec 8 ans d’expérience dans la conception de produits SaaS B2B financiers. Garant de l’expérience utilisateur et de la roadmap produit.' }}</p>
            <div class="ne-team-links">
              <a href="#" class="ne-tl"><i class="bi bi-linkedin"></i></a>
              <a href="#" class="ne-tl"><i class="bi bi-twitter-x"></i></a>
            </div>
          </div>
          <div class="ne-team-card">
            <div class="ne-team-av" style="background:linear-gradient(135deg,#e65100,#f59e0b)">NB</div>
            <h4>Nour Ben Said</h4>
            <span class="ne-role">{{ ts.isEn() ? 'Co-founder & Lead Developer' : 'Co-fondatrice & Lead Developer' }}</span>
            <p>{{ ts.isEn() ? 'Full Stack Engineer specialized in cloud architectures and DevOps. Responsible for platform deployment and scalability.' : 'Ingénieure Full Stack spécialisée en architectures cloud et DevOps. Responsable du déploiement et de la scalabilité de la plateforme.' }}</p>
            <div class="ne-team-links">
              <a href="#" class="ne-tl"><i class="bi bi-linkedin"></i></a>
              <a href="#" class="ne-tl"><i class="bi bi-github"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Localisation -->
    <section class="ne-section" id="localisation">
      <div class="ne-ctr">
        <div class="ne-head">
          <span class="ne-badge">{{ ts.isEn() ? 'Location' : 'Localisation' }}</span>
          <h2>{{ ts.isEn() ? 'Find us' : 'Nous retrouver' }}</h2>
          <p>{{ ts.isEn() ? 'Based in Tunis, we serve all of North and sub-Saharan Africa.' : 'Basés à Tunis, nous rayonnons sur toute l’Afrique du Nord et subsaharienne.' }}</p>
        </div>
        <div class="ne-loc-grid">
          <div class="ne-map-box">
            <div class="ne-map-grid-bg"></div>
            <div class="ne-map-content">
              <div class="ne-map-pulse"><i class="bi bi-geo-alt-fill"></i></div>
              <div class="ne-map-lbl">Les Berges du Lac, Tunis</div>
            </div>
          </div>
          <div class="ne-loc-info">
            <div class="ne-loc-item">
              <div class="ne-loc-ico"><i class="bi bi-geo-alt-fill"></i></div>
              <div>
                <h4>{{ ts.isEn() ? 'Address' : 'Adresse' }}</h4>
                <p>Rue du Lac Biwa, Lotissement EL KHALIJ<br/>Les Berges du Lac<br/>1053 Tunis, {{ ts.isEn() ? 'Tunisia' : 'Tunisie' }}</p>
              </div>
            </div>
            <div class="ne-loc-item">
              <div class="ne-loc-ico"><i class="bi bi-envelope-fill"></i></div>
              <div>
                <h4>Email</h4>
                <p>contact&#64;nextcredit.tn<br/>sarra.jouiini&#64;gmail.com</p>
              </div>
            </div>
            <div class="ne-loc-item">
              <div class="ne-loc-ico"><i class="bi bi-clock-fill"></i></div>
              <div>
                <h4>{{ ts.isEn() ? 'Availability' : 'Disponibilité' }}</h4>
                <p>{{ ts.isEn() ? 'Mon–Fri: 9:00 AM – 6:00 PM' : 'Lun–Ven : 9h00 – 18h00' }}<br/>{{ ts.isEn() ? 'Response within 24 business hours' : 'Réponse sous 24h ouvrées' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CONTACT ── -->
    <section class="ne-section ne-contact-bg" id="contact">
      <div class="ne-ctr">
        <div class="ne-two-col">
          <div class="ne-form-text">
            <span class="ne-badge ne-badge-green">{{ ts.isEn() ? 'Contact us' : 'Nous contacter' }}</span>
            <h2>{{ ts.isEn() ? 'A question? A partnership?' : 'Une question ? Un partenariat ?' }}</h2>
            <p>{{ ts.isEn() ? 'Send us a message for any general question, academic partnership, or suggestion. Our team will reply within 24 hours.' : 'Envoyez-nous un message pour toute question générale, partenariat académique ou suggestion. Notre équipe vous répondra dans les 24 heures.' }}</p>
            <div class="ne-contact-items">
              <div class="ne-ci"><div class="ne-ci-ico" style="background:#d8f5e9;color:#0a8f60"><i class="bi bi-chat-dots-fill"></i></div><div><strong>{{ ts.isEn() ? 'General discussion' : 'Discussion générale' }}</strong><p>{{ ts.isEn() ? 'Questions, suggestions, feedback' : 'Questions, suggestions, retours' }}</p></div></div>
              <div class="ne-ci"><div class="ne-ci-ico" style="background:#deeeff;color:#1E6FD9"><i class="bi bi-building"></i></div><div><strong>{{ ts.isEn() ? 'Partnership' : 'Partenariat' }}</strong><p>{{ ts.isEn() ? 'Academic or institutional collaboration' : 'Collaboration académique ou institutionnelle' }}</p></div></div>
            </div>
          </div>
          <div class="ne-form-card">
            <form (ngSubmit)="sendContact()" *ngIf="!contactSent" class="ne-form">
              <div class="ne-form-row">
                <div class="ne-field"><label>{{ ts.isEn() ? 'First name *' : 'Prénom *' }}</label><input type="text" [placeholder]="ts.isEn() ? 'Your first name' : 'Votre prénom'" [(ngModel)]="contact.prenom" name="prenom" required/></div>
                <div class="ne-field"><label>{{ ts.isEn() ? 'Last name *' : 'Nom *' }}</label><input type="text" [placeholder]="ts.isEn() ? 'Your last name' : 'Votre nom'" [(ngModel)]="contact.nom" name="nom" required/></div>
              </div>
              <div class="ne-field"><label>Email *</label><input type="email" placeholder="vous@exemple.com" [(ngModel)]="contact.email" name="email" required/></div>
              <div class="ne-field"><label>{{ ts.isEn() ? 'Subject' : 'Sujet' }}</label>
                <select [(ngModel)]="contact.sujet" name="sujet">
                  <option value="">{{ ts.isEn() ? 'Select...' : 'Sélectionner...' }}</option>
                  <option>{{ ts.isEn() ? 'General question' : 'Question générale' }}</option>
                  <option>{{ ts.isEn() ? 'Academic partnership' : 'Partenariat académique' }}</option>
                  <option>{{ ts.isEn() ? 'Press & media' : 'Presse & médias' }}</option>
                  <option>{{ ts.isEn() ? 'Product suggestion' : 'Suggestion produit' }}</option>
                  <option>{{ ts.isEn() ? 'Other' : 'Autre' }}</option>
                </select>
              </div>
              <div class="ne-field"><label>{{ ts.isEn() ? 'Message *' : 'Message *' }}</label><textarea rows="4" [placeholder]="ts.isEn() ? 'Your message...' : 'Votre message...'" [(ngModel)]="contact.message" name="message" required></textarea></div>
              <button type="submit" class="ne-submit-btn" [disabled]="contactLoading">
                <span *ngIf="!contactLoading"><i class="bi bi-send-fill"></i> {{ ts.isEn() ? 'Send message' : 'Envoyer le message' }}</span>
                <span *ngIf="contactLoading"><i class="bi bi-hourglass-split"></i> {{ ts.isEn() ? 'Sending...' : 'Envoi en cours...' }}</span>
              </button>
            </form>
            <div class="ne-success" *ngIf="contactSent">
              <i class="bi bi-check-circle-fill"></i>
              <h3>{{ ts.isEn() ? 'Message sent!' : 'Message envoyé !' }}</h3>
              <p>{{ ts.isEn() ? 'Thank you for your message. We will reply within 24 business hours.' : 'Merci pour votre message. Nous vous répondrons dans les 24 heures ouvrées.' }}</p>
              <button class="ne-reset-btn" (click)="contactSent=false">{{ ts.isEn() ? 'Send another message' : 'Envoyer un autre message' }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── DEMO ── -->
    <section class="ne-section ne-demo-bg" id="demo">
      <div class="ne-ctr">
        <div class="ne-two-col">
          <div class="ne-form-text">
            <span class="ne-badge ne-badge-blue">{{ ts.isEn() ? 'Book a demo' : 'Réserver une démo' }}</span>
            <h2>{{ ts.isEn() ? 'See NextCredit in action' : 'Voyez NextCredit en action' }}</h2>
            <p>{{ ts.isEn() ? 'Book a personalized 30-minute demonstration with our team. Select an available date and we will confirm the slot by email.' : 'Réservez une démonstration personnalisée de 30 minutes avec notre équipe. Sélectionnez une date disponible et nous vous confirmerons le créneau par email.' }}</p>
            <div class="ne-demo-avantages">
              <div class="ne-dav"><i class="bi bi-check-circle-fill" style="color:#1E6FD9"></i><span>{{ ts.isEn() ? '100% personalized demo for your sector' : 'Démo 100% personnalisée à votre secteur' }}</span></div>
              <div class="ne-dav"><i class="bi bi-check-circle-fill" style="color:#1E6FD9"></i><span>{{ ts.isEn() ? '30 minutes with a NextCredit expert' : '30 minutes avec un expert NextCredit' }}</span></div>
              <div class="ne-dav"><i class="bi bi-check-circle-fill" style="color:#1E6FD9"></i><span>{{ ts.isEn() ? 'Immediate email confirmation' : 'Confirmation par email immédiate' }}</span></div>
              <div class="ne-dav"><i class="bi bi-check-circle-fill" style="color:#1E6FD9"></i><span>{{ ts.isEn() ? 'No commitment, 100% free' : 'Sans engagement, 100% gratuit' }}</span></div>
            </div>
          </div>
          <div class="ne-form-card ne-demo-card">

            <!-- Étape 1 : Calendrier -->
            <div class="ne-demo-step" *ngIf="!demoSent">
              <div class="ne-cal-header">
                <div class="ne-cal-ico"><i class="bi bi-calendar3"></i></div>
                <div>
                  <div class="ne-cal-title">{{ ts.isEn() ? 'Choose your date' : 'Choisissez votre date' }}</div>
                  <div class="ne-cal-sub">{{ ts.isEn() ? 'Available Monday to Friday' : 'Disponible du lundi au vendredi' }}</div>
                </div>
              </div>
              <input type="date"
                class="ne-date-input"
                [min]="minDate"
                [(ngModel)]="demo.date"
                name="demoDate"
                (change)="onDateSelected()"
              />

              <!-- Champs conditionnels après sélection de date -->
              <div class="ne-demo-fields" [class.visible]="demo.date">
                <div class="ne-demo-date-confirm" *ngIf="demo.date">
                  <i class="bi bi-calendar-check-fill"></i>
                  {{ ts.isEn() ? 'Demo scheduled on' : 'Démo prévue le' }} <strong>{{ formatDate(demo.date) }}</strong>
                </div>

                <div class="ne-time-slots" *ngIf="demo.date">
                  <div class="ne-slot-label">{{ ts.isEn() ? 'Time slot' : 'Créneau horaire' }}</div>
                  <div class="ne-slots">
                    <button *ngFor="let slot of timeSlots" type="button"
                      class="ne-slot" [class.selected]="demo.heure === slot"
                      (click)="demo.heure = slot">{{ slot }}</button>
                  </div>
                </div>

                <form (ngSubmit)="sendDemo()" class="ne-form" *ngIf="demo.date">
                  <div class="ne-form-row">
                    <div class="ne-field"><label>{{ ts.isEn() ? 'First name *' : 'Prénom *' }}</label><input type="text" [placeholder]="ts.isEn() ? 'First name' : 'Prénom'" [(ngModel)]="demo.prenom" name="dPrenom" required/></div>
                    <div class="ne-field"><label>{{ ts.isEn() ? 'Last name *' : 'Nom *' }}</label><input type="text" [placeholder]="ts.isEn() ? 'Last name' : 'Nom'" [(ngModel)]="demo.nom" name="dNom" required/></div>
                  </div>
                  <div class="ne-field"><label>{{ ts.isEn() ? 'Professional email *' : 'Email professionnel *' }}</label><input type="email" placeholder="vous@institution.tn" [(ngModel)]="demo.email" name="dEmail" required/></div>
                  <div class="ne-field"><label>{{ ts.isEn() ? 'Institution / Company *' : 'Institution / Entreprise *' }}</label><input type="text" [placeholder]="ts.isEn() ? 'Name of your institution' : 'Nom de votre institution'" [(ngModel)]="demo.institution" name="dInstitution" required/></div>
                  <div class="ne-field"><label>{{ ts.isEn() ? 'Position' : 'Poste' }}</label><input type="text" [placeholder]="ts.isEn() ? 'Credit Director, Data Scientist...' : 'Directeur crédit, Data scientist...'" [(ngModel)]="demo.poste" name="dPoste"/></div>
                  <div class="ne-field"><label>{{ ts.isEn() ? 'Sector' : 'Secteur d’activité' }}</label>
                    <select [(ngModel)]="demo.secteur" name="dSecteur">
                      <option value="">{{ ts.isEn() ? 'Select...' : 'Sélectionner...' }}</option>
                      <option>{{ ts.isEn() ? 'Commercial bank' : 'Banque commerciale' }}</option>
                      <option>{{ ts.isEn() ? 'Leasing company' : 'Société de leasing' }}</option>
                      <option>{{ ts.isEn() ? 'Microfinance' : 'Microfinance' }}</option>
                      <option>Fintech</option>
                      <option>{{ ts.isEn() ? 'Insurance' : 'Assurance' }}</option>
                      <option>{{ ts.isEn() ? 'Other' : 'Autre' }}</option>
                    </select>
                  </div>
                  <button type="submit" class="ne-submit-btn ne-submit-blue" [disabled]="demoLoading || !demo.heure">
                    <span *ngIf="!demoLoading"><i class="bi bi-calendar-check"></i> {{ ts.isEn() ? 'Confirm booking' : 'Confirmer la réservation' }}</span>
                    <span *ngIf="demoLoading"><i class="bi bi-hourglass-split"></i> {{ ts.isEn() ? 'Sending...' : 'Envoi en cours...' }}</span>
                  </button>
                  <p class="ne-slot-required" *ngIf="!demo.heure && demo.date">⚠ {{ ts.isEn() ? 'Please select a time slot' : 'Veuillez sélectionner un créneau horaire' }}</p>
                </form>
              </div>
            </div>

            <!-- Succès -->
            <div class="ne-success ne-demo-success" *ngIf="demoSent">
              <div class="ne-success-check"><i class="bi bi-check-lg"></i></div>
              <h3>{{ ts.isEn() ? 'Booking sent!' : 'Réservation envoyée !' }}</h3>
              <div class="ne-demo-recap">
                <div class="ne-recap-item"><i class="bi bi-calendar-fill"></i> {{ formatDate(demo.date) }} {{ ts.isEn() ? 'at' : 'à' }} {{ demo.heure }}</div>
                <div class="ne-recap-item"><i class="bi bi-envelope-fill"></i> {{ ts.isEn() ? 'Confirmation sent to' : 'Confirmation envoyée à' }} {{ demo.email }}</div>
              </div>
              <p *ngIf="!ts.isEn()">Notre équipe vous contactera dans les <strong>24h</strong> pour confirmer votre créneau. En attendant, n’hésitez pas à explorer notre produit.</p>
              <p *ngIf="ts.isEn()">Our team will contact you within <strong>24h</strong> to confirm your slot. In the meantime, feel free to explore our product.</p>
              <a routerLink="/produit" class="ne-reset-btn ne-btn-blue">{{ ts.isEn() ? 'Discover the product' : 'Découvrir le produit' }} <i class="bi bi-arrow-right"></i></a>
            </div>

          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .ne-hero { background: linear-gradient(135deg, #152247, #1a3f7a); padding: 100px 0 80px; text-align: center; color: #fff; }
    .ne-ctr { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .ne-eyebrow { display: inline-block; font-size: 11.5px; font-weight: 700; color: #89B4E8; background: rgba(137,180,232,.15); border: 1px solid rgba(137,180,232,.3); padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 16px; }
    .ne-hero h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: clamp(32px,4vw,50px); line-height: 1.15; margin-bottom: 18px; }
    .ne-accent { color: #89B4E8; }
    .ne-hero p { font-size: 16px; color: rgba(255,255,255,.72); max-width: 560px; margin: 0 auto; line-height: 1.7; }

    .ne-section { padding: 88px 0; }
    .ne-team-bg { background: #f8faff; }
    .ne-contact-bg { background: #fff; }
    .ne-demo-bg { background: linear-gradient(135deg, #f8faff, #eef4ff); }

    .ne-badge { display: inline-block; font-size: 11.5px; font-weight: 700; color: #1E6FD9; background: #deeeff; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 14px; }
    .ne-badge-green { background: #d8f5e9; color: #0a8f60; }
    .ne-badge-blue  { background: #deeeff; color: #1E6FD9; }
    .ne-head { text-align: center; margin-bottom: 52px; }
    .ne-head h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: clamp(26px,3vw,36px); color: #152247; margin-bottom: 14px; }
    .ne-head p { font-size: 15.5px; color: #6b7488; max-width: 520px; margin: 0 auto; line-height: 1.65; }

    /* About */
    .ne-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
    .ne-about-text { display: flex; flex-direction: column; gap: 14px; }
    .ne-about-text h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 28px; color: #152247; line-height: 1.25; }
    .ne-about-text p { font-size: 14.5px; color: #6b7488; line-height: 1.7; }
    .ne-values { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
    .ne-val { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #152247; }
    .ne-val i { font-size: 18px; }
    .ne-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .ne-stat { background: #f8faff; border: 1px solid #e8edf6; border-radius: 20px; padding: 28px; text-align: center; }
    .ne-stat-val { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 32px; color: #1E6FD9; margin-bottom: 6px; }
    .ne-stat-lbl { font-size: 13px; color: #6b7488; }

    /* Team */
    .ne-team-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
    .ne-team-card { background: #fff; border-radius: 22px; padding: 32px 24px; text-align: center; border: 1px solid #e8edf6; transition: transform .25s, box-shadow .25s; }
    .ne-team-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(21,34,71,.09); }
    .ne-team-av { width: 68px; height: 68px; border-radius: 50%; margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #fff; }
    .ne-team-card h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 17px; color: #152247; margin-bottom: 4px; }
    .ne-role { font-size: 12px; color: #1E6FD9; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
    .ne-team-card p { font-size: 13.5px; color: #6b7488; line-height: 1.65; margin: 14px 0; }
    .ne-team-links { display: flex; gap: 8px; justify-content: center; }
    .ne-tl { width: 34px; height: 34px; border-radius: 9px; background: #f0f4ff; color: #6b7488; display: flex; align-items: center; justify-content: center; font-size: 14px; text-decoration: none; transition: background .18s, color .18s; }
    .ne-tl:hover { background: #1E6FD9; color: #fff; }

    /* Location */
    .ne-loc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
    .ne-map-box { height: 380px; border-radius: 24px; background: linear-gradient(135deg, #deeeff, #e8f1fb); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .ne-map-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(30,111,217,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,111,217,.08) 1px, transparent 1px); background-size: 40px 40px; }
    .ne-map-content { position: relative; text-align: center; }
    .ne-map-pulse { font-size: 48px; color: #1E6FD9; display: block; animation: pulse 2s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:.8} }
    .ne-map-lbl { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 18px; color: #152247; margin-top: 8px; }
    .ne-loc-info { display: flex; flex-direction: column; gap: 28px; }
    .ne-loc-item { display: flex; gap: 16px; align-items: flex-start; }
    .ne-loc-ico { width: 44px; height: 44px; border-radius: 12px; background: #deeeff; color: #1E6FD9; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .ne-loc-item h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 15px; color: #152247; margin-bottom: 4px; }
    .ne-loc-item p { font-size: 14px; color: #6b7488; line-height: 1.6; margin: 0; }

    /* Two col layout shared */
    .ne-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
    .ne-form-text { display: flex; flex-direction: column; gap: 16px; }
    .ne-form-text h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 28px; color: #152247; line-height: 1.25; }
    .ne-form-text p { font-size: 14.5px; color: #6b7488; line-height: 1.7; }
    .ne-contact-items { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
    .ne-ci { display: flex; gap: 14px; align-items: flex-start; }
    .ne-ci-ico { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .ne-ci strong { display: block; font-size: 14px; color: #152247; margin-bottom: 2px; }
    .ne-ci p { font-size: 13px; color: #6b7488; margin: 0; }

    .ne-demo-avantages { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
    .ne-dav { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #152247; }

    /* Form card */
    .ne-form-card { background: #fff; border-radius: 24px; padding: 36px; border: 1px solid #e8edf6; box-shadow: 0 8px 32px rgba(21,34,71,.06); }
    .ne-demo-card { background: #fff; }
    .ne-form { display: flex; flex-direction: column; gap: 14px; }
    .ne-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .ne-field { display: flex; flex-direction: column; gap: 5px; }
    .ne-field label { font-size: 12.5px; font-weight: 600; color: #152247; }
    .ne-field input, .ne-field select, .ne-field textarea {
      border: 1.5px solid #e8edf6; border-radius: 12px; padding: 11px 14px;
      font-size: 14px; color: #152247; outline: none;
      transition: border-color .18s, box-shadow .18s; background: #f8faff;
      font-family: 'Inter', sans-serif; resize: vertical;
    }
    .ne-field input:focus, .ne-field select:focus, .ne-field textarea:focus {
      border-color: #1E6FD9; background: #fff; box-shadow: 0 0 0 3px rgba(30,111,217,.1);
    }

    .ne-submit-btn {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      background: #152247; color: #fff; padding: 13px 28px;
      border-radius: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700; font-size: 14.5px; border: none; cursor: pointer;
      transition: background .2s, transform .15s; margin-top: 6px;
    }
    .ne-submit-btn:hover:not(:disabled) { background: #1E3060; transform: translateY(-1px); }
    .ne-submit-btn:disabled { opacity: .6; cursor: not-allowed; }
    .ne-submit-blue { background: #1E6FD9; }
    .ne-submit-blue:hover:not(:disabled) { background: #1557b0; }

    /* Calendar demo */
    .ne-cal-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
    .ne-cal-ico { width: 48px; height: 48px; border-radius: 14px; background: #deeeff; color: #1E6FD9; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
    .ne-cal-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 16px; color: #152247; }
    .ne-cal-sub { font-size: 12.5px; color: #6b7488; margin-top: 2px; }
    .ne-date-input {
      width: 100%; padding: 14px; border: 1.5px solid #e8edf6; border-radius: 14px;
      font-size: 15px; color: #152247; background: #f8faff; outline: none;
      font-family: 'Inter', sans-serif; cursor: pointer; transition: border-color .18s;
    }
    .ne-date-input:focus { border-color: #1E6FD9; background: #fff; box-shadow: 0 0 0 3px rgba(30,111,217,.1); }

    .ne-demo-fields { overflow: hidden; max-height: 0; opacity: 0; transition: max-height .5s ease, opacity .4s ease; }
    .ne-demo-fields.visible { max-height: 1200px; opacity: 1; margin-top: 20px; }

    .ne-demo-date-confirm {
      display: flex; align-items: center; gap: 10px;
      background: #d8f5e9; color: #0a8f60; padding: 12px 16px;
      border-radius: 12px; font-size: 14px; font-weight: 600; margin-bottom: 16px;
    }
    .ne-demo-date-confirm i { font-size: 18px; }

    .ne-time-slots { margin-bottom: 16px; }
    .ne-slot-label { font-size: 12.5px; font-weight: 600; color: #152247; margin-bottom: 10px; }
    .ne-slots { display: flex; flex-wrap: wrap; gap: 8px; }
    .ne-slot {
      padding: 8px 16px; border: 1.5px solid #e8edf6; border-radius: 10px;
      font-size: 13.5px; font-weight: 500; color: #6b7488;
      background: #f8faff; cursor: pointer; transition: all .18s;
    }
    .ne-slot:hover { border-color: #1E6FD9; color: #1E6FD9; }
    .ne-slot.selected { background: #1E6FD9; border-color: #1E6FD9; color: #fff; }
    .ne-slot-required { font-size: 12.5px; color: #e65100; margin-top: 8px; text-align: center; }

    /* Success */
    .ne-success { text-align: center; padding: 20px 0; }
    .ne-success-check { width: 72px; height: 72px; border-radius: 50%; background: #d8f5e9; color: #0a8f60; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; }
    .ne-success > i { font-size: 56px; color: #10b981; display: block; margin-bottom: 16px; }
    .ne-success h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 22px; color: #152247; margin-bottom: 10px; }
    .ne-success p { font-size: 14px; color: #6b7488; line-height: 1.7; margin-bottom: 20px; }
    .ne-demo-recap { background: #f8faff; border-radius: 14px; padding: 16px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; }
    .ne-recap-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #152247; font-weight: 600; }
    .ne-recap-item i { color: #1E6FD9; }
    .ne-reset-btn { background: #f8faff; border: 1.5px solid #e8edf6; color: #152247; padding: 11px 22px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 14px; text-decoration: none; display: inline-block; transition: background .18s; }
    .ne-reset-btn:hover { background: #e8edf6; }
    .ne-btn-blue { background: #1E6FD9; border-color: #1E6FD9; color: #fff; display: inline-flex; align-items: center; gap: 8px; }
    .ne-btn-blue:hover { background: #1557b0; }

    @media (max-width: 900px) {
      .ne-about-grid { grid-template-columns: 1fr; }
      .ne-team-grid  { grid-template-columns: 1fr; }
      .ne-loc-grid   { grid-template-columns: 1fr; }
      .ne-two-col    { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .ne-stats-grid { grid-template-columns: 1fr 1fr; }
      .ne-form-row   { grid-template-columns: 1fr; }
    }
  `]
})
export class EntrepriseComponent {
  constructor(public ts: TranslationService) {}

  /* ── Contact ── */
  contact = { prenom: '', nom: '', email: '', sujet: '', message: '' };
  contactSent = false;
  contactLoading = false;

  /* ── Demo ── */
  demo = { date: '', heure: '', prenom: '', nom: '', email: '', institution: '', poste: '', secteur: '' };
  demoSent = false;
  demoLoading = false;

  timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'];

  get minDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  onDateSelected() {
    this.demo.heure = '';
  }

  sendContact() {
    if (!this.contact.prenom || !this.contact.email || !this.contact.message) return;
    this.contactLoading = true;
    this._sendEmail(
      EMAILJS_TEMPLATE_ID_CONTACT,
      {
        to_email:  this.contact.email,
        from_name: `${this.contact.prenom} ${this.contact.nom}`,
        sujet:     this.contact.sujet || 'Question générale',
        message:   this.contact.message,
      }
    ).finally(() => {
      this.contactLoading = false;
      this.contactSent = true;
    });
  }

  sendDemo() {
    if (!this.demo.prenom || !this.demo.email || !this.demo.institution || !this.demo.heure) return;
    this.demoLoading = true;
    this._sendEmail(
      EMAILJS_TEMPLATE_ID_DEMO,
      {
        to_email:    this.demo.email,
        from_name:   `${this.demo.prenom} ${this.demo.nom}`,
        demo_date:   `${this.formatDate(this.demo.date)} à ${this.demo.heure}`,
        institution: this.demo.institution,
        poste:       this.demo.poste || 'Non renseigné',
        secteur:     this.demo.secteur || 'Non renseigné',
      }
    ).finally(() => {
      this.demoLoading = false;
      this.demoSent = true;
    });
  }

  private _sendEmail(templateId: string, params: Record<string, string>): Promise<void> {
    if (typeof emailjs !== 'undefined') {
      return emailjs.send(EMAILJS_SERVICE_ID, templateId, params, EMAILJS_PUBLIC_KEY)
        .catch((err: unknown) => console.warn('EmailJS error:', err));
    }
    /* Mode démo : simule un délai réseau */
    return new Promise(resolve => setTimeout(resolve, 1200));
  }
}
