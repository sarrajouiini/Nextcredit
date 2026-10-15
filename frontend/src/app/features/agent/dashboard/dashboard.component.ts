import { Component, OnInit, OnDestroy, computed, effect, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgIf, NgFor, NgClass, SlicePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AgentDataService, Dossier } from '../../../core/services/agent-data.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, NgClass, TranslatePipe, SlicePipe],
  template: `
    <!-- ── Greeting ── -->
    <div class="dash-greeting" data-tour="dashboard">
      <div class="dash-greet-text">
        <h1>{{ 'dash.greeting' | t }}, <span class="dash-name">{{ agent()?.prenom }}</span></h1>
        <p>{{ 'dash.subtitle' | t }}</p>
      </div>
      <div class="dash-date">
        <div class="dash-date-day">{{ today | slice:0:2 }}</div>
        <div class="dash-date-rest">{{ today | slice:3 }}</div>
      </div>
    </div>

    <!-- ── Score panel: animated scoring gauge + ticker ── -->
    <div class="dash-score-panel" *ngIf="!loading()">
      <div class="dash-score-info">
        <div class="dash-score-eyebrow">{{ ts.isEn() ? 'Model performance' : 'Performance du modèle' }}</div>
        <div class="dash-score-track">
          <div class="dash-score-item"
               *ngFor="let n of newsItems(); let i = index"
               [class.active]="i === newsIndex()">
            <i class="bi" [class]="n.icon"></i>
            <span>{{ ts.isEn() ? n.textEn : n.textFr }}</span>
          </div>
        </div>
        <div class="dash-score-dots">
          <span *ngFor="let n of newsItems(); let i = index" [class.active]="i === newsIndex()"></span>
        </div>
      </div>

      <div class="dash-gauge">
        <svg viewBox="0 0 200 128" class="dash-gauge-svg">
          <defs>
            <linearGradient id="dash-gauge-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stop-color="#ef4444" />
              <stop offset="50%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#10b981" />
            </linearGradient>
            <radialGradient id="dash-gauge-tip-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#5b6b8c" stop-opacity=".9" />
              <stop offset="100%" stop-color="#5b6b8c" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Graduation ticks -->
          <line *ngFor="let tck of gaugeTicks" [attr.x1]="tck.x1" [attr.y1]="tck.y1" [attr.x2]="tck.x2" [attr.y2]="tck.y2" class="dash-gauge-tick" />

          <!-- Background track -->
          <path d="M 14 110 A 96 96 0 0 1 186 110" class="dash-gauge-track" />

          <!-- Purely decorative — animates on a loop, not tied to any KPI -->
          <path d="M 14 110 A 96 96 0 0 1 186 110"
                class="dash-gauge-fill"
                [style.strokeDasharray]="gaugeCircumference"
                [style.strokeDashoffset]="gaugeOffset(decorativeGauge())" />

          <g class="dash-gauge-needle-grp" [style.transform]="'rotate(' + needleDeg(decorativeGauge()) + 'deg)'">
            <circle cx="100" cy="28" r="11" class="dash-gauge-tip-halo" fill="url(#dash-gauge-tip-glow)" />
            <line x1="100" y1="108" x2="100" y2="30" class="dash-gauge-needle" />
            <circle cx="100" cy="28" r="3.5" class="dash-gauge-tip" />
          </g>
          <circle cx="100" cy="110" r="7" class="dash-gauge-pivot" />
          <circle cx="100" cy="110" r="3" class="dash-gauge-pivot-dot" />
        </svg>
      </div>
    </div>

    <!-- ── KPI Cards ── -->
    <div class="dash-kpis" *ngIf="!loading(); else loadingTpl">
      <!-- Hero card 1: pending files (illustrated gradient card) -->
      <div class="dash-hero dash-hero-blue" (click)="navigate('/agent/dossiers')">
        <i class="bi bi-folder2-open dash-hero-watermark"></i>
        <div class="dash-hero-top">
          <span class="dash-hero-lbl">{{ 'dash.pending' | t }}</span>
          <i class="bi bi-arrow-up-right dash-hero-arrow"></i>
        </div>
        <div class="dash-hero-val">{{ animPending() }}</div>
        <div class="dash-hero-wave" aria-hidden="true"><svg viewBox="0 0 200 30" preserveAspectRatio="none"><path d="M0 20 Q 50 0 100 15 T 200 10 V30 H0 Z" /></svg></div>
      </div>

      <!-- Hero card 2: AUC-ROC (illustrated gradient card) -->
      <div class="dash-hero dash-hero-navy" (click)="navigate('/agent/bi/evolution-ia')">
        <i class="bi bi-bullseye dash-hero-watermark"></i>
        <div class="dash-hero-top">
          <span class="dash-hero-lbl">{{ ts.isEn() ? 'Model AUC-ROC' : 'AUC-ROC Modèle' }}</span>
          <span class="dash-hero-demo" *ngIf="metricsDemoMode()">{{ ts.isEn() ? 'DEMO' : 'DÉMO' }}</span>
        </div>
        <div class="dash-hero-val">{{ animAuc() }}%</div>
        <div class="dash-hero-wave" aria-hidden="true"><svg viewBox="0 0 200 30" preserveAspectRatio="none"><path d="M0 15 Q 50 30 100 12 T 200 18 V30 H0 Z" /></svg></div>
      </div>

      <div class="dash-kpi dash-kpi-red" (click)="navigate('/agent/risque')">
        <div class="dash-kpi-ico"><i class="bi bi-exclamation-triangle-fill"></i></div>
        <div class="dash-kpi-body">
          <div class="dash-kpi-val">{{ animRisk() }}</div>
          <div class="dash-kpi-lbl">{{ 'dash.risk' | t }}</div>
        </div>
        <div class="dash-kpi-action"><i class="bi bi-arrow-right"></i></div>
      </div>

      <div class="dash-kpi" [ngClass]="serverOk() ? 'dash-kpi-green' : 'dash-kpi-gray'">
        <div class="dash-kpi-ico"><i class="bi bi-cpu-fill"></i></div>
        <div class="dash-kpi-body">
          <div class="dash-kpi-val dash-kpi-status">
            <span class="dash-status-dot" [ngClass]="serverOk() ? 'dot-green' : 'dot-gray'"></span>
            {{ serverOk() ? ('dash.server_ok' | t) : ('dash.server_err' | t) }}
          </div>
          <div class="dash-kpi-lbl">{{ 'dash.server' | t }}</div>
        </div>
      </div>

      <div class="dash-kpi dash-kpi-navy" (click)="navigate('/agent/bi/evolution-ia')">
        <div class="dash-kpi-ico"><i class="bi bi-crosshair"></i></div>
        <div class="dash-kpi-body">
          <div class="dash-kpi-val">{{ animPrecision() }}%</div>
          <div class="dash-kpi-lbl">{{ ts.isEn() ? 'Prediction Precision' : 'Précision Prédiction' }}</div>
        </div>
        <span class="dash-kpi-demo" *ngIf="metricsDemoMode()">{{ ts.isEn() ? 'DEMO' : 'DÉMO' }}</span>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="dash-loading">
        <div class="dash-spinner"></div>
        <span>{{ 'dash.loading' | t }}</span>
      </div>
    </ng-template>

    <!-- ── Recent files (own loading state, independent of the page-level gate) ── -->
    <div class="dash-card dash-card-full" *ngIf="!loading()">
      <div class="dash-card-head">
        <div>
          <h2 class="dash-card-title">{{ ts.isEn() ? 'Most Recent Files' : 'Dossiers Récents' }}</h2>
          <p class="dash-card-sub">{{ ts.isEn() ? 'Latest submitted credit requests' : 'Dernières demandes de crédit soumises' }}</p>
        </div>
        <a routerLink="/agent/dossiers" class="dash-card-link">{{ ts.isEn() ? 'View all' : 'Voir tout' }} <i class="bi bi-arrow-right"></i></a>
      </div>

      <div class="mini-loading" *ngIf="agentData.loading() && !agentData.loaded()">
        <div class="mini-spinner"></div>
        <span>{{ ts.isEn() ? 'Loading…' : 'Chargement…' }}</span>
      </div>

      <ng-container *ngIf="!agentData.loading() || agentData.loaded()">
        <div class="mini-warn" *ngIf="agentData.dossiersUnavailable()">
          <i class="bi bi-wifi-off"></i>
          <span>{{ ts.isEn() ? 'Data temporarily unavailable' : 'Données temporairement indisponibles' }}</span>
        </div>

        <div class="mini-empty" *ngIf="!agentData.dossiersUnavailable() && recentDossiers().length === 0">
          <i class="bi bi-inbox"></i>
          <span>{{ ts.isEn() ? 'No pending files' : 'Aucun dossier en attente' }}</span>
        </div>

        <div class="mini-list" *ngIf="recentDossiers().length > 0">
          <div class="mini-row" *ngFor="let d of recentDossiers(); let i = index" [style.animationDelay.ms]="i * 80">
            <div class="mini-avatar mini-avatar-blue">{{ cin(d) | slice:0:2 }}</div>
            <div class="mini-info">
              <div class="mini-code">{{ cin(d) || '—' }}</div>
              <div class="mini-sub">{{ ts.isEn() ? 'Score' : 'Score' }} {{ d.Score ?? '—' }} · {{ d.Notation ?? '—' }}</div>
            </div>
            <span class="mini-decision" [ngClass]="decClass(d.DecisionModele)">{{ d.DecisionModele ?? '—' }}</span>
          </div>
        </div>
      </ng-container>
    </div>

    <!-- ── Quick Actions ── -->
    <div class="dash-section-title">{{ 'dash.today' | t }}</div>
    <p class="dash-section-sub">{{ 'dash.today_sub' | t }}</p>

    <div class="dash-actions-grid">
      <a routerLink="/agent/octroi" class="dash-action dash-action-blue">
        <div class="dash-action-ico"><i class="bi bi-bank"></i></div>
        <div>
          <div class="dash-action-title">{{ 'nav.octroi' | t }}</div>
          <div class="dash-action-desc">{{ 'dash.goto_octroi' | t }}</div>
        </div>
        <i class="bi bi-arrow-right dash-action-arrow"></i>
      </a>
      <a routerLink="/agent/comportement" class="dash-action dash-action-green">
        <div class="dash-action-ico"><i class="bi bi-graph-up-arrow"></i></div>
        <div>
          <div class="dash-action-title">{{ 'nav.comportement' | t }}</div>
          <div class="dash-action-desc">{{ 'dash.goto_comportement' | t }}</div>
        </div>
        <i class="bi bi-arrow-right dash-action-arrow"></i>
      </a>
      <a routerLink="/agent/assistant" class="dash-action dash-action-purple">
        <div class="dash-action-ico"><i class="bi bi-robot"></i></div>
        <div>
          <div class="dash-action-title">{{ 'nav.assistant' | t }}</div>
          <div class="dash-action-desc">{{ 'dash.goto_assistant' | t }}</div>
        </div>
        <i class="bi bi-arrow-right dash-action-arrow"></i>
      </a>
      <a routerLink="/agent/dossiers" class="dash-action dash-action-orange">
        <div class="dash-action-ico"><i class="bi bi-folder2-open"></i></div>
        <div>
          <div class="dash-action-title">{{ 'nav.dossiers' | t }}</div>
          <div class="dash-action-desc">{{ 'dash.goto_dossiers' | t }}</div>
        </div>
        <span class="dash-action-badge" *ngIf="pendingCount() > 0">{{ pendingCount() }}</span>
        <i class="bi bi-arrow-right dash-action-arrow" *ngIf="pendingCount() === 0"></i>
      </a>
      <a routerLink="/agent/bi/evolution-ia" class="dash-action dash-action-navy">
        <div class="dash-action-ico"><i class="bi bi-cpu-fill"></i></div>
        <div>
          <div class="dash-action-title">{{ ts.isEn() ? 'AI Evolution' : 'Évolution IA' }}</div>
          <div class="dash-action-desc">{{ ts.isEn() ? 'Model performance' : 'Performance du modèle' }}</div>
        </div>
        <i class="bi bi-arrow-right dash-action-arrow"></i>
      </a>
      <a routerLink="/agent/guide" class="dash-action dash-action-gold">
        <div class="dash-action-ico"><i class="bi bi-book-fill"></i></div>
        <div>
          <div class="dash-action-title">{{ 'nav.guide' | t }}</div>
          <div class="dash-action-desc">{{ 'dash.goto_guide' | t }}</div>
        </div>
        <i class="bi bi-arrow-right dash-action-arrow"></i>
      </a>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* Greeting — light, understated typography */
    .dash-greeting {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 20px; gap: 20px;
    }
    .dash-greet-text h1 {
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
      font-size: clamp(20px, 2.2vw, 25px); color: #2a3548; line-height: 1.25;
      letter-spacing: -.01em;
    }
    .dash-name { color: #5b6b8c; font-weight: 700; }
    .dash-greet-text p { font-size: 13.5px; color: #8b95a7; margin-top: 4px; font-weight: 400; }
    .dash-date { text-align: right; flex-shrink: 0; }
    .dash-date-day { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 28px; color: #2a3548; line-height: 1; }
    .dash-date-rest { font-size: 12px; color: #9aa1b3; margin-top: 2px; text-transform: capitalize; font-weight: 400; }

    /* Score panel — scoring gauge + ticker, elegant/light styling */
    .dash-score-panel {
      display: flex; align-items: center; gap: 26px;
      background: #fff; border: 1px solid #edf1f7;
      border-radius: 20px; padding: 18px 26px; margin-bottom: 22px;
      animation: kpi-in .5s cubic-bezier(.4,0,.2,1) backwards;
    }
    .dash-score-info { flex: 1; min-width: 0; }
    .dash-score-eyebrow {
      font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
      color: #a8b0c0; margin-bottom: 8px;
    }
    .dash-score-track { position: relative; height: 22px; min-width: 0; }
    .dash-score-item {
      position: absolute; inset: 0; display: flex; align-items: center; gap: 9px;
      color: #3d4a63; font-size: 14px; font-weight: 400;
      opacity: 0; transform: translateY(6px);
      transition: opacity .5s ease, transform .5s ease;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .dash-score-item.active { opacity: 1; transform: translateY(0); }
    .dash-score-item i { font-size: 14px; color: #b6bece; flex-shrink: 0; }
    .dash-score-dots { display: flex; gap: 5px; margin-top: 12px; }
    .dash-score-dots span { width: 4px; height: 4px; border-radius: 50%; background: #e4e8f0; transition: all .3s; }
    .dash-score-dots span.active { background: #8a95ab; width: 13px; border-radius: 4px; }

    /* Semicircular scoring gauge */
    .dash-gauge { position: relative; width: 160px; height: 100px; flex-shrink: 0; }
    .dash-gauge-svg { width: 100%; height: 100%; overflow: visible; }
    .dash-gauge-tick { stroke: #dde2ec; stroke-width: 2; stroke-linecap: round; }
    .dash-gauge-track { fill: none; stroke: #eef1f7; stroke-width: 11; stroke-linecap: round; }
    .dash-gauge-fill {
      fill: none; stroke: url(#dash-gauge-grad); stroke-width: 11; stroke-linecap: round;
      transition: stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1);
      filter: drop-shadow(0 1px 3px rgba(90,110,150,.25));
    }
    .dash-gauge-needle-grp {
      transform-origin: 100px 110px;
      transition: transform 1.5s cubic-bezier(.34,1.56,.64,1);
    }
    .dash-gauge-needle { stroke: #47536b; stroke-width: 3; stroke-linecap: round; }
    .dash-gauge-tip { fill: #47536b; }
    .dash-gauge-tip-halo { animation: gauge-tip-pulse 2.2s ease-in-out infinite; }
    @keyframes gauge-tip-pulse { 0%,100% { opacity: .55; r: 10; } 50% { opacity: 1; r: 13; } }
    .dash-gauge-pivot { fill: #fff; stroke: #47536b; stroke-width: 2; }
    .dash-gauge-pivot-dot { fill: #47536b; }

    /* Hero illustrated cards */
    .dash-hero {
      position: relative; overflow: hidden; border-radius: 18px; padding: 18px;
      cursor: pointer; color: #fff; min-height: 108px;
      display: flex; flex-direction: column; justify-content: space-between;
      transition: transform .2s, box-shadow .2s;
      animation: kpi-in .5s cubic-bezier(.4,0,.2,1) backwards;
    }
    .dash-hero:hover { transform: translateY(-3px); box-shadow: 0 14px 34px rgba(21,34,71,.22); }
    .dash-hero-blue { background: linear-gradient(135deg, #1E6FD9, #4a90e2); }
    .dash-hero-navy { background: linear-gradient(135deg, #152247, #2a3f73); }
    .dash-hero-watermark {
      position: absolute; right: -8px; bottom: -10px; font-size: 76px;
      color: rgba(255,255,255,.12); pointer-events: none; z-index: 0;
    }
    .dash-hero-top { display: flex; align-items: flex-start; justify-content: space-between; position: relative; z-index: 1; }
    .dash-hero-lbl { font-size: 12.5px; font-weight: 600; color: rgba(255,255,255,.85); }
    .dash-hero-arrow { font-size: 15px; color: rgba(255,255,255,.7); }
    .dash-hero-demo {
      background: rgba(255,255,255,.18); font-size: 9px; font-weight: 800;
      padding: 2px 7px; border-radius: 10px; letter-spacing: .03em; white-space: nowrap;
    }
    .dash-hero-val {
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 30px;
      position: relative; z-index: 1; line-height: 1;
    }
    .dash-hero-wave { position: absolute; left: 0; right: 0; bottom: 0; height: 24px; opacity: .5; z-index: 0; }
    .dash-hero-wave svg { width: 100%; height: 100%; }
    .dash-hero-wave path { fill: rgba(255,255,255,.14); }

    /* KPIs */
    .dash-kpis { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
    .dash-kpi {
      background: #fff; border-radius: 18px; padding: 18px; border: 1px solid #e8edf6;
      display: flex; align-items: center; gap: 13px; cursor: pointer;
      transition: transform .2s, box-shadow .2s; position: relative; overflow: hidden;
      animation: kpi-in .5s cubic-bezier(.4,0,.2,1) backwards;
    }
    @keyframes kpi-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .dash-kpi::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 4px 0 0 4px;
    }
    .dash-kpi:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(21,34,71,.09); }
    .dash-kpi-orange::before { background: #f59e0b; }
    .dash-kpi-red::before    { background: #ef4444; }
    .dash-kpi-green::before  { background: #10b981; }
    .dash-kpi-gray::before   { background: #9aa1b3; }
    .dash-kpi-purple::before { background: #6c5ce7; }
    .dash-kpi-navy::before   { background: #152247; }

    .dash-kpi-ico {
      width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 18px;
    }
    .dash-kpi-orange .dash-kpi-ico { background: #fff3e0; color: #f59e0b; }
    .dash-kpi-red    .dash-kpi-ico { background: #fee2e2; color: #ef4444; }
    .dash-kpi-green  .dash-kpi-ico { background: #d1fae5; color: #10b981; }
    .dash-kpi-gray   .dash-kpi-ico { background: #f1f5f9; color: #64748b; }
    .dash-kpi-purple .dash-kpi-ico { background: #ede8ff; color: #6c5ce7; }
    .dash-kpi-navy   .dash-kpi-ico { background: #e8edf6; color: #152247; }

    .dash-kpi-body { flex: 1; min-width: 0; }
    .dash-kpi-val  { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 24px; color: #152247; line-height: 1; }
    .dash-kpi-status { font-size: 14.5px !important; display: flex; align-items: center; gap: 7px; }
    .dash-status-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
    .dot-green { background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.2); animation: dot-pulse 2s ease-in-out infinite; }
    .dot-gray  { background: #9aa1b3; }
    @keyframes dot-pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(16,185,129,.2); } 50% { box-shadow: 0 0 0 6px rgba(16,185,129,.08); } }
    .dash-kpi-lbl  { font-size: 12px; font-weight: 600; color: #152247; margin-top: 3px; }
    .dash-kpi-action { color: #cbd5e1; font-size: 15px; flex-shrink: 0; }
    .dash-kpi-demo {
      position: absolute; top: 8px; right: 8px;
      background: #fef3df; color: #d97706; font-size: 9px; font-weight: 800;
      padding: 2px 6px; border-radius: 10px; letter-spacing: .03em;
    }

    /* Loading */
    .dash-loading { display: flex; align-items: center; gap: 12px; padding: 28px 0; color: #6b7488; font-size: 14px; margin-bottom: 36px; }
    .dash-spinner { width: 22px; height: 22px; border: 2.5px solid #e8edf6; border-top-color: #1E6FD9; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Split grid: recent files + risk */
    .dash-card-full { margin-bottom: 20px; }
    .dash-card {
      background: #fff; border: 1px solid #e8edf6; border-radius: 20px; padding: 20px 22px;
      animation: kpi-in .5s cubic-bezier(.4,0,.2,1) backwards; animation-delay: .1s;
    }
    .dash-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
    .dash-card-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 14.5px; color: #152247; }
    .dash-card-sub { font-size: 11.5px; color: #9aa1b3; margin-top: 2px; }
    .dash-card-link { font-size: 12px; font-weight: 700; color: #1E6FD9; text-decoration: none; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
    .dash-card-link:hover { text-decoration: underline; }

    /* Mini rows (shared by both cards) */
    .mini-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 30px 0; color: #9aa1b3; font-size: 12.5px; }
    .mini-warn { display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: #fff3e0; border: 1px solid #fde3b8; border-radius: 12px; color: #92400e; font-size: 12px; font-weight: 600; }
    .mini-loading { display: flex; align-items: center; gap: 10px; padding: 24px 0; color: #9aa1b3; font-size: 12.5px; }
    .mini-spinner { width: 18px; height: 18px; border: 2.5px solid #e8edf6; border-top-color: #1E6FD9; border-radius: 50%; animation: spin .7s linear infinite; }
    .mini-empty i { font-size: 30px; color: #10b981; }
    .mini-list { display: flex; flex-direction: column; gap: 2px; }
    .mini-row {
      display: flex; align-items: center; gap: 12px; padding: 10px 6px;
      border-radius: 11px; transition: background .15s;
      animation: alert-slide-in .4s cubic-bezier(.4,0,.2,1) backwards;
    }
    @keyframes alert-slide-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
    .mini-row:hover { background: #f8faff; }
    .mini-avatar {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 10.5px; font-weight: 700;
    }
    .mini-avatar-blue { background: #deeeff; color: #1E6FD9; }
    .mini-info { flex: 1; min-width: 0; }
    .mini-code { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 12.5px; color: #152247; }
    .mini-sub { font-size: 11px; color: #9aa1b3; margin-top: 1px; }
    .mini-decision { font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; flex-shrink: 0; white-space: nowrap; }
    .dec-accord { background: #d1fae5; color: #065f46; }
    .dec-refus  { background: #fee2e2; color: #991b1b; }
    .dec-watch  { background: #fef9c3; color: #854d0e; }
    .dec-other  { background: #f1f5f9; color: #64748b; }

    /* Section */
    .dash-section-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 18px; color: #152247; }
    .dash-section-sub { font-size: 13.5px; color: #6b7488; margin-top: 4px; margin-bottom: 20px; }

    /* Actions grid */
    .dash-actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .dash-action {
      display: flex; align-items: center; gap: 14px; padding: 18px 18px 18px 16px;
      background: #fff; border: 1px solid #e8edf6; border-radius: 18px;
      text-decoration: none; transition: transform .2s, box-shadow .2s, border-color .2s;
      cursor: pointer; position: relative; overflow: hidden;
    }
    .dash-action:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(21,34,71,.09); border-color: transparent; }
    .dash-action-ico {
      width: 44px; height: 44px; border-radius: 13px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .dash-action-blue   .dash-action-ico { background: #deeeff; color: #1E6FD9; }
    .dash-action-green  .dash-action-ico { background: #d8f5e9; color: #0a8f60; }
    .dash-action-purple .dash-action-ico { background: #ede8ff; color: #6c5ce7; }
    .dash-action-orange .dash-action-ico { background: #fff3e0; color: #f59e0b; }
    .dash-action-navy   .dash-action-ico { background: #e8edf6; color: #152247; }
    .dash-action-gold   .dash-action-ico { background: #fffbeb; color: #d97706; }
    .dash-action-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; color: #152247; }
    .dash-action-desc  { font-size: 12.5px; color: #6b7488; margin-top: 2px; }
    .dash-action-arrow { margin-left: auto; color: #cbd5e1; font-size: 14px; flex-shrink: 0; }
    .dash-action-badge {
      margin-left: auto; background: #ef4444; color: #fff;
      font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 10px; flex-shrink: 0;
    }

    @media (max-width: 1300px) { .dash-kpis { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 1100px) { .dash-actions-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 700px) { .dash-kpis { grid-template-columns: 1fr 1fr; } .dash-actions-grid { grid-template-columns: 1fr; } .dash-greeting { flex-direction: column; } }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  agent;
  loading = signal(true);
  serverOk = signal(false);
  today = '';

  pendingCount = computed(() => this.agentData.dossiers().length);
  riskCount = computed(() => this.agentData.riskClients().length);
  recentDossiers = computed(() => {
    const sorted = [...this.agentData.dossiers()].sort((a, b) =>
      new Date(b.DateDemande ?? 0).getTime() - new Date(a.DateDemande ?? 0).getTime());
    return sorted.slice(0, 3);
  });

  metrics = signal<{ auc: number; precision: number } | null>(null);
  metricsDemoMode = signal(false);

  animPending = signal(0);
  animRisk = signal(0);
  animAuc = signal(0);
  animPrecision = signal(0);

  newsIndex = signal(0);
  private newsTimer?: ReturnType<typeof setInterval>;

  /** Purely decorative gauge value — loops on its own, never reflects real data. */
  decorativeGauge = signal(0);
  private readonly gaugeLoopValues = [78, 45, 92, 60, 83, 35, 70];
  private gaugeLoopIndex = 0;
  private gaugeTimer?: ReturnType<typeof setInterval>;

  newsItems = signal<{ icon: string; textFr: string; textEn: string }[]>([
    { icon: 'bi-info-circle-fill', textFr: 'Bienvenue sur NextCredit — votre copilote de scoring crédit.', textEn: 'Welcome to NextCredit — your credit scoring copilot.' },
  ]);

  constructor(
    private authService: AuthService,
    public ts: TranslationService,
    private http: HttpClient,
    private router: Router,
    public agentData: AgentDataService
  ) {
    this.agent = this.authService.agentConnecte;
    this.today = new Date().toLocaleDateString(this.ts.lang() === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit', weekday: 'long', month: 'long'
    });

    // Re-animate the pending/risk counters and refresh the news ticker
    // whenever the shared dossiers/risk data changes — independent of
    // this page's own health/metrics fetch, so a slow shared fetch never
    // blocks the rest of the page from rendering.
    effect(() => {
      this.countUp(this.animPending, this.pendingCount());
      this.countUp(this.animRisk, this.riskCount());
      this.buildNews();
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.newsTimer = setInterval(() => {
      this.newsIndex.update(i => (i + 1) % this.newsItems().length);
    }, 4500);

    // Decorative gauge: sweeps to a new pleasant value every few seconds, forever.
    setTimeout(() => this.decorativeGauge.set(this.gaugeLoopValues[0]), 200);
    this.gaugeTimer = setInterval(() => {
      this.gaugeLoopIndex = (this.gaugeLoopIndex + 1) % this.gaugeLoopValues.length;
      this.decorativeGauge.set(this.gaugeLoopValues[this.gaugeLoopIndex]);
    }, 3200);
  }

  ngOnDestroy(): void {
    if (this.newsTimer) clearInterval(this.newsTimer);
    if (this.gaugeTimer) clearInterval(this.gaugeTimer);
  }

  navigate(url: string): void { this.router.navigate([url]); }

  readonly gaugeCircumference = Math.PI * 96;

  readonly gaugeTicks = Array.from({ length: 9 }, (_, i) => {
    const theta = (180 + (i / 8) * 180) * (Math.PI / 180);
    const cx = 100, cy = 110;
    return {
      x1: cx + 109 * Math.cos(theta), y1: cy + 109 * Math.sin(theta),
      x2: cx + 100 * Math.cos(theta), y2: cy + 100 * Math.sin(theta),
    };
  });

  gaugeOffset(pct: number): number {
    const clamped = Math.max(0, Math.min(100, pct));
    return this.gaugeCircumference * (1 - clamped / 100);
  }

  needleDeg(pct: number): number {
    const clamped = Math.max(0, Math.min(100, pct));
    return -90 + (clamped / 100) * 180;
  }

  cin(d: Dossier): string {
    const dc = d.DonneesClient;
    if (dc && typeof dc === 'object') return dc.CIN ?? dc.cin ?? 'XX';
    return 'XX';
  }

  notaClass(n?: string): Record<string, boolean> {
    if (!n) return {};
    return { [`nota-${n.toLowerCase()}`]: true };
  }

  decClass(d?: string): Record<string, boolean> {
    if (!d) return { 'dec-other': true };
    const low = d.toLowerCase();
    return {
      'dec-accord': low.includes('accord') || low.includes('approuve') || low.includes('maintenir'),
      'dec-refus':  low.includes('refu') || low.includes('contentieux'),
      'dec-watch':  low.includes('surveil') || low.includes('alerte') || low.includes('attente'),
      'dec-other':  !low.includes('accord') && !low.includes('approuve') && !low.includes('refu') && !low.includes('surveil') && !low.includes('alerte') && !low.includes('maintenir') && !low.includes('contentieux') && !low.includes('attente'),
    };
  }

  private loadData(): void {
    this.agentData.refresh();

    const token = this.authService.getAccessToken();
    if (!token) { this.loading.set(false); return; }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const base = environment.apiUrl;
    let done = 0;
    const check = () => { if (++done === 2) this.loading.set(false); };

    this.http.get<any>(`${base}/health`).pipe(
      timeout(12000),
      catchError(() => of(null))
    ).subscribe(r => { this.serverOk.set((r?.status || '').toUpperCase() === 'OK'); check(); });

    this.http.get<any>(`${base}/octroi/model-metrics`, { headers }).pipe(
      timeout(12000),
      catchError(() => of(null))
    ).subscribe(r => {
      const d = r?.data;
      if (d) {
        this.metrics.set({ auc: d.metrics?.auc ?? 0, precision: d.metrics?.precision ?? 0 });
        this.metricsDemoMode.set(!!d.demo_mode);
        this.countUp(this.animAuc, Math.round((d.metrics?.auc ?? 0) * 100));
        this.countUp(this.animPrecision, Math.round((d.metrics?.precision ?? 0) * 100));
      }
      check();
    });
  }

  private buildNews(): void {
    const items: { icon: string; textFr: string; textEn: string }[] = [];

    if (this.pendingCount() > 0) {
      items.push({
        icon: 'bi-folder2-open',
        textFr: `${this.pendingCount()} dossier${this.pendingCount() > 1 ? 's' : ''} en attente de votre validation.`,
        textEn: `${this.pendingCount()} file${this.pendingCount() > 1 ? 's' : ''} awaiting your validation.`,
      });
    } else {
      items.push({
        icon: 'bi-check-circle-fill',
        textFr: 'Aucun dossier en attente — tout est à jour !',
        textEn: 'No pending files — you\'re all caught up!',
      });
    }

    if (this.riskCount() > 0) {
      items.push({
        icon: 'bi-exclamation-triangle-fill',
        textFr: `${this.riskCount()} client${this.riskCount() > 1 ? 's' : ''} identifié${this.riskCount() > 1 ? 's' : ''} à haut risque cette semaine.`,
        textEn: `${this.riskCount()} client${this.riskCount() > 1 ? 's' : ''} flagged as high risk this week.`,
      });
    }

    items.push({
      icon: 'bi-cpu-fill',
      textFr: 'Suivez la performance du modèle en direct dans Évolution IA.',
      textEn: 'Track live model performance in AI Evolution.',
    });

    items.push({
      icon: 'bi-robot',
      textFr: 'Astuce : posez vos questions réglementaires à l\'Assistant IA.',
      textEn: 'Tip: ask the AI Assistant your regulatory questions.',
    });

    items.push({
      icon: this.serverOk() ? 'bi-wifi' : 'bi-wifi-off',
      textFr: this.serverOk() ? 'Serveur IA opérationnel — tous les modèles sont en ligne.' : 'Serveur IA hors ligne — certaines fonctions sont indisponibles.',
      textEn: this.serverOk() ? 'AI server operational — all models are online.' : 'AI server offline — some features are unavailable.',
    });

    this.newsItems.set(items);
    this.newsIndex.set(0);
  }

  private countUp(sig: ReturnType<typeof signal<number>>, target: number, duration = 900): void {
    if (target === 0) { sig.set(0); return; }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      sig.set(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
