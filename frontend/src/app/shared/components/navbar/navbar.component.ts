import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, NgIf, LogoComponent, TranslatePipe],
  template: `
    <header class="nc-nav" [class.scrolled]="scrolled">
      <div class="nc-nav-inner">

        <a routerLink="/" class="nc-logo" (click)="closeMobile()">
          <app-logo [size]="40"></app-logo>
          <span class="nc-logo-name">NextCredit</span>
        </a>

        <nav class="nc-nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
             class="nc-nav-link">{{ 'pub.home' | t }}</a>
          <a routerLink="/produit" routerLinkActive="active" class="nc-nav-link">{{ 'pub.product' | t }}</a>

          <div class="nc-dd-wrap">
            <a routerLink="/solution" class="nc-nav-link" [class.active]="isSolActive">
              {{ 'pub.solutions' | t }} <i class="bi bi-chevron-down nc-chev"></i>
            </a>
            <div class="nc-dd-panel">
              <a [routerLink]="['/solution']" fragment="octroi" class="nc-dd-row">
                <span class="nc-dd-ico nc-ico-blue"><i class="bi bi-bank"></i></span>
                <span class="nc-dd-text">
                  <b>{{ 'pub.sol_octroi' | t }}</b><small>{{ 'pub.sol_octroi_sub' | t }}</small>
                </span>
              </a>
              <a [routerLink]="['/solution']" fragment="comportemental" class="nc-dd-row">
                <span class="nc-dd-ico nc-ico-green"><i class="bi bi-graph-up-arrow"></i></span>
                <span class="nc-dd-text">
                  <b>{{ 'pub.sol_comport' | t }}</b><small>{{ 'pub.sol_comport_sub' | t }}</small>
                </span>
              </a>
              <a [routerLink]="['/solution']" fragment="assistant-ia" class="nc-dd-row">
                <span class="nc-dd-ico nc-ico-purple"><i class="bi bi-robot"></i></span>
                <span class="nc-dd-text">
                  <b>{{ 'pub.sol_assistant' | t }}</b><small>{{ 'pub.sol_assistant_sub' | t }}</small>
                </span>
              </a>
              <a [routerLink]="['/solution']" fragment="dashboarding" class="nc-dd-row">
                <span class="nc-dd-ico nc-ico-orange"><i class="bi bi-bar-chart-line"></i></span>
                <span class="nc-dd-text">
                  <b>{{ 'pub.sol_dash' | t }}</b><small>{{ 'pub.sol_dash_sub' | t }}</small>
                </span>
              </a>
            </div>
          </div>

          <a routerLink="/services-ia" routerLinkActive="active" class="nc-nav-link">{{ 'pub.services' | t }}</a>
          <a routerLink="/tarifs" routerLinkActive="active" class="nc-nav-link">{{ 'pub.pricing' | t }}</a>
          <a routerLink="/article" routerLinkActive="active" class="nc-nav-link">{{ 'pub.articles' | t }}</a>
          <a routerLink="/entreprise" routerLinkActive="active" class="nc-nav-link">{{ 'pub.company' | t }}</a>
        </nav>

        <div class="nc-nav-end">
          <button class="nc-lang-toggle" (click)="ts.toggle()" [title]="ts.isEn() ? 'Passer en français' : 'Switch to English'">
            {{ ts.isEn() ? '🇬🇧 EN' : '🇫🇷 FR' }}
          </button>
          <a routerLink="/connexion" class="nc-agent-btn">
            <i class="bi bi-shield-lock"></i>
            {{ ts.isEn() ? 'Agent Login' : 'Espace Agent' }}
          </a>
          <a [routerLink]="['/entreprise']" fragment="demo" class="nc-cta-btn">
            <i class="bi bi-calendar-check"></i> {{ 'pub.demo' | t }}
          </a>
          <button class="nc-burger" (click)="mobileOpen=!mobileOpen" aria-label="Menu">
            <i class="bi" [class.bi-list]="!mobileOpen" [class.bi-x-lg]="mobileOpen"></i>
          </button>
        </div>
      </div>

      <div class="nc-mobile-menu" *ngIf="mobileOpen">
        <a routerLink="/" class="nc-m-link" (click)="closeMobile()">{{ 'pub.home' | t }}</a>
        <a routerLink="/produit" class="nc-m-link" (click)="closeMobile()">{{ 'pub.product' | t }}</a>
        <div class="nc-m-group">
          <span class="nc-m-label">{{ 'pub.solutions' | t }}</span>
          <a [routerLink]="['/solution']" fragment="octroi" class="nc-m-sub" (click)="closeMobile()">{{ 'pub.sol_octroi' | t }}</a>
          <a [routerLink]="['/solution']" fragment="comportemental" class="nc-m-sub" (click)="closeMobile()">{{ 'pub.sol_comport' | t }}</a>
          <a [routerLink]="['/solution']" fragment="assistant-ia" class="nc-m-sub" (click)="closeMobile()">{{ 'pub.sol_assistant' | t }}</a>
          <a [routerLink]="['/solution']" fragment="dashboarding" class="nc-m-sub" (click)="closeMobile()">{{ 'pub.sol_dash' | t }}</a>
        </div>
        <a routerLink="/services-ia" class="nc-m-link" (click)="closeMobile()">{{ 'pub.services' | t }}</a>
        <a routerLink="/tarifs" class="nc-m-link" (click)="closeMobile()">{{ 'pub.pricing' | t }}</a>
        <a routerLink="/article" class="nc-m-link" (click)="closeMobile()">{{ 'pub.articles' | t }}</a>
        <a routerLink="/entreprise" class="nc-m-link" (click)="closeMobile()">{{ 'pub.company' | t }}</a>
        <a routerLink="/connexion" class="nc-m-agent" (click)="closeMobile()">
          <i class="bi bi-shield-lock"></i>
          {{ ts.isEn() ? 'Agent Login' : 'Espace Agent' }}
        </a>
        <a [routerLink]="['/entreprise']" fragment="demo" class="nc-m-cta" (click)="closeMobile()">
          <i class="bi bi-calendar-check"></i> {{ 'pub.demo' | t }}
        </a>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }

    .nc-nav {
      position: sticky; top: 0; z-index: 1000;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid #e8edf6;
      transition: box-shadow .3s;
    }
    .nc-nav.scrolled { box-shadow: 0 4px 28px rgba(21,34,71,.08); }

    .nc-nav-inner {
      max-width: 1280px; margin: 0 auto;
      height: 72px; display: flex; align-items: center;
      padding: 0 28px; gap: 6px;
    }

    .nc-logo {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none; flex-shrink: 0; margin-right: 20px;
    }
    .nc-logo-name {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 18px; color: #152247;
      letter-spacing: -.3px;
    }

    .nc-nav-links { display: flex; align-items: center; gap: 2px; flex: 1; }

    .nc-nav-link {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 8px 12px; border-radius: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 13.5px; font-weight: 500; color: #6b7488;
      text-decoration: none; transition: color .18s, background .18s;
      white-space: nowrap; cursor: pointer;
    }
    .nc-nav-link:hover { color: #152247; background: #f0f4ff; }
    .nc-nav-link.active { color: #1E6FD9; font-weight: 600; }
    .nc-chev { font-size: 10px; transition: transform .25s; }
    .nc-dd-wrap:hover .nc-chev { transform: rotate(180deg); }

    .nc-dd-wrap { position: relative; }
    .nc-dd-panel {
      position: absolute; top: calc(100% + 10px); left: -8px;
      background: #fff; border: 1px solid #e8edf6; border-radius: 18px;
      padding: 8px; min-width: 300px;
      box-shadow: 0 24px 60px rgba(21,34,71,.13);
      opacity: 0; visibility: hidden; transform: translateY(-10px);
      transition: opacity .22s ease, transform .22s cubic-bezier(.16,1,.3,1), visibility .22s;
      pointer-events: none;
    }
    .nc-dd-wrap:hover .nc-dd-panel { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }

    .nc-dd-row {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 12px; text-decoration: none;
      transition: background .15s;
    }
    .nc-dd-row:hover { background: #f0f4ff; }
    .nc-dd-ico {
      width: 40px; height: 40px; border-radius: 11px;
      display: flex; align-items: center; justify-content: center;
      font-size: 17px; flex-shrink: 0;
    }
    .nc-ico-blue   { background: #deeeff; color: #1E6FD9; }
    .nc-ico-green  { background: #d8f5e9; color: #0a8f60; }
    .nc-ico-purple { background: #ede8ff; color: #6c5ce7; }
    .nc-ico-orange { background: #fff3e0; color: #e65100; }
    .nc-dd-text b     { display: block; font-size: 13.5px; font-weight: 600; color: #152247; }
    .nc-dd-text small { display: block; font-size: 11.5px; color: #6b7488; margin-top: 1px; }

    .nc-nav-end { display: flex; align-items: center; gap: 10px; margin-left: auto; }
    .nc-cta-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: #1E6FD9; color: #fff !important;
      padding: 10px 18px; border-radius: 26px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; text-decoration: none;
      white-space: nowrap; transition: background .2s, transform .15s;
    }
    .nc-cta-btn:hover { background: #1557b0; transform: translateY(-1px); }
    .nc-burger {
      display: none; background: none; border: none; cursor: pointer;
      font-size: 22px; color: #152247; padding: 4px 6px; line-height: 1;
    }

    .nc-mobile-menu {
      background: #fff; border-top: 1px solid #e8edf6;
      padding: 16px 24px 24px; display: flex; flex-direction: column; gap: 4px;
    }
    .nc-m-link {
      display: block; padding: 12px 10px; font-size: 15px; font-weight: 500;
      color: #152247; text-decoration: none; border-radius: 8px; transition: background .15s;
    }
    .nc-m-link:hover { background: #f0f4ff; }
    .nc-m-group { padding: 8px 0; }
    .nc-m-label { display: block; font-size: 11px; font-weight: 700; color: #9aa1b3; text-transform: uppercase; letter-spacing: .06em; padding: 0 10px 6px; }
    .nc-m-sub {
      display: block; padding: 10px 10px 10px 20px; font-size: 14px; color: #6b7488;
      text-decoration: none; border-radius: 8px; transition: background .15s;
    }
    .nc-m-sub:hover { background: #f0f4ff; color: #152247; }
    .nc-m-agent {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-top: 8px; background: #fff; color: #152247;
      border: 1.5px solid #152247;
      padding: 12px; border-radius: 12px; font-weight: 700; text-decoration: none;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
    }
    .nc-m-cta {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-top: 8px; background: #1E6FD9; color: #fff;
      padding: 13px; border-radius: 12px; font-weight: 700; text-decoration: none;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .nc-lang-toggle {
      background: none; border: 1.5px solid #e8edf6; border-radius: 20px;
      padding: 6px 13px; font-size: 13px; font-weight: 700; color: #152247;
      cursor: pointer; transition: border-color .18s, background .18s;
    }
    .nc-lang-toggle:hover { border-color: #1E6FD9; background: #f0f7ff; }

    .nc-agent-btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 9px 16px; border-radius: 22px;
      border: 1.5px solid #152247;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px; font-weight: 700; color: #152247;
      text-decoration: none; white-space: nowrap;
      transition: background .18s, color .18s, border-color .18s;
    }
    .nc-agent-btn:hover { background: #152247; color: #fff; }

    @media (max-width: 1100px) {
      .nc-nav-links { gap: 0; }
      .nc-nav-link { padding: 8px 9px; font-size: 13px; }
    }
    @media (max-width: 960px) {
      .nc-nav-links { display: none; }
      .nc-cta-btn  { display: none; }
      .nc-agent-btn { display: none; }
      .nc-burger   { display: flex; }
      .nc-lang-toggle { display: none; }
    }
  `]
})
export class NavbarComponent {
  scrolled = false;
  mobileOpen = false;

  constructor(private router: Router, public ts: TranslationService) {}

  get isSolActive() { return this.router.url.startsWith('/solution'); }

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 30; }

  closeMobile() { this.mobileOpen = false; }
}
