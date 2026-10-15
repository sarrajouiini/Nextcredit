import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor, NgClass, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AgentAccount, PlanInfo } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-admin-comptes',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, SlicePipe],
  template: `
    <div class="ac-header">
      <div>
        <h1>{{ ts.isEn() ? 'Account Management' : 'Gestion des comptes' }}</h1>
        <p>{{ ts.isEn() ? 'Create, edit or remove banking agent accounts' : 'Créez, modifiez ou supprimez les comptes des agents bancaires' }}</p>
      </div>
      <button class="ac-new-btn" (click)="openCreate()" [disabled]="atLimit()">
        <i class="bi bi-person-plus-fill"></i> {{ ts.isEn() ? 'New account' : 'Nouveau compte' }}
      </button>
    </div>

    <!-- Plan card -->
    <div class="ac-plan-card" *ngIf="plan()">
      <div class="ac-plan-left">
        <div class="ac-plan-ico"><i class="bi bi-award-fill"></i></div>
        <div>
          <div class="ac-plan-name">{{ ts.isEn() ? 'Plan' : 'Plan' }} {{ plan()!.label }}</div>
          <div class="ac-plan-sub">
            {{ activeCount() }} / {{ plan()!.agent_limit }} {{ ts.isEn() ? 'accounts used' : 'comptes utilisés' }}
          </div>
        </div>
      </div>
      <div class="ac-plan-bar-wrap">
        <div class="ac-plan-bar-track">
          <div class="ac-plan-bar-fill" [class.ac-plan-bar-full]="atLimit()" [style.width.%]="planPct()"></div>
        </div>
      </div>
      <button class="ac-plan-change-btn" (click)="openPlanPicker()">
        {{ ts.isEn() ? 'Change plan' : 'Changer de plan' }}
      </button>
    </div>

    <div class="ac-warn" *ngIf="atLimit()">
      <i class="bi bi-exclamation-triangle-fill"></i>
      {{ ts.isEn() ? 'Account limit reached for this plan. Upgrade to add more.' : 'Limite de comptes atteinte pour ce plan. Passez à un plan supérieur pour en ajouter.' }}
    </div>

    <!-- Loading -->
    <div class="ac-loading" *ngIf="loading()">
      <div class="ac-spinner"></div>
      <span>{{ ts.isEn() ? 'Loading accounts…' : 'Chargement des comptes…' }}</span>
    </div>

    <!-- Table -->
    <div class="ac-table-wrap" *ngIf="!loading()">
      <table class="ac-table">
        <thead>
          <tr>
            <th>{{ ts.isEn() ? 'Name' : 'Nom' }}</th>
            <th>Email</th>
            <th>{{ ts.isEn() ? 'Role' : 'Rôle' }}</th>
            <th>{{ ts.isEn() ? 'Status' : 'Statut' }}</th>
            <th>{{ ts.isEn() ? 'Last login' : 'Dernière connexion' }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of agents()" [class.ac-row-self]="isSelf(a)">
            <td class="ac-cell-name">
              <div class="ac-avatar">{{ a.Prenom[0] }}{{ a.Nom[0] }}</div>
              <span>{{ a.Prenom }} {{ a.Nom }}</span>
              <span class="ac-self-badge" *ngIf="isSelf(a)">{{ ts.isEn() ? 'You' : 'Vous' }}</span>
            </td>
            <td>{{ a.Email }}</td>
            <td>
              <span class="ac-role-badge" [ngClass]="a.Role === 'admin' ? 'ac-role-admin' : 'ac-role-agent'">
                {{ a.Role === 'admin' ? (ts.isEn() ? 'Administrator' : 'Administrateur') : (ts.isEn() ? 'Agent' : 'Agent') }}
              </span>
            </td>
            <td>
              <span class="ac-status-badge" [ngClass]="a.Actif ? 'ac-status-on' : 'ac-status-off'">
                <span class="ac-status-dot"></span>
                {{ a.Actif ? (ts.isEn() ? 'Active' : 'Actif') : (ts.isEn() ? 'Disabled' : 'Désactivé') }}
              </span>
            </td>
            <td class="ac-cell-date">{{ a.Derniere_Connexion ? (a.Derniere_Connexion | slice:0:10) : '—' }}</td>
            <td class="ac-cell-actions">
              <button class="ac-icon-btn" (click)="openEdit(a)" [title]="ts.isEn() ? 'Edit' : 'Modifier'"><i class="bi bi-pencil"></i></button>
              <button class="ac-icon-btn" (click)="openResetPwd(a)" [title]="ts.isEn() ? 'Reset password' : 'Réinitialiser mot de passe'"><i class="bi bi-key-fill"></i></button>
              <button class="ac-icon-btn ac-icon-btn-danger" (click)="confirmDelete(a)" [disabled]="isSelf(a)" [title]="ts.isEn() ? 'Delete' : 'Supprimer'"><i class="bi bi-trash-fill"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Create/Edit modal ── -->
    <div class="ac-modal-backdrop" *ngIf="showForm()" (click)="closeForm()">
      <div class="ac-modal" (click)="$event.stopPropagation()">
        <h2>{{ editing() ? (ts.isEn() ? 'Edit account' : 'Modifier le compte') : (ts.isEn() ? 'New account' : 'Nouveau compte') }}</h2>

        <div class="ac-form-row">
          <div class="ac-field">
            <label>{{ ts.isEn() ? 'First name' : 'Prénom' }}</label>
            <input type="text" [(ngModel)]="formPrenom" />
          </div>
          <div class="ac-field">
            <label>{{ ts.isEn() ? 'Last name' : 'Nom' }}</label>
            <input type="text" [(ngModel)]="formNom" />
          </div>
        </div>
        <div class="ac-field">
          <label>Email</label>
          <input type="email" [(ngModel)]="formEmail" />
        </div>
        <div class="ac-field" *ngIf="!editing()">
          <label>{{ ts.isEn() ? 'Password' : 'Mot de passe' }}</label>
          <input type="password" [(ngModel)]="formPassword" [placeholder]="ts.isEn() ? 'At least 6 characters' : 'Au moins 6 caractères'" />
        </div>
        <div class="ac-form-row">
          <div class="ac-field">
            <label>{{ ts.isEn() ? 'Role' : 'Rôle' }}</label>
            <select [(ngModel)]="formRole">
              <option value="agent">{{ ts.isEn() ? 'Agent' : 'Agent' }}</option>
              <option value="admin">{{ ts.isEn() ? 'Administrator' : 'Administrateur' }}</option>
            </select>
          </div>
          <div class="ac-field" *ngIf="editing()">
            <label>{{ ts.isEn() ? 'Status' : 'Statut' }}</label>
            <select [(ngModel)]="formActif">
              <option [ngValue]="true">{{ ts.isEn() ? 'Active' : 'Actif' }}</option>
              <option [ngValue]="false">{{ ts.isEn() ? 'Disabled' : 'Désactivé' }}</option>
            </select>
          </div>
        </div>

        <div class="ac-modal-err" *ngIf="formError()">{{ formError() }}</div>

        <div class="ac-modal-actions">
          <button class="ac-btn-cancel" (click)="closeForm()">{{ ts.isEn() ? 'Cancel' : 'Annuler' }}</button>
          <button class="ac-btn-save" (click)="submitForm()" [disabled]="saving()">
            {{ saving() ? (ts.isEn() ? 'Saving…' : 'Enregistrement…') : (ts.isEn() ? 'Save' : 'Enregistrer') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Reset password modal ── -->
    <div class="ac-modal-backdrop" *ngIf="showResetPwd()" (click)="showResetPwd.set(false)">
      <div class="ac-modal ac-modal-sm" (click)="$event.stopPropagation()">
        <h2>{{ ts.isEn() ? 'Reset password' : 'Réinitialiser le mot de passe' }}</h2>
        <p class="ac-modal-sub">{{ resetTarget()?.Prenom }} {{ resetTarget()?.Nom }}</p>
        <div class="ac-field">
          <label>{{ ts.isEn() ? 'New password' : 'Nouveau mot de passe' }}</label>
          <input type="password" [(ngModel)]="resetPassword" [placeholder]="ts.isEn() ? 'At least 6 characters' : 'Au moins 6 caractères'" />
        </div>
        <div class="ac-modal-err" *ngIf="formError()">{{ formError() }}</div>
        <div class="ac-modal-actions">
          <button class="ac-btn-cancel" (click)="showResetPwd.set(false)">{{ ts.isEn() ? 'Cancel' : 'Annuler' }}</button>
          <button class="ac-btn-save" (click)="submitResetPwd()" [disabled]="saving()">{{ ts.isEn() ? 'Reset' : 'Réinitialiser' }}</button>
        </div>
      </div>
    </div>

    <!-- ── Delete confirm modal ── -->
    <div class="ac-modal-backdrop" *ngIf="deleteTarget()" (click)="deleteTarget.set(null)">
      <div class="ac-modal ac-modal-sm" (click)="$event.stopPropagation()">
        <div class="ac-delete-ico"><i class="bi bi-exclamation-triangle-fill"></i></div>
        <h2>{{ ts.isEn() ? 'Delete this account?' : 'Supprimer ce compte ?' }}</h2>
        <p class="ac-modal-sub">
          {{ ts.isEn() ? 'This action is permanent and cannot be undone.' : 'Cette action est définitive et irréversible.' }}
          <strong>{{ deleteTarget()?.Prenom }} {{ deleteTarget()?.Nom }}</strong>
        </p>
        <div class="ac-modal-actions">
          <button class="ac-btn-cancel" (click)="deleteTarget.set(null)">{{ ts.isEn() ? 'Cancel' : 'Annuler' }}</button>
          <button class="ac-btn-delete" (click)="submitDelete()" [disabled]="saving()">{{ ts.isEn() ? 'Delete' : 'Supprimer' }}</button>
        </div>
      </div>
    </div>

    <!-- ── Plan picker modal ── -->
    <div class="ac-modal-backdrop" *ngIf="showPlanPicker()" (click)="showPlanPicker.set(false)">
      <div class="ac-modal" (click)="$event.stopPropagation()">
        <h2>{{ ts.isEn() ? 'Choose active plan' : 'Choisir le plan actif' }}</h2>
        <div class="ac-plan-options">
          <button class="ac-plan-option" *ngFor="let p of availablePlans()"
                  [class.ac-plan-option-active]="p.key === plan()?.key"
                  (click)="selectedPlanKey.set(p.key)"
                  [class.ac-plan-option-selected]="selectedPlanKey() === p.key">
            <div class="ac-plan-option-name">{{ p.label }}</div>
            <div class="ac-plan-option-limit">{{ p.agent_limit }} {{ ts.isEn() ? 'accounts max' : 'comptes max' }}</div>
          </button>
        </div>
        <div class="ac-modal-err" *ngIf="formError()">{{ formError() }}</div>
        <div class="ac-modal-actions">
          <button class="ac-btn-cancel" (click)="showPlanPicker.set(false)">{{ ts.isEn() ? 'Cancel' : 'Annuler' }}</button>
          <button class="ac-btn-save" (click)="submitPlanChange()" [disabled]="saving()">{{ ts.isEn() ? 'Apply' : 'Appliquer' }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    :host *, :host *::before, :host *::after { box-sizing: border-box; }

    .ac-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
    .ac-header h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 22px; color: #152247; }
    .ac-header p { font-size: 13.5px; color: #6b7488; margin-top: 4px; }
    .ac-new-btn {
      display: flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #152247, #1E6FD9); color: #fff; font-weight: 700; font-size: 13.5px;
      cursor: pointer; transition: opacity .15s; white-space: nowrap;
    }
    .ac-new-btn:hover:not(:disabled) { opacity: .9; }
    .ac-new-btn:disabled { opacity: .5; cursor: not-allowed; }

    /* Plan card */
    .ac-plan-card {
      display: flex; align-items: center; gap: 20px; background: #fff; border: 1px solid #e8edf6;
      border-radius: 18px; padding: 18px 22px; margin-bottom: 16px;
    }
    .ac-plan-left { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .ac-plan-ico { width: 44px; height: 44px; border-radius: 12px; background: #fffbeb; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 19px; }
    .ac-plan-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 14.5px; color: #152247; }
    .ac-plan-sub { font-size: 12px; color: #9aa1b3; margin-top: 2px; }
    .ac-plan-bar-wrap { flex: 1; }
    .ac-plan-bar-track { height: 8px; background: #f0f4fb; border-radius: 20px; overflow: hidden; }
    .ac-plan-bar-fill { height: 100%; border-radius: 20px; background: linear-gradient(90deg, #1E6FD9, #6c5ce7); transition: width .5s ease; }
    .ac-plan-bar-full { background: linear-gradient(90deg, #f59e0b, #ef4444); }
    .ac-plan-change-btn {
      padding: 9px 16px; border-radius: 10px; border: 1.5px solid #e8edf6; background: #f8faff;
      color: #152247; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all .15s; flex-shrink: 0;
    }
    .ac-plan-change-btn:hover { border-color: #1E6FD9; color: #1E6FD9; }

    .ac-warn {
      display: flex; align-items: center; gap: 10px; background: #fff3e0; border: 1px solid #fde3b8;
      color: #92400e; padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; margin-bottom: 16px;
    }

    .ac-loading { display: flex; align-items: center; gap: 12px; padding: 60px; justify-content: center; color: #6b7488; }
    .ac-spinner { width: 26px; height: 26px; border: 3px solid #e8edf6; border-top-color: #1E6FD9; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .ac-table-wrap { background: #fff; border-radius: 18px; border: 1px solid #e8edf6; overflow: hidden; }
    .ac-table { width: 100%; border-collapse: collapse; }
    .ac-table thead tr { background: #f8faff; }
    .ac-table th { padding: 13px 16px; font-size: 11px; font-weight: 700; color: #9aa1b3; text-transform: uppercase; letter-spacing: .05em; text-align: left; border-bottom: 1px solid #e8edf6; white-space: nowrap; }
    .ac-table td { padding: 12px 16px; font-size: 13.5px; color: #152247; vertical-align: middle; border-bottom: 1px solid #f0f4fb; }
    .ac-table tr:last-child td { border-bottom: none; }
    .ac-table tr:hover td { background: #f8faff; }
    .ac-row-self td { background: #f8faff; }

    .ac-cell-name { display: flex !important; align-items: center; gap: 10px; }
    .ac-avatar { width: 30px; height: 30px; border-radius: 50%; background: #deeeff; color: #1E6FD9; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
    .ac-self-badge { background: #e8edf6; color: #152247; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
    .ac-cell-date { color: #9aa1b3; font-size: 12.5px; }

    .ac-role-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
    .ac-role-admin { background: #ede8ff; color: #6c5ce7; }
    .ac-role-agent { background: #eef5ff; color: #1E6FD9; }

    .ac-status-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }
    .ac-status-dot { width: 7px; height: 7px; border-radius: 50%; }
    .ac-status-on .ac-status-dot { background: #10b981; }
    .ac-status-off .ac-status-dot { background: #9aa1b3; }
    .ac-status-off { color: #9aa1b3; }

    .ac-cell-actions { display: flex; gap: 6px; justify-content: flex-end; }
    .ac-icon-btn {
      width: 32px; height: 32px; border-radius: 9px; border: 1px solid #e8edf6; background: #fff;
      color: #6b7488; display: flex; align-items: center; justify-content: center; cursor: pointer;
      font-size: 13px; transition: all .15s;
    }
    .ac-icon-btn:hover { border-color: #1E6FD9; color: #1E6FD9; }
    .ac-icon-btn-danger:hover:not(:disabled) { border-color: #ef4444; color: #ef4444; }
    .ac-icon-btn:disabled { opacity: .35; cursor: not-allowed; }

    /* Modal */
    .ac-modal-backdrop {
      position: fixed; inset: 0; background: rgba(21,34,71,.5); backdrop-filter: blur(2px);
      display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;
    }
    .ac-modal {
      width: 100%; max-width: 440px; background: #fff; border-radius: 20px; padding: 28px;
      animation: ac-pop .2s cubic-bezier(.4,0,.2,1);
    }
    .ac-modal-sm { max-width: 380px; text-align: center; }
    @keyframes ac-pop { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
    .ac-modal h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 18px; color: #152247; margin-bottom: 6px; }
    .ac-modal-sub { font-size: 13px; color: #6b7488; margin-bottom: 18px; }

    .ac-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .ac-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; text-align: left; }
    .ac-field label { font-size: 11px; font-weight: 700; color: #8b95a7; text-transform: uppercase; letter-spacing: .04em; }
    .ac-field input, .ac-field select {
      width: 100%; padding: 10px 13px; border-radius: 10px; border: 1.5px solid #e8edf6;
      font-size: 13.5px; color: #152247; font-family: 'DM Sans', sans-serif; background: #fbfcfe;
    }
    .ac-field input:focus, .ac-field select:focus { outline: none; border-color: #1E6FD9; background: #fff; }

    .ac-modal-err { background: #fee2e2; color: #991b1b; font-size: 12.5px; font-weight: 600; padding: 10px 14px; border-radius: 10px; margin-bottom: 14px; }

    .ac-modal-actions { display: flex; gap: 10px; margin-top: 6px; }
    .ac-btn-cancel { flex: 1; padding: 11px; border-radius: 11px; border: 1.5px solid #e8edf6; background: #fff; color: #6b7488; font-weight: 700; font-size: 13.5px; cursor: pointer; }
    .ac-btn-save { flex: 1; padding: 11px; border-radius: 11px; border: none; background: linear-gradient(135deg, #152247, #1E6FD9); color: #fff; font-weight: 700; font-size: 13.5px; cursor: pointer; }
    .ac-btn-save:disabled { opacity: .6; cursor: not-allowed; }
    .ac-btn-delete { flex: 1; padding: 11px; border-radius: 11px; border: none; background: #ef4444; color: #fff; font-weight: 700; font-size: 13.5px; cursor: pointer; }
    .ac-delete-ico { width: 52px; height: 52px; border-radius: 50%; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 14px; }

    .ac-plan-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .ac-plan-option {
      display: flex; align-items: center; justify-content: space-between; padding: 13px 16px;
      border-radius: 12px; border: 1.5px solid #e8edf6; background: #fff; cursor: pointer; text-align: left;
      transition: all .15s;
    }
    .ac-plan-option:hover { border-color: #c4d9f5; }
    .ac-plan-option-selected { border-color: #1E6FD9; background: #f0f7ff; }
    .ac-plan-option-active .ac-plan-option-name::after { content: ' ✓'; color: #10b981; }
    .ac-plan-option-name { font-weight: 700; font-size: 14px; color: #152247; }
    .ac-plan-option-limit { font-size: 12px; color: #9aa1b3; }
  `]
})
export class AdminComptesComponent implements OnInit {
  agents = signal<AgentAccount[]>([]);
  plan = signal<PlanInfo | null>(null);
  activeCount = signal(0);
  loading = signal(true);
  saving = signal(false);
  formError = signal('');

