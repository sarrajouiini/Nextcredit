import { Component, OnInit, signal } from '@angular/core';
import { NgIf, NgFor, NgClass, DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { environment } from '../../../../environments/environment';

interface Alerte { type: string; message: string; severite: string; }

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DecimalPipe],
  template: `
    <div class="mo-header">
      <div class="mo-header-ico"><i class="bi bi-activity"></i></div>
      <div class="mo-header-text">
        <h1>{{ ts.isEn() ? 'AI Model Monitoring' : 'Monitoring des modèles IA' }}</h1>
        <p>{{ ts.isEn() ? 'Detect prediction drift before it affects your portfolio' : 'Détectez la dérive des prédictions avant qu\\'elle n\\'affecte votre portefeuille' }}</p>
      </div>
      <button class="mo-refresh" (click)="load()" [disabled]="loading()">
        <i class="bi bi-arrow-clockwise" [class.spin]="loading()"></i>
        {{ ts.isEn() ? 'Refresh' : 'Actualiser' }}
      </button>
    </div>

    <!-- Loading -->
    <div class="mo-loading" *ngIf="loading()">
      <div class="mo-spinner"></div>
      <span>{{ ts.isEn() ? 'Analyzing model drift…' : 'Analyse de la dérive du modèle…' }}</span>
    </div>

    <!-- Unavailable -->
    <div class="mo-warn" *ngIf="!loading() && unavailable()">
      <i class="bi bi-wifi-off"></i>
      {{ ts.isEn() ? 'Monitoring data temporarily unavailable.' : 'Données de monitoring temporairement indisponibles.' }}
    </div>

    <ng-container *ngIf="!loading() && !unavailable()">

      <!-- Global status banner -->
      <div class="mo-status-band" [ngClass]="statusClass()">
        <div class="mo-status-ico"><i class="bi" [ngClass]="statusIcon()"></i></div>
        <div>
          <div class="mo-status-lbl">{{ ts.isEn() ? 'Global status' : 'Statut global' }}</div>
          <div class="mo-status-val">{{ statutLabel() }}</div>
        </div>
        <div class="mo-status-count" *ngIf="nbAlertes() > 0">
          {{ nbAlertes() }} {{ ts.isEn() ? 'alert(s)' : 'alerte(s)' }}
        </div>
      </div>

      <!-- Alerts list -->
      <div class="mo-alerts" *ngIf="alertes().length > 0">
        <div class="mo-alert-row" *ngFor="let a of alertes()" [ngClass]="a.severite === 'CRITIQUE' ? 'mo-alert-crit' : 'mo-alert-warn'">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span>{{ a.message }}</span>
        </div>
        <div class="mo-alert-row mo-alert-warn" *ngIf="predAlerte()">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span>PSI = {{ psiScore() | number:'1.3-3' }} — {{ interpretationPsi() }}</span>
        </div>
      </div>

      <div class="mo-panels-grid">

        <!-- Performance drift -->
        <div class="mo-card">
          <div class="mo-card-head">
            <h2>{{ ts.isEn() ? 'Performance Drift' : 'Dérive de Performance' }}</h2>
            <p>{{ ts.isEn() ? 'Based on agent overrides — last 90 days' : 'Basé sur les overrides agent — 90 derniers jours' }}</p>
          </div>

          <div class="mo-empty" *ngIf="perfEmpty()">
            <i class="bi bi-inbox"></i>
            <span>{{ ts.isEn() ? 'No agent decisions recorded yet' : 'Aucune décision agent enregistrée' }}</span>
          </div>

          <ng-container *ngIf="!perfEmpty()">
            <div class="mo-kpi-row">
              <div class="mo-kpi">
                <div class="mo-kpi-val" [ngClass]="pctOverride() > 20 ? 'mo-val-danger' : 'mo-val-ok'">{{ pctOverride() }}%</div>
                <div class="mo-kpi-lbl">{{ ts.isEn() ? 'Override rate' : 'Taux d\\'override' }}</div>
              </div>
              <div class="mo-kpi">
                <div class="mo-kpi-val">{{ scoreMoyen() }}</div>
                <div class="mo-kpi-lbl">{{ ts.isEn() ? 'Avg. score' : 'Score moyen' }}</div>
              </div>
              <div class="mo-kpi">
                <div class="mo-kpi-val" [ngClass]="deltaScore() < 0 ? 'mo-val-danger' : 'mo-val-ok'">
                  {{ deltaScore() > 0 ? '+' : '' }}{{ deltaScore() }}
                </div>
                <div class="mo-kpi-lbl">{{ ts.isEn() ? 'Δ score (recent vs older)' : 'Δ score (récent vs ancien)' }}</div>
              </div>
            </div>

            <div class="mo-dist">
              <div class="mo-dist-lbl">{{ ts.isEn() ? 'Model decision distribution' : 'Répartition des décisions modèle' }}</div>
              <div class="mo-dist-bar">
                <div class="mo-dist-seg mo-seg-ok" [style.width.%]="distPct('approuves')" [title]="'Approuvés: ' + distribution().approuves"></div>
                <div class="mo-dist-seg mo-seg-warn" [style.width.%]="distPct('revues')" [title]="'Revues: ' + distribution().revues"></div>
                <div class="mo-dist-seg mo-seg-danger" [style.width.%]="distPct('refuses')" [title]="'Refusés: ' + distribution().refuses"></div>
              </div>
              <div class="mo-dist-legend">
                <span><i class="mo-dot mo-seg-ok"></i>{{ ts.isEn() ? 'Approved' : 'Approuvés' }} ({{ distribution().approuves }})</span>
                <span><i class="mo-dot mo-seg-warn"></i>{{ ts.isEn() ? 'Manual review' : 'Revue manuelle' }} ({{ distribution().revues }})</span>
                <span><i class="mo-dot mo-seg-danger"></i>{{ ts.isEn() ? 'Rejected' : 'Refusés' }} ({{ distribution().refuses }})</span>
              </div>
            </div>

            <div class="mo-reco">
              <i class="bi bi-lightbulb-fill"></i>
              {{ recommandation() }}
            </div>
          </ng-container>
        </div>

        <!-- Prediction drift (PSI) -->
        <div class="mo-card">
          <div class="mo-card-head">
            <h2>{{ ts.isEn() ? 'Prediction Drift (PSI)' : 'Dérive des Prédictions (PSI)' }}</h2>
            <p>{{ ts.isEn() ? 'Score distribution — last 30 vs previous 30 days' : 'Distribution des scores — 30 derniers jours vs 30 précédents' }}</p>
          </div>

          <div class="mo-empty" *ngIf="predUnavailable()">
            <i class="bi bi-inbox"></i>
            <span>{{ predMessage() }}</span>
          </div>

          <ng-container *ngIf="!predUnavailable()">
            <div class="mo-psi-gauge">
              <div class="mo-psi-track">
                <div class="mo-psi-fill" [ngClass]="psiClass()" [style.width.%]="psiPct()"></div>
                <div class="mo-psi-mark" style="left:50%"></div>
              </div>
              <div class="mo-psi-labels">
                <span>0.0 {{ ts.isEn() ? 'stable' : 'stable' }}</span>
                <span>0.2 {{ ts.isEn() ? 'drift' : 'dérive' }}</span>
                <span>0.4+</span>
              </div>
              <div class="mo-psi-val" [ngClass]="psiClass()">PSI = {{ psiScore() | number:'1.3-3' }}</div>
              <div class="mo-psi-interp">{{ interpretationPsi() }}</div>
            </div>

            <div class="mo-compare-grid">
              <div class="mo-compare-col">
                <div class="mo-compare-title">{{ ts.isEn() ? 'Previous period' : 'Période ancienne' }}</div>
                <div class="mo-compare-val">{{ scoreMoyenAncien() }}</div>
                <div class="mo-compare-sub">{{ ts.isEn() ? 'avg. score' : 'score moyen' }}</div>
                <div class="mo-compare-val mo-compare-val-sm">{{ pdMoyenneAncienne() }}%</div>
                <div class="mo-compare-sub">{{ ts.isEn() ? 'avg. PD' : 'PD moyenne' }}</div>
              </div>
              <div class="mo-compare-arrow"><i class="bi bi-arrow-right"></i></div>
              <div class="mo-compare-col">
                <div class="mo-compare-title">{{ ts.isEn() ? 'Recent period' : 'Période récente' }}</div>
                <div class="mo-compare-val">{{ scoreMoyenRecent() }}</div>
                <div class="mo-compare-sub">{{ ts.isEn() ? 'avg. score' : 'score moyen' }}</div>
                <div class="mo-compare-val mo-compare-val-sm">{{ pdMoyenneRecente() }}%</div>
                <div class="mo-compare-sub">{{ ts.isEn() ? 'avg. PD' : 'PD moyenne' }}</div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    :host { display: block; }
    .mo-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
    .mo-header-ico {
      width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0;
      background: linear-gradient(135deg, #152247, #6c5ce7); color: #fff;
      display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .mo-header-text { flex: 1; }
    .mo-header-text h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #152247; }
    .mo-header-text p { font-size: 13.5px; color: #6b7488; margin-top: 3px; }
    .mo-refresh { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 12px; border: 1.5px solid #e8edf6; background: #fff; color: #152247; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .15s; }
    .mo-refresh:hover { border-color: #6c5ce7; color: #6c5ce7; }
    .spin { animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .mo-loading { display: flex; align-items: center; gap: 12px; padding: 60px; justify-content: center; color: #6b7488; }
    .mo-spinner { width: 26px; height: 26px; border: 3px solid #e8edf6; border-top-color: #6c5ce7; border-radius: 50%; animation: spin .7s linear infinite; }
    .mo-warn { background: #fee2e2; border: 1px solid #fca5a5; border-radius: 14px; padding: 18px 22px; color: #b91c1c; display: flex; align-items: center; gap: 10px; font-size: 13.5px; }

    .mo-status-band { display: flex; align-items: center; gap: 16px; border-radius: 18px; padding: 18px 24px; margin-bottom: 16px; }
    .mo-status-ico { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
    .mo-status-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; opacity: .7; }
    .mo-status-val { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 18px; }
    .mo-status-count { margin-left: auto; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 20px; background: rgba(255,255,255,.5); }
    .mo-status-ok { background: #d1fae5; color: #065f46; }
    .mo-status-ok .mo-status-ico { background: rgba(255,255,255,.6); color: #10b981; }
    .mo-status-warn { background: #fef9c3; color: #854d0e; }
    .mo-status-warn .mo-status-ico { background: rgba(255,255,255,.6); color: #f59e0b; }
    .mo-status-crit { background: #fee2e2; color: #991b1b; }
    .mo-status-crit .mo-status-ico { background: rgba(255,255,255,.6); color: #ef4444; }

    .mo-alerts { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
    .mo-alert-row { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; }
    .mo-alert-warn { background: #fff3e0; color: #92400e; }
    .mo-alert-crit { background: #fee2e2; color: #991b1b; }

    .mo-panels-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .mo-card { background: #fff; border: 1px solid #e8edf6; border-radius: 20px; padding: 22px 24px; }
    .mo-card-head h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 15.5px; color: #152247; }
    .mo-card-head p { font-size: 12px; color: #9aa1b3; margin-top: 3px; margin-bottom: 18px; }

    .mo-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px 0; color: #9aa1b3; font-size: 13px; }
    .mo-empty i { font-size: 32px; }

    .mo-kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
    .mo-kpi { text-align: center; background: #f8faff; border-radius: 12px; padding: 14px 8px; }
    .mo-kpi-val { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #152247; }
    .mo-val-ok { color: #10b981; }
    .mo-val-danger { color: #ef4444; }
    .mo-kpi-lbl { font-size: 10.5px; color: #9aa1b3; margin-top: 4px; }

    .mo-dist-lbl { font-size: 12px; font-weight: 700; color: #6b7488; margin-bottom: 8px; }
    .mo-dist-bar { display: flex; height: 12px; border-radius: 20px; overflow: hidden; background: #f0f4fb; margin-bottom: 10px; }
    .mo-dist-seg { height: 100%; transition: width .5s ease; }
    .mo-seg-ok { background: #10b981; }
    .mo-seg-warn { background: #f59e0b; }
    .mo-seg-danger { background: #ef4444; }
    .mo-dist-legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 11.5px; color: #6b7488; }
    .mo-dist-legend span { display: flex; align-items: center; gap: 5px; }
    .mo-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

    .mo-reco { display: flex; align-items: flex-start; gap: 8px; margin-top: 18px; padding: 12px 14px; background: #f8faff; border-radius: 12px; font-size: 12.5px; color: #4b5568; line-height: 1.5; }
    .mo-reco i { color: #f59e0b; margin-top: 1px; flex-shrink: 0; }

    .mo-psi-gauge { margin-bottom: 22px; }
    .mo-psi-track { position: relative; height: 10px; border-radius: 20px; background: linear-gradient(90deg, #10b981, #f59e0b 50%, #ef4444 100%); margin-bottom: 8px; }
    .mo-psi-fill { display: none; }
    .mo-psi-mark { position: absolute; top: -3px; width: 2px; height: 16px; background: #152247; }
    .mo-psi-labels { display: flex; justify-content: space-between; font-size: 10.5px; color: #9aa1b3; margin-bottom: 14px; }
    .mo-psi-val { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 18px; }
    .mo-psi-interp { font-size: 12.5px; color: #6b7488; margin-top: 2px; }
    .mo-psi-ok { color: #10b981; }
    .mo-psi-warn { color: #f59e0b; }
    .mo-psi-danger { color: #ef4444; }

    .mo-compare-grid { display: flex; align-items: center; gap: 14px; }
    .mo-compare-col { flex: 1; text-align: center; background: #f8faff; border-radius: 14px; padding: 16px 10px; }
    .mo-compare-title { font-size: 10.5px; font-weight: 700; color: #9aa1b3; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 8px; }
    .mo-compare-val { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #152247; }
    .mo-compare-val-sm { font-size: 15px; margin-top: 10px; }
    .mo-compare-sub { font-size: 10.5px; color: #9aa1b3; }
    .mo-compare-arrow { color: #cbd5e1; font-size: 18px; flex-shrink: 0; }

    @media (max-width: 1000px) { .mo-panels-grid { grid-template-columns: 1fr; } }
  `]
})
export class MonitoringComponent implements OnInit {
  loading = signal(true);
  unavailable = signal(false);
  rapport = signal<any>(null);

