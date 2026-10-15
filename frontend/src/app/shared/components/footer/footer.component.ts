import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  template: `
    <footer class="nc-footer">
      <div class="nc-footer-inner">
        <div class="nc-footer-grid">

          <div class="nc-footer-brand">
            <a routerLink="/" class="nc-f-logo">
              <app-logo [size]="38"></app-logo>
              <span class="nc-f-name">NextCredit</span>
            </a>
            <p class="nc-f-desc">
              Plateforme IA de scoring et gestion du crédit pour les institutions financières africaines. Fondée en 2026, Tunis.
            </p>
            <div class="nc-f-socials">
              <a href="#" class="nc-social" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
              <a href="#" class="nc-social" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="nc-social" aria-label="GitHub"><i class="bi bi-github"></i></a>
            </div>
          </div>

          <div class="nc-footer-col">
            <h4>Produit</h4>
            <ul>
              <li><a routerLink="/produit">Secteurs d'activité</a></li>
              <li><a routerLink="/produit" fragment="scoring">Scoring Octroi</a></li>
              <li><a routerLink="/produit" fragment="comportemental">Scoring Comportemental</a></li>
              <li><a routerLink="/produit" fragment="rapports">Rapports & BI</a></li>
              <li><a routerLink="/produit" fragment="assistant">Assistant IA</a></li>
            </ul>
          </div>

          <div class="nc-footer-col">
            <h4>Solutions</h4>
            <ul>
              <li><a [routerLink]="['/solution']" fragment="octroi">Octroi</a></li>
              <li><a [routerLink]="['/solution']" fragment="comportemental">Comportemental</a></li>
              <li><a [routerLink]="['/solution']" fragment="assistant-ia">Assistant IA Bancaire</a></li>
              <li><a [routerLink]="['/solution']" fragment="dashboarding">Dashboarding</a></li>
              <li><a routerLink="/services-ia">Services IA</a></li>
            </ul>
          </div>

          <div class="nc-footer-col">
            <h4>Entreprise</h4>
            <ul>
              <li><a routerLink="/entreprise">À propos</a></li>
              <li><a routerLink="/article">Blog & Articles</a></li>
              <li><a [routerLink]="['/entreprise']" fragment="localisation">Localisation</a></li>
              <li><a [routerLink]="['/entreprise']" fragment="contact">Nous contacter</a></li>
              <li><a [routerLink]="['/entreprise']" fragment="demo">Réserver une démo</a></li>
            </ul>
            <div class="nc-f-contact">
              <p><i class="bi bi-envelope-fill"></i> contact&#64;nextcredit.tn</p>
              <p><i class="bi bi-telephone-fill"></i> +216 70 000 000</p>
              <p><i class="bi bi-geo-alt-fill"></i> Tunis, Tunisie</p>
            </div>
          </div>

        </div>

        <div class="nc-footer-bar">
          <span>© {{ year }} NextCredit. Tous droits réservés. Projet académique 2026.</span>
          <div class="nc-f-legal">
            <a href="#">Mentions légales</a>
            <a href="#">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .nc-footer { background: #0f1b36; color: rgba(255,255,255,.65); padding: 72px 28px 0; }
    .nc-footer-inner { max-width: 1280px; margin: 0 auto; }
    .nc-footer-grid {
      display: grid; grid-template-columns: 2fr 1fr 1fr 1.4fr; gap: 48px;
      padding-bottom: 56px; border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .nc-f-logo { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 18px; }
    .nc-f-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 17px; color: #fff; }
    .nc-f-desc { font-size: 13.5px; line-height: 1.65; max-width: 300px; margin-bottom: 22px; }
    .nc-f-socials { display: flex; gap: 10px; }
    .nc-social {
      width: 36px; height: 36px; border-radius: 9px;
      background: rgba(255,255,255,.07);
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,.6); font-size: 15px; text-decoration: none;
      transition: background .2s, color .2s;
    }
    .nc-social:hover { background: #1E6FD9; color: #fff; }
    .nc-footer-col h4 {
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13px;
      color: #fff; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 18px;
    }
    .nc-footer-col ul { display: flex; flex-direction: column; gap: 10px; }
    .nc-footer-col ul a { font-size: 13.5px; color: rgba(255,255,255,.6); text-decoration: none; transition: color .18s; }
    .nc-footer-col ul a:hover { color: #fff; }
    .nc-f-contact { margin-top: 22px; display: flex; flex-direction: column; gap: 8px; }
    .nc-f-contact p { font-size: 13px; display: flex; align-items: center; gap: 8px; margin: 0; }
    .nc-f-contact i { color: #1E6FD9; }
    .nc-footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; font-size: 12.5px; }
    .nc-f-legal { display: flex; gap: 20px; }
    .nc-f-legal a { color: rgba(255,255,255,.45); text-decoration: none; transition: color .18s; }
    .nc-f-legal a:hover { color: #fff; }
    @media (max-width: 1024px) { .nc-footer-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 600px) {
      .nc-footer-grid { grid-template-columns: 1fr; }
      .nc-footer-bar { flex-direction: column; gap: 12px; text-align: center; }
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
