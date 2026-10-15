import { Component, OnInit, signal } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-bi-evolution-ia',
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
  template: `
    <div class="ev-page-hd">
      <div class="ev-page-ico"><i class="bi bi-cpu-fill"></i></div>
      <div>
        <h1>{{ ts.isEn() ? 'AI Model Evolution' : 'Évolution IA' }}</h1>
        <p>{{ ts.isEn() ? 'Live performance monitoring of the credit scoring model' : 'Suivi en direct de la performance du modèle de scoring crédit' }}</p>
      </div>
    </div>

    <div class="ev-loading" *ngIf="loading()">
      <div class="ev-spinner"></div>
      <span>{{ ts.isEn() ? 'Loading metrics…' : 'Chargement des métriques…' }}</span>
    </div>

    <div class="ev-panels-grid" *ngIf="!loading()">
      <!-- ROC card -->
      <div class="ev-card ev-roc-card">
        <div class="ev-card-head">
          <div>
            <h2 class="ev-card-title">{{ ts.isEn() ? 'ROC Curve — Default Prediction' : 'Courbe ROC — Prévision de Défaut' }}</h2>
            <p class="ev-card-sub">AUC = {{ metrics()?.auc ?? '—' }} · {{ modelName() }} {{ ts.isEn() ? 'on granted credit requests' : 'sur demandes de crédit octroi' }}</p>
          </div>
          <span class="ev-badge-demo" *ngIf="metricsDemoMode()">{{ ts.isEn() ? 'DEMO' : 'DÉMO' }}</span>
        </div>

        <div class="roc-chart-wrap">
          <svg class="roc-svg" viewBox="0 0 460 300" preserveAspectRatio="xMidYMid meet">
            <g class="roc-grid">
              <line *ngFor="let g of gridLines" [attr.x1]="40" [attr.y1]="g.y" [attr.x2]="440" [attr.y2]="g.y" />
              <line *ngFor="let g of gridLinesV" [attr.x1]="g.x" [attr.y1]="20" [attr.x2]="g.x" [attr.y2]="260" />
            </g>
            <text *ngFor="let g of gridLines" [attr.x]="32" [attr.y]="g.y + 3" class="roc-axis-lbl" text-anchor="end">{{ g.label }}</text>
            <text *ngFor="let g of gridLinesV" [attr.x]="g.x" [attr.y]="274" class="roc-axis-lbl" text-anchor="middle">{{ g.label }}</text>

            <line x1="40" y1="260" x2="440" y2="20" class="roc-diag" stroke-dasharray="4 4" />
            <path [attr.d]="rocAreaPath()" class="roc-area" [class.drawn]="rocDrawn()" />
            <path [attr.d]="rocLinePath()" class="roc-line"
                  [style.strokeDasharray]="rocPathLength()"
                  [style.strokeDashoffset]="rocDrawn() ? 0 : rocPathLength()" />
            <circle *ngIf="rocDrawn()" [attr.cx]="rocLastPoint().x" [attr.cy]="rocLastPoint().y" r="4" class="roc-dot" />
          </svg>

          <div class="roc-legend">
            <span class="roc-legend-item"><span class="roc-dot-legend roc-dot-model"></span>{{ modelName() }} (AUC={{ metrics()?.auc ?? '—' }})</span>
            <span class="roc-legend-item"><span class="roc-dot-legend roc-dot-random"></span>{{ ts.isEn() ? 'Random' : 'Aléatoire' }} (AUC=0.5)</span>
          </div>
        </div>
      </div>

      <!-- Model KPI mini-cards -->
      <div class="ev-card ev-metrics-card">
        <h2 class="ev-card-title">{{ ts.isEn() ? 'Model Performance' : 'Performance du Modèle' }}</h2>
        <div class="mini-kpi-grid">
          <div class="mini-kpi">
            <div class="mini-kpi-ring" [style.--pct]="(metrics()?.precision ?? 0) * 100">
              <span>{{ pct(metrics()?.precision) }}%</span>
            </div>
            <div class="mini-kpi-lbl">{{ ts.isEn() ? 'Precision' : 'Précision' }}</div>
          </div>
          <div class="mini-kpi">
            <div class="mini-kpi-ring mini-kpi-green" [style.--pct]="(metrics()?.recall ?? 0) * 100">
              <span>{{ pct(metrics()?.recall) }}%</span>
            </div>
            <div class="mini-kpi-lbl">{{ ts.isEn() ? 'Recall' : 'Rappel' }}</div>
          </div>
          <div class="mini-kpi">
            <div class="mini-kpi-ring mini-kpi-purple" [style.--pct]="(metrics()?.f1 ?? 0) * 100">
              <span>{{ pct(metrics()?.f1) }}%</span>
            </div>
            <div class="mini-kpi-lbl">F1-Score</div>
          </div>
          <div class="mini-kpi">
            <div class="mini-kpi-ring mini-kpi-navy" [style.--pct]="(metrics()?.accuracy ?? 0) * 100">
              <span>{{ pct(metrics()?.accuracy) }}%</span>
            </div>
            <div class="mini-kpi-lbl">{{ ts.isEn() ? 'Accuracy' : 'Exactitude' }}</div>
          </div>
        </div>
        <div class="ev-metrics-foot">
          <i class="bi bi-database-fill"></i>
          {{ metrics()?.n_samples ?? 0 }} {{ ts.isEn() ? 'confirmed files analyzed' : 'dossiers confirmés analysés' }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ev-page-hd { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
    .ev-page-ico {
      width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0;
      background: linear-gradient(135deg, #152247, #6c5ce7); color: #fff;
      display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .ev-page-hd h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #152247; }
    .ev-page-hd p { font-size: 13.5px; color: #6b7488; margin-top: 3px; }

    .ev-loading { display: flex; align-items: center; gap: 12px; padding: 60px; justify-content: center; color: #6b7488; }
    .ev-spinner { width: 26px; height: 26px; border: 3px solid #e8edf6; border-top-color: #6c5ce7; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .ev-panels-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 18px; align-items: stretch; }
    .ev-card {
      background: #fff; border: 1px solid #e8edf6; border-radius: 20px; padding: 22px 24px;
      animation: card-in .5s cubic-bezier(.4,0,.2,1) backwards;
    }
    @keyframes card-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .ev-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
    .ev-card-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 15.5px; color: #152247; }
    .ev-card-sub { font-size: 12px; color: #9aa1b3; margin-top: 3px; }
    .ev-badge-demo { background: #fef3df; color: #d97706; font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 20px; letter-spacing: .04em; height: fit-content; }

    .roc-chart-wrap { display: flex; flex-direction: column; align-items: center; }
    .roc-svg { width: 100%; height: auto; max-height: 320px; }
    .roc-grid line { stroke: #eef2f9; stroke-width: 1; }
    .roc-axis-lbl { font-size: 9px; fill: #9aa1b3; font-family: 'DM Sans', sans-serif; }
    .roc-diag { stroke: #cbd5e1; stroke-width: 1.5; }
    .roc-area { fill: rgba(108,92,231,.10); opacity: 0; transition: opacity .6s ease .4s; }
    .roc-area.drawn { opacity: 1; }
    .roc-line {
      fill: none; stroke: #6c5ce7; stroke-width: 3; stroke-linecap: round;
      transition: stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1);
    }
    .roc-dot { fill: #6c5ce7; animation: roc-dot-pulse 1.6s ease-in-out infinite; }
    @keyframes roc-dot-pulse { 0%,100% { r: 4; opacity: 1; } 50% { r: 7; opacity: .4; } }

    .roc-legend { display: flex; gap: 20px; margin-top: 6px; }
    .roc-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #6b7488; font-weight: 600; }
    .roc-dot-legend { width: 9px; height: 9px; border-radius: 50%; }
    .roc-dot-model { background: #6c5ce7; }
    .roc-dot-random { background: #cbd5e1; }

    .ev-metrics-card { display: flex; flex-direction: column; }
    .mini-kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; flex: 1; }
    .mini-kpi { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .mini-kpi-ring {
      --pct: 0; width: 76px; height: 76px; border-radius: 50%;
      background: conic-gradient(#1E6FD9 calc(var(--pct) * 1%), #eef2f9 0);
      display: flex; align-items: center; justify-content: center;
      position: relative; animation: ring-grow 1.2s cubic-bezier(.4,0,.2,1) backwards;
    }
    @keyframes ring-grow { from { background: conic-gradient(#1E6FD9 0%, #eef2f9 0); } }
    .mini-kpi-ring::before { content: ''; position: absolute; inset: 7px; border-radius: 50%; background: #fff; }
    .mini-kpi-ring span { position: relative; z-index: 1; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 14px; color: #152247; }
    .mini-kpi-green  { background: conic-gradient(#10b981 calc(var(--pct) * 1%), #eef2f9 0); }
    .mini-kpi-purple { background: conic-gradient(#6c5ce7 calc(var(--pct) * 1%), #eef2f9 0); }
    .mini-kpi-navy   { background: conic-gradient(#152247 calc(var(--pct) * 1%), #eef2f9 0); }
    .mini-kpi-lbl { font-size: 11.5px; font-weight: 600; color: #6b7488; }
    .ev-metrics-foot {
      margin-top: 16px; padding-top: 14px; border-top: 1px solid #f0f4fb;
      font-size: 11.5px; color: #9aa1b3; display: flex; align-items: center; gap: 6px;
    }

    @media (max-width: 1100px) { .ev-panels-grid { grid-template-columns: 1fr; } .mini-kpi-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class BiEvolutionIaComponent implements OnInit {
  loading = signal(true);
  metrics = signal<{ auc: number; precision: number; recall: number; f1: number; accuracy: number; n_samples: number } | null>(null);
  metricsDemoMode = signal(false);
  modelName = signal('XGBoost');
  rocFpr: number[] = [];
  rocTpr: number[] = [];
  rocDrawn = signal(false);

  gridLines = [
    { y: 260, label: '0,0' }, { y: 212, label: '0,2' }, { y: 164, label: '0,4' },
    { y: 116, label: '0,6' }, { y: 68,  label: '0,8' }, { y: 20,  label: '1,0' },
  ];
  gridLinesV = [
    { x: 40, label: '0' }, { x: 120, label: '0.2' }, { x: 200, label: '0.4' },
    { x: 280, label: '0.6' }, { x: 360, label: '0.8' }, { x: 440, label: '1' },
  ];

  constructor(
    private authService: AuthService,
    public ts: TranslationService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void { this.loadMetrics(); }

  pct(v?: number | null): number { return v != null ? Math.round(v * 100) : 0; }

  private loadMetrics(): void {
    const token = this.authService.getAccessToken();
    if (!token) { this.loading.set(false); return; }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(`${environment.apiUrl}/octroi/model-metrics`, { headers }).subscribe({
      next: r => {
        const d = r?.data;
        if (d) {
          this.metrics.set(d.metrics);
          this.metricsDemoMode.set(!!d.demo_mode);
          this.modelName.set(d.model_name ?? 'XGBoost');
          this.rocFpr = d.roc_curve?.fpr ?? [];
          this.rocTpr = d.roc_curve?.tpr ?? [];
          setTimeout(() => this.rocDrawn.set(true), 150);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private toSvgPoints(): { x: number; y: number }[] {
    if (!this.rocFpr.length) return [{ x: 40, y: 260 }, { x: 440, y: 20 }];
    return this.rocFpr.map((fpr, i) => ({
      x: 40 + fpr * 400,
      y: 260 - (this.rocTpr[i] ?? 0) * 240,
    }));
  }

  rocLinePath(): string {
    const pts = this.toSvgPoints();
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  }

  rocAreaPath(): string {
    const pts = this.toSvgPoints();
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    return `${line} L 440 260 L 40 260 Z`;
  }

  rocPathLength(): number {
    const pts = this.toSvgPoints();
    let len = 0;
    for (let i = 1; i < pts.length; i++) {
      len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    }
    return len;
  }

  rocLastPoint(): { x: number; y: number } {
    const pts = this.toSvgPoints();
    return pts[pts.length - 1];
  }
}