  constructor(
    private authService: AuthService,
    public ts: TranslationService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.unavailable.set(false);
    const token = this.authService.getAccessToken();
    if (!token) { this.loading.set(false); this.unavailable.set(true); return; }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(`${environment.apiUrl}/monitoring/rapport`, { headers }).pipe(
      timeout(20000),
      catchError(() => of(null))
    ).subscribe(r => {
      this.loading.set(false);
      if (r?.success && r.data) this.rapport.set(r.data);
      else this.unavailable.set(true);
    });
  }

  statutLabel(): string { return this.rapport()?.statut_global ?? '—'; }
  nbAlertes(): number { return this.rapport()?.nb_alertes ?? 0; }
  statusClass(): string {
    const s = this.rapport()?.statut_global;
    return s === 'CRITIQUE' ? 'mo-status-crit' : s === 'ATTENTION' ? 'mo-status-warn' : 'mo-status-ok';
  }
  statusIcon(): string {
    const s = this.rapport()?.statut_global;
    return s === 'CRITIQUE' ? 'bi-x-octagon-fill' : s === 'ATTENTION' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill';
  }

  private perf(): any { return this.rapport()?.performance ?? {}; }
  private pred(): any { return this.rapport()?.prediction_drift ?? {}; }

  perfEmpty(): boolean { return !!this.perf().message; }
  alertes(): Alerte[] { return this.perf().alertes ?? []; }
  pctOverride(): number { return this.perf().pct_override ?? 0; }
  scoreMoyen(): number { return this.perf().score_moyen ?? 0; }
  deltaScore(): number { return this.perf().delta_score_recent_vs_ancien ?? 0; }
  distribution(): { approuves: number; refuses: number; revues: number } {
    return this.perf().distribution_modele ?? { approuves: 0, refuses: 0, revues: 0 };
  }
  distPct(key: 'approuves' | 'refuses' | 'revues'): number {
    const d = this.distribution();
    const total = d.approuves + d.refuses + d.revues;
    return total ? Math.round((d[key] / total) * 100) : 0;
  }
  recommandation(): string { return this.perf().recommandation ?? ''; }

  predUnavailable(): boolean { return !!this.pred().message || !!this.pred().error; }
  predMessage(): string { return this.pred().message ?? this.pred().error ?? ''; }
  predAlerte(): boolean { return !!this.pred().alerte; }
  psiScore(): number { return this.pred().psi_score ?? 0; }
  psiPct(): number { return Math.min(100, (this.psiScore() / 0.4) * 100); }
  psiClass(): string {
    const psi = this.psiScore();
    return psi >= 0.2 ? 'mo-psi-danger' : psi >= 0.1 ? 'mo-psi-warn' : 'mo-psi-ok';
  }
  interpretationPsi(): string { return this.pred().interpretation_psi ?? ''; }
  scoreMoyenRecent(): number { return this.pred().score_moyen_recent ?? 0; }
  scoreMoyenAncien(): number { return this.pred().score_moyen_ancien ?? 0; }
  pdMoyenneRecente(): number { return this.pred().pd_moyenne_recente ?? 0; }
  pdMoyenneAncienne(): number { return this.pred().pd_moyenne_ancienne ?? 0; }
}