  showForm = signal(false);
  editing = signal<AgentAccount | null>(null);
  formNom = ''; formPrenom = ''; formEmail = ''; formPassword = ''; formRole = 'agent'; formActif = true;

  showResetPwd = signal(false);
  resetTarget = signal<AgentAccount | null>(null);
  resetPassword = '';

  deleteTarget = signal<AgentAccount | null>(null);

  showPlanPicker = signal(false);
  availablePlans = signal<PlanInfo[]>([]);
  selectedPlanKey = signal('');

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    public ts: TranslationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.agentConnecte()?.role !== 'admin') {
      this.router.navigate(['/agent/dashboard']);
      return;
    }
    this.load();
  }

  planPct(): number {
    const p = this.plan();
    if (!p || p.agent_limit === 0) return 0;
    return Math.min(100, Math.round((this.activeCount() / p.agent_limit) * 100));
  }

  atLimit(): boolean {
    const p = this.plan();
    return !!p && this.activeCount() >= p.agent_limit;
  }

  isSelf(a: AgentAccount): boolean {
    return a.Email.toLowerCase() === (this.authService.agentConnecte()?.email ?? '').toLowerCase();
  }

  load(): void {
    this.loading.set(true);
    this.adminService.getAgents().subscribe({
      next: res => {
        if (res.success) {
          this.agents.set(res.data.agents);
          this.plan.set(res.data.plan);
          this.activeCount.set(res.data.agents_actifs);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.formNom = ''; this.formPrenom = ''; this.formEmail = ''; this.formPassword = ''; this.formRole = 'agent'; this.formActif = true;
    this.formError.set('');
    this.showForm.set(true);
  }

  openEdit(a: AgentAccount): void {
    this.editing.set(a);
    this.formNom = a.Nom; this.formPrenom = a.Prenom; this.formEmail = a.Email; this.formRole = a.Role; this.formActif = a.Actif;
    this.formError.set('');
    this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }

  submitForm(): void {
    if (!this.formNom.trim() || !this.formPrenom.trim() || !this.formEmail.trim()) {
      this.formError.set(this.ts.isEn() ? 'All fields are required.' : 'Tous les champs sont obligatoires.');
      return;
    }
    this.saving.set(true);
    this.formError.set('');

    const editingAgent = this.editing();
    if (editingAgent) {
      this.adminService.updateAgent(editingAgent.Id_Agent, this.formNom, this.formPrenom, this.formEmail, this.formRole, this.formActif).subscribe({
        next: res => {
          this.saving.set(false);
          if (res.success) { this.showForm.set(false); this.load(); }
          else this.formError.set(res.message || 'Erreur');
        },
        error: err => { this.saving.set(false); this.formError.set(err?.error?.message || 'Erreur'); }
      });
    } else {
      if (!this.formPassword || this.formPassword.length < 6) {
        this.saving.set(false);
        this.formError.set(this.ts.isEn() ? 'Password must be at least 6 characters.' : 'Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      this.adminService.createAgent(this.formNom, this.formPrenom, this.formEmail, this.formPassword, this.formRole).subscribe({
        next: res => {
          this.saving.set(false);
          if (res.success) { this.showForm.set(false); this.load(); }
          else this.formError.set(res.message || 'Erreur');
        },
        error: err => { this.saving.set(false); this.formError.set(err?.error?.message || 'Erreur'); }
      });
    }
  }

  openResetPwd(a: AgentAccount): void {
    this.resetTarget.set(a);
    this.resetPassword = '';
    this.formError.set('');
    this.showResetPwd.set(true);
  }

  submitResetPwd(): void {
    if (!this.resetPassword || this.resetPassword.length < 6) {
      this.formError.set(this.ts.isEn() ? 'Password must be at least 6 characters.' : 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    const target = this.resetTarget();
    if (!target) return;
    this.saving.set(true);
    this.adminService.resetPassword(target.Id_Agent, this.resetPassword).subscribe({
      next: res => {
        this.saving.set(false);
        if (res.success) this.showResetPwd.set(false);
        else this.formError.set(res.message || 'Erreur');
      },
      error: err => { this.saving.set(false); this.formError.set(err?.error?.message || 'Erreur'); }
    });
  }

  confirmDelete(a: AgentAccount): void { this.deleteTarget.set(a); }

  submitDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.saving.set(true);
    this.adminService.deleteAgent(target.Id_Agent).subscribe({
      next: res => {
        this.saving.set(false);
        this.deleteTarget.set(null);
        if (res.success) this.load();
      },
      error: () => { this.saving.set(false); this.deleteTarget.set(null); }
    });
  }

  // ── Plan ──
  openPlanPicker(): void {
    this.formError.set('');
    this.showPlanPicker.set(true);
    this.loadPlans();
  }

  loadPlans(): void {
    this.adminService.getPlan().subscribe({
      next: res => {
        if (res.success) {
          this.availablePlans.set(res.data.plans_disponibles);
          this.selectedPlanKey.set(res.data.plan_actuel.key);
        }
      }
    });
  }

  submitPlanChange(): void {
    if (!this.selectedPlanKey()) return;
    this.saving.set(true);
    this.formError.set('');
    this.adminService.setPlan(this.selectedPlanKey()).subscribe({
      next: res => {
        this.saving.set(false);
        if (res.success) { this.plan.set(res.data.plan_actuel); this.showPlanPicker.set(false); }
        else this.formError.set(res.message || 'Erreur');
      },
      error: err => { this.saving.set(false); this.formError.set(err?.error?.message || 'Erreur'); }
    });
  }
}
