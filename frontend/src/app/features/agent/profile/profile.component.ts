import { Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <div class="pf-page">
      <div class="pf-card">
        <div class="pf-avatar-wrap">
          <div class="pf-avatar">{{ initiales() }}</div>
        </div>
        <h1 class="pf-title">{{ ts.isEn() ? 'My Profile' : 'Mon Profil' }}</h1>
        <p class="pf-sub">{{ ts.isEn() ? 'View and edit your personal information' : 'Consultez et modifiez vos informations personnelles' }}</p>

        <div class="pf-role-badge">
          <i class="bi bi-shield-fill"></i>
          {{ role() === 'admin' ? (ts.isEn() ? 'Administrator' : 'Administrateur') : (ts.isEn() ? 'Bank Agent' : 'Agent bancaire') }}
        </div>

        <form class="pf-form" (ngSubmit)="save()">
          <div class="pf-row">
            <div class="pf-field">
              <label>{{ ts.isEn() ? 'First name' : 'Prénom' }}</label>
              <input type="text" [(ngModel)]="prenom" name="prenom" required maxlength="100" />
            </div>
            <div class="pf-field">
              <label>{{ ts.isEn() ? 'Last name' : 'Nom' }}</label>
              <input type="text" [(ngModel)]="nom" name="nom" required maxlength="100" />
            </div>
          </div>

          <div class="pf-field">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required maxlength="150" />
          </div>

          <div class="pf-field pf-field-locked">
            <label>{{ ts.isEn() ? 'Password' : 'Mot de passe' }}</label>
            <div class="pf-locked-input">
              <span>••••••••••</span>
              <i class="bi bi-lock-fill" [title]="ts.isEn() ? 'Password cannot be changed here' : 'Le mot de passe ne peut pas être modifié ici'"></i>
            </div>
          </div>

          <div class="pf-msg pf-msg-ok" *ngIf="successMsg()">
            <i class="bi bi-check-circle-fill"></i>
            <span>{{ successMsg() }}</span>
          </div>
          <div class="pf-msg pf-msg-err" *ngIf="errorMsg()">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>{{ errorMsg() }}</span>
          </div>

          <button type="submit" class="pf-save-btn" [disabled]="saving()">
            <span *ngIf="!saving()"><i class="bi bi-check-lg"></i> {{ ts.isEn() ? 'Save changes' : 'Enregistrer les modifications' }}</span>
            <span *ngIf="saving()"><span class="pf-spinner"></span> {{ ts.isEn() ? 'Saving…' : 'Enregistrement…' }}</span>
          </button>
        </form>
      </div>

      <!-- ── Bank / institution info (read-only) ── -->
      <div class="pf-card pf-bank-card">
        <div class="pf-bank-ico"><i class="bi bi-bank2"></i></div>
        <h2 class="pf-bank-title">{{ ts.isEn() ? 'Institution' : 'Établissement bancaire' }}</h2>
        <p class="pf-sub">{{ ts.isEn() ? 'Information about the bank you work for' : 'Informations sur la banque pour laquelle vous travaillez' }}</p>

        <div class="pf-bank-list">
          <div class="pf-bank-row">
            <div class="pf-bank-row-ico"><i class="bi bi-building"></i></div>
            <div>
              <div class="pf-bank-lbl">{{ ts.isEn() ? 'Bank name' : 'Nom de la banque' }}</div>
              <div class="pf-bank-val">{{ bank.nom }}</div>
            </div>
          </div>
          <div class="pf-bank-row">
            <div class="pf-bank-row-ico"><i class="bi bi-envelope-fill"></i></div>
            <div>
              <div class="pf-bank-lbl">Email</div>
              <a class="pf-bank-val pf-bank-link" [href]="'mailto:' + bank.email">{{ bank.email }}</a>
            </div>
          </div>
          <div class="pf-bank-row">
            <div class="pf-bank-row-ico"><i class="bi bi-telephone-fill"></i></div>
            <div>
              <div class="pf-bank-lbl">{{ ts.isEn() ? 'Phone' : 'Téléphone' }}</div>
              <div class="pf-bank-val">{{ bank.telephone }}</div>
            </div>
          </div>
          <div class="pf-bank-row">
            <div class="pf-bank-row-ico"><i class="bi bi-geo-alt-fill"></i></div>
            <div>
              <div class="pf-bank-lbl">{{ ts.isEn() ? 'Address' : 'Adresse' }}</div>
              <div class="pf-bank-val">{{ bank.adresse }}</div>
            </div>
          </div>
          <div class="pf-bank-row">
            <div class="pf-bank-row-ico"><i class="bi bi-globe2"></i></div>
            <div>
              <div class="pf-bank-lbl">{{ ts.isEn() ? 'Website' : 'Site web' }}</div>
              <a class="pf-bank-val pf-bank-link" [href]="bank.siteWeb" target="_blank" rel="noopener">{{ ts.isEn() ? 'Visit website' : 'Voir le site' }}</a>
            </div>
          </div>
        </div>

        <div class="pf-bank-note">
          <i class="bi bi-info-circle"></i>
          {{ ts.isEn() ? 'These details are managed by the institution and cannot be edited here.' : 'Ces informations sont gérées par l\\'établissement et ne peuvent pas être modifiées ici.' }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    :host *, :host *::before, :host *::after { box-sizing: border-box; }
    .pf-page {
      display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start;
      gap: 20px; padding: 8px 0 24px;
    }
    .pf-card {
      width: 100%; max-width: 440px; background: #fff; border: 1px solid #e8edf6;
      border-radius: 22px; padding: 32px; text-align: center;
      animation: pf-in .4s cubic-bezier(.4,0,.2,1) backwards;
    }
    @keyframes pf-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .pf-avatar-wrap { display: flex; justify-content: center; margin-bottom: 14px; }
    .pf-avatar {
      width: 76px; height: 76px; border-radius: 50%;
      background: linear-gradient(135deg, #1E6FD9, #6c5ce7);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 26px;
    }
    .pf-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #152247; }
    .pf-sub { font-size: 13px; color: #6b7488; margin-top: 4px; }
    .pf-role-badge {
      display: inline-flex; align-items: center; gap: 6px; margin: 14px auto 0;
      background: #eef5ff; color: #1E6FD9; border: 1px solid #c4d9f5;
      font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 20px;
    }

    .pf-form { text-align: left; margin-top: 26px; display: flex; flex-direction: column; gap: 18px; }
    .pf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
    .pf-field { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
    .pf-field label {
      font-size: 11px; font-weight: 700; color: #8b95a7; text-transform: uppercase;
      letter-spacing: .05em; line-height: 1.2;
    }
    .pf-field input {
      box-sizing: border-box; width: 100%;
      padding: 11px 14px; border-radius: 11px; border: 1.5px solid #e8edf6;
      font-size: 14px; color: #152247; transition: border-color .15s, box-shadow .15s;
      font-family: 'DM Sans', sans-serif; background: #fbfcfe;
    }
    .pf-field input:focus { outline: none; border-color: #1E6FD9; background: #fff; box-shadow: 0 0 0 3px rgba(30,111,217,.1); }

    .pf-locked-input {
      box-sizing: border-box; width: 100%;
      display: flex; align-items: center; justify-content: space-between;
      padding: 11px 14px; border-radius: 11px; border: 1.5px solid #f0f4fb;
      background: #f8faff; color: #9aa1b3; font-size: 14px;
    }

    .pf-msg { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 11px; font-size: 12.5px; font-weight: 600; }
    .pf-msg-ok  { background: #d1fae5; color: #065f46; }
    .pf-msg-err { background: #fee2e2; color: #991b1b; }

    .pf-save-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #152247, #1E6FD9); color: #fff;
      font-size: 14px; font-weight: 700; cursor: pointer; transition: opacity .15s;
    }
    .pf-save-btn:hover:not(:disabled) { opacity: .9; }
    .pf-save-btn:disabled { opacity: .6; cursor: not-allowed; }
    .pf-spinner {
      display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.4);
      border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; vertical-align: middle;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Bank info card */
    .pf-bank-card { animation-delay: .1s; }
    .pf-bank-ico {
      width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 14px;
      background: linear-gradient(135deg, #152247, #2a3f73);
      color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px;
    }
    .pf-bank-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #152247; }

    .pf-bank-list { text-align: left; margin-top: 24px; display: flex; flex-direction: column; gap: 4px; }
    .pf-bank-row {
      display: flex; align-items: flex-start; gap: 12px; padding: 11px 8px; border-radius: 12px;
      transition: background .15s;
    }
    .pf-bank-row:hover { background: #f8faff; }
    .pf-bank-row-ico {
      width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0; margin-top: 1px;
      background: #eef5ff; color: #1E6FD9;
      display: flex; align-items: center; justify-content: center; font-size: 14px;
    }
    .pf-bank-lbl { font-size: 11px; font-weight: 700; color: #9aa1b3; text-transform: uppercase; letter-spacing: .03em; }
    .pf-bank-val { font-size: 13.5px; font-weight: 600; color: #152247; margin-top: 2px; display: block; }
    .pf-bank-link { text-decoration: none; }
    .pf-bank-link:hover { color: #1E6FD9; text-decoration: underline; }

    .pf-bank-note {
      display: flex; align-items: flex-start; gap: 8px; margin-top: 20px;
      padding: 11px 14px; background: #f8faff; border-radius: 12px;
      font-size: 11.5px; color: #8b95a7; text-align: left; line-height: 1.5;
    }
    .pf-bank-note i { margin-top: 1px; flex-shrink: 0; }

    @media (max-width: 520px) { .pf-row { grid-template-columns: 1fr; } .pf-card { padding: 24px; } }
  `]
})
export class ProfileComponent {
  nom = '';
  prenom = '';
  email = '';
  bank = environment.bankInfo;

  saving = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  constructor(private authService: AuthService, public ts: TranslationService) {
    const a = this.authService.agentConnecte();
    this.nom = a?.nom ?? '';
    this.prenom = a?.prenom ?? '';
    this.email = a?.email ?? '';
  }

  role(): string | undefined {
    return this.authService.agentConnecte()?.role;
  }

  initiales(): string {
    return `${this.prenom?.[0] ?? ''}${this.nom?.[0] ?? ''}`.toUpperCase() || '?';
  }

  save(): void {
    if (!this.nom.trim() || !this.prenom.trim() || !this.email.trim()) return;
    this.saving.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');

    this.authService.updateProfile(this.nom.trim(), this.prenom.trim(), this.email.trim()).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.success) {
          this.successMsg.set(this.ts.isEn() ? 'Profile updated successfully.' : 'Profil mis à jour avec succès.');
        } else {
          this.errorMsg.set(res.message || (this.ts.isEn() ? 'Update failed.' : 'Échec de la mise à jour.'));
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err?.error?.message || (this.ts.isEn() ? 'Update failed.' : 'Échec de la mise à jour.'));
      }
    });
  }
}
