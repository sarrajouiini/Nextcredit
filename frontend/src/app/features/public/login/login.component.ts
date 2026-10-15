import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf, LogoComponent],
  template: `
    <div class="login-wrap">

      <!-- LEFT PANEL — visual -->
      <div class="login-left">
        <div class="ll-content">
          <a routerLink="/" class="ll-logo">
            <app-logo [size]="44"></app-logo>
            <span>NextCredit</span>
          </a>

          <div class="ll-hero">
            <h2>Tableau de bord intelligent pour l'agent bancaire</h2>
            <p>Accédez en temps réel aux décisions de crédit, alertes de risque et analyses comportementales propulsées par l'IA.</p>
          </div>

          <div class="ll-features">
            <div class="ll-feat">
              <div class="ll-feat-ico ll-ico-blue"><i class="bi bi-bank"></i></div>
              <div>
                <div class="ll-feat-title">Scoring d'Octroi</div>
                <div class="ll-feat-sub">Décisions crédit en temps réel</div>
              </div>
            </div>
            <div class="ll-feat">
              <div class="ll-feat-ico ll-ico-green"><i class="bi bi-graph-up-arrow"></i></div>
              <div>
                <div class="ll-feat-title">Analyse Comportementale</div>
                <div class="ll-feat-sub">Détection précoce des risques</div>
              </div>
            </div>
            <div class="ll-feat">
              <div class="ll-feat-ico ll-ico-purple"><i class="bi bi-robot"></i></div>
              <div>
                <div class="ll-feat-title">Assistant IA</div>
                <div class="ll-feat-sub">Chatbot bancaire intelligent</div>
              </div>
            </div>
          </div>

          <div class="ll-stats">
            <div class="ll-stat">
              <div class="ll-stat-val">98%</div>
              <div class="ll-stat-lbl">Précision IA</div>
            </div>
            <div class="ll-stat-sep"></div>
            <div class="ll-stat">
              <div class="ll-stat-val">&lt;2s</div>
              <div class="ll-stat-lbl">Temps réponse</div>
            </div>
            <div class="ll-stat-sep"></div>
            <div class="ll-stat">
              <div class="ll-stat-val">24/7</div>
              <div class="ll-stat-lbl">Disponibilité</div>
            </div>
          </div>
        </div>

        <!-- Decorative blobs -->
        <div class="ll-blob ll-blob1"></div>
        <div class="ll-blob ll-blob2"></div>
      </div>

      <!-- RIGHT PANEL — form -->
      <div class="login-right">
        <div class="lr-inner">

          <div class="lr-top">
            <div class="lr-badge">
              <i class="bi bi-shield-lock-fill"></i>
              Accès sécurisé
            </div>
          </div>

          <div class="lr-header">
            <h1>Connexion</h1>
            <p>Espace réservé aux agents bancaires NextCredit</p>
          </div>

          <form (ngSubmit)="seConnecter()" class="lr-form" autocomplete="on">

            <div class="lr-field" [class.has-value]="email">
              <label for="nc-email">
                <i class="bi bi-envelope"></i>
                Adresse e-mail
              </label>
              <input
                id="nc-email"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="agent@nextcredit.tn"
                required
                autocomplete="email"
                (focus)="clearError()"
              />
            </div>

            <div class="lr-field" [class.has-value]="motDePasse">
              <label for="nc-pwd">
                <i class="bi bi-lock"></i>
                Mot de passe
              </label>
              <div class="lr-pwd-wrap">
                <input
                  id="nc-pwd"
                  [type]="showPwd ? 'text' : 'password'"
                  [(ngModel)]="motDePasse"
                  name="motDePasse"
                  placeholder="••••••••"
                  required
                  autocomplete="current-password"
                  (focus)="clearError()"
                />
                <button type="button" class="lr-eye" (click)="showPwd = !showPwd" tabindex="-1">
                  <i class="bi" [class.bi-eye]="!showPwd" [class.bi-eye-slash]="showPwd"></i>
                </button>
              </div>
            </div>

            <div class="lr-error" *ngIf="erreur()">
              <i class="bi bi-exclamation-circle-fill"></i>
              {{ erreur() }}
            </div>

            <button type="submit" class="lr-submit" [disabled]="chargement() || !email || !motDePasse">
              <span class="lr-submit-spinner" *ngIf="chargement()"></span>
              <i class="bi bi-box-arrow-in-right" *ngIf="!chargement()"></i>
              {{ chargement() ? 'Connexion en cours…' : 'Se connecter' }}
            </button>
          </form>

          <div class="lr-divider">
            <span>ou</span>
          </div>

          <a routerLink="/" class="lr-back">
            <i class="bi bi-arrow-left"></i>
            Retour au site NextCredit
          </a>

          <div class="lr-footer">
            <i class="bi bi-shield-check"></i>
            Connexion chiffrée · Données protégées
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .login-wrap {
      min-height: 100vh;
      display: flex;
    }

    /* ——— LEFT PANEL ——— */
    .login-left {
      flex: 1;
      background: linear-gradient(145deg, #0f1d3d 0%, #152247 40%, #1a3060 70%, #1E6FD9 100%);
      padding: 48px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .ll-content { position: relative; z-index: 2; display: flex; flex-direction: column; height: 100%; }

    .ll-logo {
      display: flex; align-items: center; gap: 12px;
      text-decoration: none; margin-bottom: auto;
    }
    .ll-logo span {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 20px; color: #fff;
    }

    .ll-hero {
      margin: auto 0 40px;
    }
    .ll-hero h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: clamp(22px, 2.5vw, 32px);
      color: #fff; line-height: 1.25;
      margin-bottom: 14px;
    }
    .ll-hero p {
      font-size: 15px; color: rgba(255,255,255,.7);
      line-height: 1.6; max-width: 380px;
    }

    .ll-features { display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
    .ll-feat {
      display: flex; align-items: center; gap: 14px;
      background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1);
      border-radius: 14px; padding: 14px 16px;
      backdrop-filter: blur(6px);
      animation: fadeSlide .5s ease both;
    }
    .ll-feat:nth-child(2) { animation-delay: .1s; }
    .ll-feat:nth-child(3) { animation-delay: .2s; }
    @keyframes fadeSlide { from { opacity:0; transform: translateX(-16px); } to { opacity:1; transform: none; } }

    .ll-feat-ico {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .ll-ico-blue   { background: rgba(30,111,217,.35); color: #7cb9ff; }
    .ll-ico-green  { background: rgba(16,185,129,.25); color: #6ee7b7; }
    .ll-ico-purple { background: rgba(108,92,231,.3);  color: #c4b5fd; }
    .ll-feat-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13.5px; color: #fff; }
    .ll-feat-sub   { font-size: 11.5px; color: rgba(255,255,255,.5); margin-top: 2px; }

    .ll-stats {
      display: flex; align-items: center; gap: 0;
      background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
      border-radius: 14px; padding: 16px 20px;
    }
    .ll-stat { flex: 1; text-align: center; }
    .ll-stat-val { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 22px; color: #fff; }
    .ll-stat-lbl  { font-size: 11px; color: rgba(255,255,255,.5); margin-top: 3px; }
    .ll-stat-sep  { width: 1px; height: 36px; background: rgba(255,255,255,.15); flex-shrink: 0; }

    /* Decorative blobs */
    .ll-blob {
      position: absolute; border-radius: 50%;
      filter: blur(80px); pointer-events: none; z-index: 1;
    }
    .ll-blob1 { width: 360px; height: 360px; top: -100px; right: -100px; background: rgba(30,111,217,.25); }
    .ll-blob2 { width: 280px; height: 280px; bottom: -80px; left: -60px;  background: rgba(108,92,231,.2); }

    /* ——— RIGHT PANEL ——— */
    .login-right {
      width: 480px; flex-shrink: 0;
      background: #f8faff;
      display: flex; align-items: center; justify-content: center;
      padding: 48px 40px;
    }

    .lr-inner { width: 100%; max-width: 380px; }

    .lr-top { margin-bottom: 28px; }
    .lr-badge {
      display: inline-flex; align-items: center; gap: 7px;
      background: #deeeff; color: #1E6FD9;
      font-size: 12px; font-weight: 700;
      padding: 6px 14px; border-radius: 20px;
    }

    .lr-header { margin-bottom: 32px; }
    .lr-header h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 28px; color: #152247;
      margin-bottom: 6px;
    }
    .lr-header p { font-size: 14px; color: #6b7488; }

    .lr-form { display: flex; flex-direction: column; gap: 18px; }

    .lr-field {}
    .lr-field label {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 700; color: #6b7488;
      text-transform: uppercase; letter-spacing: .05em;
      margin-bottom: 8px;
    }
    .lr-field label i { font-size: 13px; }
    .lr-field input {
      width: 100%; height: 48px;
      padding: 0 16px;
      border: 1.5px solid #e8edf6;
      border-radius: 13px;
      font-size: 14.5px; color: #152247;
      background: #fff;
      outline: none;
      transition: border-color .18s, box-shadow .18s;
      box-sizing: border-box;
    }
    .lr-field input:focus {
      border-color: #1E6FD9;
      box-shadow: 0 0 0 3px rgba(30,111,217,.12);
    }
    .lr-field input::placeholder { color: #c0c8d9; }

    .lr-pwd-wrap { position: relative; }
    .lr-pwd-wrap input { padding-right: 48px; }
    .lr-eye {
      position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: #9aa1b3; font-size: 16px; padding: 4px; line-height: 1;
    }
    .lr-eye:hover { color: #152247; }

    .lr-error {
      display: flex; align-items: center; gap: 9px;
      background: #fff1f2; border: 1px solid #fca5a5; border-radius: 12px;
      padding: 12px 14px; color: #b91c1c; font-size: 13px; font-weight: 500;
      animation: shake .35s ease;
    }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }

    .lr-submit {
      width: 100%; height: 50px;
      background: linear-gradient(135deg, #1E6FD9 0%, #1557b0 100%);
      color: #fff; border: none; border-radius: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700; font-size: 15px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 9px;
      transition: opacity .2s, transform .15s, box-shadow .2s;
      box-shadow: 0 4px 18px rgba(30,111,217,.35);
      margin-top: 4px;
    }
    .lr-submit:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(30,111,217,.4); }
    .lr-submit:disabled { opacity: .5; cursor: not-allowed; box-shadow: none; }

    .lr-submit-spinner {
      width: 16px; height: 16px;
      border: 2.5px solid rgba(255,255,255,.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin .65s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .lr-divider {
      display: flex; align-items: center; gap: 12px;
      margin: 24px 0;
      color: #c0c8d9; font-size: 12px;
    }
    .lr-divider::before, .lr-divider::after {
      content: ''; flex: 1; height: 1px; background: #e8edf6;
    }

    .lr-back {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      height: 48px; border-radius: 13px;
      border: 1.5px solid #e8edf6; background: #fff;
      font-size: 13.5px; font-weight: 600; color: #152247;
      text-decoration: none;
      transition: border-color .18s, background .18s;
    }
    .lr-back:hover { border-color: #1E6FD9; background: #f0f7ff; color: #1E6FD9; }

    .lr-footer {
      display: flex; align-items: center; justify-content: center; gap: 7px;
      margin-top: 28px; font-size: 12px; color: #9aa1b3;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .login-left { display: none; }
      .login-right { width: 100%; padding: 32px 24px; }
    }
  `],
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  showPwd = false;
  erreur = signal<string | null>(null);
  chargement = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    public ts: TranslationService
  ) {}

  clearError(): void { this.erreur.set(null); }

  seConnecter(): void {
    if (!this.email || !this.motDePasse) {
      this.erreur.set('Veuillez remplir tous les champs.');
      return;
    }
    this.chargement.set(true);
    this.erreur.set(null);

    this.authService.login(this.email, this.motDePasse).subscribe({
      next: (res) => {
        this.chargement.set(false);
        if (res.success) {
          this.router.navigate(['/agent/dashboard']);
        } else {
          this.erreur.set(res.message || 'Identifiants incorrects.');
        }
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message || 'Email ou mot de passe incorrect.');
      },
    });
  }
}
