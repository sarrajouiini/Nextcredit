import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface RiskClient {
  client_code?: string;
  pd_value?: number;
  score?: number;
  notation?: string;
  decision?: string;
  avg_retard?: number;
}

export interface Dossier {
  Id?: number | string;
  DonneesClient?: any;
  Score?: number;
  Notation?: string;
  DecisionModele?: string;
  DateDemande?: string;
}

const REQUEST_TIMEOUT_MS = 12000;

@Injectable({ providedIn: 'root' })
export class AgentDataService {
  dossiers = signal<Dossier[]>([]);
  riskClients = signal<RiskClient[]>([]);
  loaded = signal(false);
  loading = signal(false);
  dossiersUnavailable = signal(false);
  riskUnavailable = signal(false);

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** Fetches dossiers + risk clients once; concurrent callers share the same in-flight request.
   *  Each call is capped at REQUEST_TIMEOUT_MS so a slow/unresponsive Flask route can never
   *  leave the UI stuck on "Chargement..." forever — it just falls back to an empty list. */
  refresh(): void {
    if (this.loading()) return;
    const token = this.authService.getAccessToken();
    if (!token) return;

    this.loading.set(true);
    this.dossiersUnavailable.set(false);
    this.riskUnavailable.set(false);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const base = environment.apiUrl;
    let done = 0;
    const finish = () => { if (++done === 2) { this.loading.set(false); this.loaded.set(true); } };

    this.http.get<any>(`${base}/octroi/dossiers-en-attente`, { headers }).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      catchError(() => { this.dossiersUnavailable.set(true); return of(null); })
    ).subscribe(r => { this.dossiers.set(r?.data?.dossiers ?? []); finish(); });

    this.http.get<any>(`${base}/comportement/liste-a-risque?top_n=10`, { headers }).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      catchError(() => { this.riskUnavailable.set(true); return of(null); })
    ).subscribe(r => { this.riskClients.set(r?.data?.clients ?? []); finish(); });
  }
}
