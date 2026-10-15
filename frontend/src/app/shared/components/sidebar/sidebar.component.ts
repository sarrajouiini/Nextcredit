import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AgentDataService } from '../../../core/services/agent-data.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass, TranslatePipe, LogoComponent],
  template: `
    <aside class="nc-sidebar" [class.collapsed]="collapsed()">

      <!-- Decorative glow blob -->
      <div class="nc-sb-blob" aria-hidden="true"></div>

      <!-- ── Brand ── -->
      <div class="nc-sb-brand">
        <a routerLink="/agent/dashboard" class="nc-sb-logo-wrap">
          <app-logo [size]="32"></app-logo>
          <span class="nc-sb-brand-name" *ngIf="!collapsed()">NextCredit</span>
        </a>
        <button class="nc-sb-collapse-btn" (click)="collapsed.set(!collapsed())" [title]="collapsed() ? 'Développer' : 'Réduire'">
          <i class="bi" [ngClass]="collapsed() ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        </button>
      </div>

      <!-- ── Agent profile card ── -->
      <a routerLink="/agent/profile" routerLinkActive="active-profile" class="nc-sb-profile" *ngIf="!collapsed()" title="Mon profil">
        <div class="nc-sb-profile-ring">
          <div class="nc-sb-avatar-lg">{{ initiales() }}</div>
          <span class="nc-sb-profile-dot"></span>
        </div>
        <div class="nc-sb-profile-name">{{ agent()?.prenom }} {{ agent()?.nom }}</div>
        <div class="nc-sb-profile-role">{{ agent()?.role === 'admin' ? 'Administrateur' : 'Agent bancaire' }}</div>
      </a>
      <a routerLink="/agent/profile" class="nc-sb-profile nc-sb-profile-collapsed" *ngIf="collapsed()" title="Mon profil">
        <div class="nc-sb-profile-ring nc-sb-profile-ring-sm">
          <div class="nc-sb-avatar-lg nc-sb-avatar-sm">{{ initiales() }}</div>
          <span class="nc-sb-profile-dot"></span>
        </div>
      </a>

      <!-- ── Navigation ── -->
      <nav class="nc-sb-nav">

        <!-- Home -->
        <a routerLink="/agent/dashboard" routerLinkActive="active" class="nc-sb-item" data-tour="dashboard" [title]="collapsed() ? t('nav.dashboard') : ''">
          <div class="nc-sb-item-ico"><i class="bi bi-house-door-fill"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.home' | t }}</span>
        </a>

        <!-- Section Dashboards BI -->
        <div class="nc-sb-section" *ngIf="!collapsed()">{{ 'nav.pilotage' | t }}</div>
        <div class="nc-sb-divider" *ngIf="collapsed()"></div>

        <a routerLink="/agent/bi/vue-globale" routerLinkActive="active" class="nc-sb-item" data-tour="bi-vue-globale" [title]="collapsed() ? t('nav.bi_global') : ''">
          <div class="nc-sb-item-ico nc-ico-navy"><i class="bi bi-globe2"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.bi_global' | t }}</span>
        </a>

        <a routerLink="/agent/bi/retard-defaut" routerLinkActive="active" class="nc-sb-item" data-tour="bi-retard-defaut" [title]="collapsed() ? t('nav.bi_retard') : ''">
          <div class="nc-sb-item-ico nc-ico-red"><i class="bi bi-graph-down-arrow"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.bi_retard' | t }}</span>
        </a>

        <a routerLink="/agent/bi/profil-clients" routerLinkActive="active" class="nc-sb-item" data-tour="bi-profil-clients" [title]="collapsed() ? t('nav.bi_profil') : ''">
          <div class="nc-sb-item-ico nc-ico-purple"><i class="bi bi-people-fill"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.bi_profil' | t }}</span>
        </a>

        <a routerLink="/agent/bi/performance-portefeuille" routerLinkActive="active" class="nc-sb-item" data-tour="bi-performance" [title]="collapsed() ? t('nav.bi_perf') : ''">
          <div class="nc-sb-item-ico nc-ico-green"><i class="bi bi-briefcase-fill"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.bi_perf' | t }}</span>
        </a>

        <a routerLink="/agent/bi/evolution-ia" routerLinkActive="active" class="nc-sb-item" data-tour="bi-evolution-ia" [title]="collapsed() ? t('nav.bi_evolution') : ''">
          <div class="nc-sb-item-ico nc-ico-blue"><i class="bi bi-cpu-fill"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.bi_evolution' | t }}</span>
        </a>

        <!-- Section Scoring -->
        <div class="nc-sb-section" *ngIf="!collapsed()">{{ 'nav.scoring' | t }}</div>
        <div class="nc-sb-divider" *ngIf="collapsed()"></div>

        <a routerLink="/agent/octroi" routerLinkActive="active" class="nc-sb-item" data-tour="octroi" [title]="collapsed() ? t('nav.octroi') : ''">
          <div class="nc-sb-item-ico nc-ico-blue"><i class="bi bi-bank"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.octroi' | t }}</span>
        </a>

        <a routerLink="/agent/comportement" routerLinkActive="active" class="nc-sb-item" data-tour="comportement" [title]="collapsed() ? t('nav.comportement') : ''">
          <div class="nc-sb-item-ico nc-ico-green"><i class="bi bi-graph-up-arrow"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.comportement' | t }}</span>
        </a>

        <a routerLink="/agent/dossiers" routerLinkActive="active" class="nc-sb-item" data-tour="dossiers" [title]="collapsed() ? t('nav.dossiers') : ''">
          <div class="nc-sb-item-ico nc-ico-orange"><i class="bi bi-folder2-open"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.dossiers' | t }}</span>
          <span class="nc-sb-badge" *ngIf="pendingCount() > 0 && !collapsed()">{{ pendingCount() }}</span>
          <span class="nc-sb-badge nc-sb-badge-sm" *ngIf="pendingCount() > 0 && collapsed()">{{ pendingCount() }}</span>
        </a>

        <a routerLink="/agent/risque" routerLinkActive="active" class="nc-sb-item" data-tour="risque" [title]="collapsed() ? t('nav.risque') : ''">
          <div class="nc-sb-item-ico nc-ico-red"><i class="bi bi-exclamation-triangle-fill"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.risque' | t }}</span>
          <span class="nc-sb-badge nc-sb-badge-red" *ngIf="riskCount() > 0 && !collapsed()">{{ riskCount() }}</span>
        </a>

        <!-- Section Intelligence IA -->
        <div class="nc-sb-section" *ngIf="!collapsed()">{{ 'nav.intelligence' | t }}</div>
        <div class="nc-sb-divider" *ngIf="collapsed()"></div>

        <a routerLink="/agent/assistant" routerLinkActive="active" class="nc-sb-item" data-tour="assistant" [title]="collapsed() ? t('nav.assistant') : ''">
          <div class="nc-sb-item-ico nc-ico-purple"><i class="bi bi-robot"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.assistant' | t }}</span>
        </a>

        <a routerLink="/agent/monitoring" routerLinkActive="active" class="nc-sb-item" [title]="collapsed() ? t('nav.monitoring') : ''">
          <div class="nc-sb-item-ico nc-ico-purple"><i class="bi bi-activity"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.monitoring' | t }}</span>
        </a>

        <!-- Section Aide -->
        <div class="nc-sb-section" *ngIf="!collapsed()">{{ 'nav.aide' | t }}</div>
        <div class="nc-sb-divider" *ngIf="collapsed()"></div>

        <a routerLink="/agent/guide" routerLinkActive="active" class="nc-sb-item" data-tour="guide" [title]="collapsed() ? t('nav.guide') : ''">
          <div class="nc-sb-item-ico nc-ico-gold"><i class="bi bi-book-fill"></i></div>
          <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.guide' | t }}</span>
        </a>

        <!-- Section Administration (admin only) -->
        <ng-container *ngIf="agent()?.role === 'admin'">
          <div class="nc-sb-section" *ngIf="!collapsed()">{{ 'nav.admin' | t }}</div>
          <div class="nc-sb-divider" *ngIf="collapsed()"></div>

          <a routerLink="/agent/admin/comptes" routerLinkActive="active" class="nc-sb-item" [title]="collapsed() ? t('nav.admin_comptes') : ''">
            <div class="nc-sb-item-ico nc-ico-purple"><i class="bi bi-people-fill"></i></div>
            <span class="nc-sb-item-lbl" *ngIf="!collapsed()">{{ 'nav.admin_comptes' | t }}</span>
          </a>
        </ng-container>

      </nav>

      <!-- ── Decorative network illustration ── -->
      <div class="nc-sb-network" *ngIf="!collapsed()" aria-hidden="true">
        <svg viewBox="0 0 220 90" class="nc-sb-network-svg">
          <circle cx="30" cy="60" r="1.6" class="net-dot" />
          <circle cx="70" cy="30" r="1.6" class="net-dot" />
          <circle cx="115" cy="55" r="1.6" class="net-dot" />
          <circle cx="150" cy="20" r="1.6" class="net-dot" />
          <circle cx="185" cy="45" r="1.6" class="net-dot" />
          <circle cx="55" cy="75" r="1.6" class="net-dot" />
          <circle cx="135" cy="70" r="1.6" class="net-dot" />
          <path d="M30 60 Q 55 15 70 30 T 115 55 T 150 20 T 185 45" class="net-arc net-arc-1" />
          <path d="M55 75 Q 90 40 115 55 T 135 70" class="net-arc net-arc-2" />
          <circle cx="70" cy="30" r="3" class="net-pulse" />
          <circle cx="150" cy="20" r="3" class="net-pulse net-pulse-delay" />
        </svg>
      </div>

      <!-- ── Footer ── -->
      <div class="nc-sb-footer">

        <!-- Language toggle -->
        <button class="nc-lang-toggle" (click)="ts.toggle()" [title]="ts.isEn() ? 'Passer en français' : 'Switch to English'">
          <span class="nc-lang-flag">{{ ts.isEn() ? '🇬🇧' : '🇫🇷' }}</span>
          <span class="nc-lang-lbl" *ngIf="!collapsed()">{{ ts.isEn() ? 'EN' : 'FR' }}</span>
        </button>

        <button class="nc-sb-logout" (click)="deconnexion()" [title]="collapsed() ? t('nav.logout') : ''">
          <i class="bi bi-box-arrow-right"></i>
          <span *ngIf="!collapsed()">{{ 'nav.logout' | t }}</span>
        </button>
      </div>

    </aside>
  `,
  styles: [`
    :host { display: block; height: 100vh; position: sticky; top: 0; flex-shrink: 0; }

    .nc-sidebar {
      width: 256px; height: 100vh;
      background: #0f1b36;
      display: flex; flex-direction: column;
      transition: width .28s cubic-bezier(.4,0,.2,1);
      overflow: hidden; position: relative;
      border-right: 1px solid rgba(255,255,255,.06);
    }
    .nc-sidebar.collapsed { width: 68px; }

    /* Decorative glow blob */
    .nc-sb-blob {
      position: absolute; top: -60px; left: -60px; width: 180px; height: 180px;
      border-radius: 50%; pointer-events: none; z-index: 0;
      background: radial-gradient(circle, rgba(30,111,217,.35), transparent 70%);
      animation: blob-pulse 6s ease-in-out infinite;
    }
    @keyframes blob-pulse { 0%,100% { transform: scale(1); opacity: .8; } 50% { transform: scale(1.15); opacity: 1; } }

    /* Agent profile card */
    .nc-sb-profile {
      position: relative; z-index: 1;
      display: flex; flex-direction: column; align-items: center; text-align: center;
      padding: 18px 14px 16px; border-bottom: 1px solid rgba(255,255,255,.07);
      flex-shrink: 0; text-decoration: none; cursor: pointer;
      transition: background .15s;
    }
    .nc-sb-profile:hover { background: rgba(255,255,255,.04); }
    .nc-sb-profile-collapsed { padding: 14px 0; }
    .nc-sb-profile-ring {
      width: 62px; height: 62px; border-radius: 50%; position: relative; margin-bottom: 10px;
      display: flex; align-items: center; justify-content: center;
      background: conic-gradient(from 0deg, #1E6FD9, #6c5ce7, #1E6FD9);
      animation: ring-rotate 6s linear infinite;
      padding: 3px;
    }
    .nc-sb-profile-ring-sm { width: 42px; height: 42px; margin-bottom: 0; }
    @keyframes ring-rotate { to { transform: rotate(360deg); } }
    .nc-sb-avatar-lg {
      width: 100%; height: 100%; border-radius: 50%; background: #0f1b36;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 18px;
      border: 2px solid #0f1b36;
    }
    .nc-sb-avatar-sm { font-size: 13px; }
    .nc-sb-profile-dot {
      position: absolute; bottom: 2px; right: 2px; width: 13px; height: 13px;
      border-radius: 50%; background: #10b981; border: 2.5px solid #0f1b36;
      box-shadow: 0 0 0 2px rgba(16,185,129,.25);
    }
    .nc-sb-profile-name { font-size: 13.5px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
    .nc-sb-profile-role { font-size: 11px; color: rgba(196,217,245,.55); margin-top: 2px; }

    /* Decorative network illustration */
    .nc-sb-network { padding: 6px 10px 2px; flex-shrink: 0; opacity: .9; }
    .nc-sb-network-svg { width: 100%; height: auto; display: block; }
    .net-dot { fill: rgba(137,180,232,.4); }
    .net-arc { fill: none; stroke: rgba(137,180,232,.28); stroke-width: 1; stroke-dasharray: 3 3; }
    .net-arc-1 { animation: net-dash 20s linear infinite; }
    .net-arc-2 { animation: net-dash 14s linear infinite reverse; }
    @keyframes net-dash { to { stroke-dashoffset: -200; } }
    .net-pulse { fill: #f5c518; animation: net-pulse-anim 2.2s ease-in-out infinite; }
    .net-pulse-delay { animation-delay: 1.1s; }
    @keyframes net-pulse-anim { 0%,100% { opacity: 1; r: 3; } 50% { opacity: .3; r: 5; } }

    /* Brand */
    .nc-sb-brand {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 14px 16px;
      border-bottom: 1px solid rgba(255,255,255,.07);
      flex-shrink: 0;
    }
    .nc-sb-logo-wrap {
      display: flex; align-items: center; gap: 10px; text-decoration: none; min-width: 0;
    }
    .nc-sb-brand-name {
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;
      font-size: 16px; color: #fff; white-space: nowrap; overflow: hidden;
    }
    .nc-sb-collapse-btn {
      width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.05); color: rgba(255,255,255,.5); cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 11px;
      flex-shrink: 0; transition: background .15s, color .15s;
    }
    .nc-sb-collapse-btn:hover { background: rgba(255,255,255,.12); color: #fff; }

    /* Nav */
    .nc-sb-nav { flex: 1; padding: 10px 0 10px 10px; overflow-y: auto; overflow-x: hidden; }
    .nc-sb-nav::-webkit-scrollbar { width: 3px; }
    .nc-sb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

    .nc-sb-section {
      font-size: 10px; font-weight: 700; letter-spacing: .9px;
      text-transform: uppercase; color: rgba(137,180,232,.4);
      padding: 14px 10px 6px; white-space: nowrap;
    }
    .nc-sb-divider { height: 1px; background: rgba(255,255,255,.06); margin: 8px 0; }

    .nc-sb-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; margin-right: 10px; border-radius: 11px; text-decoration: none;
      color: rgba(196,217,245,.7); font-size: 13.5px; font-weight: 500;
      transition: all .18s cubic-bezier(.4,0,.2,1); margin-bottom: 2px; position: relative;
      white-space: nowrap; overflow: visible;
    }
    .nc-sb-item:hover { background: rgba(255,255,255,.07); color: #fff; }

    /* Active item: white pill flush against the sidebar edge, like a connected tab */
    .nc-sb-item.active {
      background: #fff; color: #152247; margin-right: 0;
      padding-right: 20px; border-radius: 14px 0 0 14px;
      box-shadow: -2px 0 18px rgba(0,0,0,.15);
      font-weight: 700;
    }
    .nc-sb-item.active::after {
      content: ''; position: absolute; right: -1px; top: 50%; transform: translateY(-50%);
      width: 6px; height: 6px; border-radius: 50%; background: #1E6FD9;
    }
    .nc-sb-item.active .nc-sb-item-ico { background: #1E6FD9 !important; color: #fff !important; }

    .nc-sb-item-ico {
      width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; transition: all .16s;
      background: rgba(255,255,255,.06); color: rgba(255,255,255,.55);
    }
    .nc-ico-blue   { background: rgba(30,111,217,.2) !important;  color: #89B4E8 !important; }
    .nc-ico-green  { background: rgba(10,143,96,.2) !important;   color: #6ee7b7 !important; }
    .nc-ico-purple { background: rgba(108,92,231,.2) !important;  color: #c4b5fd !important; }
    .nc-ico-orange { background: rgba(245,158,11,.2) !important;  color: #fcd34d !important; }
    .nc-ico-red    { background: rgba(239,68,68,.2) !important;   color: #fca5a5 !important; }
    .nc-ico-navy   { background: rgba(255,255,255,.08) !important; color: rgba(196,217,245,.8) !important; }
    .nc-ico-gold   { background: rgba(245,158,11,.15) !important; color: #fbbf24 !important; }

    .nc-sb-item-lbl { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }

    .nc-sb-badge {
      background: #ef4444; color: #fff; font-size: 10.5px; font-weight: 700;
      padding: 2px 7px; border-radius: 10px; flex-shrink: 0;
    }
    .nc-sb-badge-red { background: #dc2626; }
    .nc-sb-badge-sm {
      position: absolute; top: 4px; right: 4px;
      width: 16px; height: 16px; border-radius: 50%; padding: 0;
      display: flex; align-items: center; justify-content: center; font-size: 9px;
    }

    /* Footer */
    .nc-sb-footer {
      padding: 10px 10px 14px;
      border-top: 1px solid rgba(255,255,255,.07);
      display: flex; flex-direction: column; gap: 8px; flex-shrink: 0;
    }
    .nc-lang-toggle {
      display: flex; align-items: center; gap: 8px;
      padding: 7px 10px; border-radius: 10px; cursor: pointer;
      background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
      color: rgba(196,217,245,.75); font-size: 13px; font-weight: 600;
      transition: background .15s; width: 100%; justify-content: flex-start;
    }
    .nc-lang-toggle:hover { background: rgba(255,255,255,.1); color: #fff; }
    .nc-lang-flag { font-size: 16px; }
    .nc-lang-lbl { font-size: 12.5px; }

    .nc-sb-logout {
      display: flex; align-items: center; gap: 8px; justify-content: center;
      padding: 8px; border-radius: 10px; border: 1px solid rgba(255,255,255,.1);
      background: transparent; color: rgba(196,217,245,.6); font-size: 13px;
      cursor: pointer; transition: all .15s; width: 100%;
    }
    .nc-sb-logout:hover { background: rgba(239,68,68,.12); border-color: rgba(239,68,68,.35); color: #f87171; }
  `]
})
export class SidebarComponent implements OnInit {
  agent;
  collapsed = signal(false);
  pendingCount = computed(() => this.agentData.dossiers().length);
  riskCount = computed(() => this.agentData.riskClients().length);

  constructor(
    private authService: AuthService,
    public ts: TranslationService,
    public agentData: AgentDataService
  ) {
    this.agent = this.authService.agentConnecte;
  }

  ngOnInit(): void {
    this.agentData.refresh();
  }

  t(key: string): string { return this.ts.t(key); }

  initiales(): string {
    const a = this.agent();
    if (!a) return '?';
    return `${a.prenom?.[0] ?? ''}${a.nom?.[0] ?? ''}`.toUpperCase();
  }

  deconnexion(): void { this.authService.logout(); }
}
