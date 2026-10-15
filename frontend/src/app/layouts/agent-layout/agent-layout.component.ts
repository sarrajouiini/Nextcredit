import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TourComponent } from '../../shared/components/tour/tour.component';
import { TourService } from '../../core/services/tour.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationService } from '../../core/services/translation.service';
import { filter, map } from 'rxjs';

const PAGE_TITLES: Record<string, { key: string; icon: string }> = {
  '/agent/dashboard':                  { key: 'nav.home',        icon: 'bi-house-door-fill' },
  '/agent/bi/vue-globale':             { key: 'nav.bi_global',   icon: 'bi-globe2' },
  '/agent/bi/retard-defaut':           { key: 'nav.bi_retard',   icon: 'bi-graph-down-arrow' },
  '/agent/bi/profil-clients':          { key: 'nav.bi_profil',   icon: 'bi-people-fill' },
  '/agent/bi/performance-portefeuille':{ key: 'nav.bi_perf',     icon: 'bi-briefcase-fill' },
  '/agent/bi/evolution-ia':            { key: 'nav.bi_evolution',icon: 'bi-cpu-fill' },
  '/agent/octroi':                     { key: 'nav.octroi',      icon: 'bi-bank' },
  '/agent/comportement':               { key: 'nav.comportement',icon: 'bi-graph-up-arrow' },
  '/agent/dossiers':                   { key: 'nav.dossiers',    icon: 'bi-folder2-open' },
  '/agent/risque':                     { key: 'nav.risque',      icon: 'bi-exclamation-triangle-fill' },
  '/agent/assistant':                  { key: 'nav.assistant',   icon: 'bi-robot' },
  '/agent/guide':                      { key: 'nav.guide',       icon: 'bi-book-fill' },
  '/agent/profile':                    { key: 'nav.profile',     icon: 'bi-person-circle' },
  '/agent/monitoring':                  { key: 'nav.monitoring',  icon: 'bi-activity' },
  '/agent/admin/comptes':               { key: 'nav.admin_comptes', icon: 'bi-people-fill' },
};

@Component({
  selector: 'app-agent-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TourComponent, TranslatePipe, NgIf],
  template: `
    <div class="nc-shell">
      <app-sidebar></app-sidebar>

      <div class="nc-main-col">
        <!-- ── Topbar ── -->
        <header class="nc-topbar">
          <div class="nc-topbar-left">
            <div class="nc-page-icon" *ngIf="pageIcon">
              <i class="bi" [class]="pageIcon"></i>
            </div>
            <div class="nc-page-info">
              <h1 class="nc-page-title">{{ pageKey | t }}</h1>
              <div class="nc-breadcrumb">NextCredit &rsaquo; {{ pageKey | t }}</div>
            </div>
          </div>
          <div class="nc-topbar-right">
            <!-- Language toggle -->
            <button class="nc-tb-btn nc-lang-btn" (click)="ts.toggle()" [title]="ts.isEn() ? 'Passer en français' : 'Switch to English'">
              <span>{{ ts.isEn() ? '🇬🇧 EN' : '🇫🇷 FR' }}</span>
            </button>
            <!-- Tour trigger button -->
            <button class="nc-tb-btn nc-tour-btn" (click)="tour.start()" [title]="ts.isEn() ? 'Interactive guide' : 'Guide interactif'">
              <i class="bi bi-question-circle-fill"></i>
              <span>{{ ts.isEn() ? 'Guide' : 'Guide' }}</span>
            </button>
            <!-- Server status indicator -->
            <div class="nc-server-dot" [class.online]="true" title="Serveur IA en ligne">
              <span class="nc-dot-pulse"></span>
            </div>
          </div>
        </header>

        <!-- ── Content ── -->
        <main class="nc-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <!-- ── Tour overlay (rendered above everything) ── -->
    <app-tour></app-tour>
  `,
  styles: [`
    .nc-shell { display: flex; min-height: 100vh; background: #f0f4fb; }
    .nc-main-col { flex: 1; min-width: 0; display: flex; flex-direction: column; }

    /* Topbar */
    .nc-topbar {
      height: 64px; background: #fff; border-bottom: 1px solid #e8edf6;
      padding: 0 32px; display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 200; flex-shrink: 0;
    }
    .nc-topbar-left { display: flex; align-items: center; gap: 14px; }
    .nc-page-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: linear-gradient(135deg, #152247, #1E6FD9);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 17px; flex-shrink: 0;
    }
    .nc-page-title {
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;
      font-size: 17px; color: #152247; line-height: 1.2;
    }
    .nc-breadcrumb { font-size: 11.5px; color: #9aa1b3; margin-top: 1px; }

    .nc-topbar-right { display: flex; align-items: center; gap: 12px; }
    .nc-tb-btn {
      display: flex; align-items: center; gap: 6px;
      background: #f8faff; border: 1px solid #e8edf6; border-radius: 10px;
      padding: 7px 13px; cursor: pointer; font-size: 13px; font-weight: 600;
      color: #152247; transition: background .15s;
    }
    .nc-tb-btn:hover { background: #e8edf6; }
    .nc-lang-btn { font-size: 12.5px; }
    .nc-tour-btn { color: #1E6FD9; border-color: #c4d9f5; background: #eef5ff; font-size: 13px; gap: 5px; }
    .nc-tour-btn:hover { background: #1E6FD9; color: #fff; border-color: #1E6FD9; }

    .nc-server-dot {
      width: 10px; height: 10px; border-radius: 50%; position: relative;
      background: #10b981;
    }
    .nc-dot-pulse {
      position: absolute; inset: -3px; border-radius: 50%;
      background: rgba(16,185,129,.3); animation: pulse-ring 2s ease-in-out infinite;
    }
    @keyframes pulse-ring {
      0%, 100% { transform: scale(1); opacity: .6; }
      50% { transform: scale(1.5); opacity: 0; }
    }

    /* Content */
    .nc-content { flex: 1; padding: 28px 32px; overflow-y: auto; }
  `]
})
export class AgentLayoutComponent implements OnInit {
  pageKey = 'nav.home';
  pageIcon = 'bi-house-door-fill';

  constructor(private router: Router, public ts: TranslationService, public tour: TourService) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects.split('?')[0])
    ).subscribe(url => {
      const p = PAGE_TITLES[url];
      this.pageKey = p?.key ?? 'nav.home';
      this.pageIcon = p?.icon ?? 'bi-house-door-fill';
    });
    // Init on first load
    const url = this.router.url.split('?')[0];
    const p = PAGE_TITLES[url];
    if (p) { this.pageKey = p.key; this.pageIcon = p.icon; }
  }

  ngOnInit(): void {
    this.tour.startIfFirstTime();
  }
}
