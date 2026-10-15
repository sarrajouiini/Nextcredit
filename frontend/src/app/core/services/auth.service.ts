import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AgentInfo, LoginRequest, LoginResponse } from '../models/auth.model';

const ACCESS_TOKEN_KEY = 'nc_access_token';
const REFRESH_TOKEN_KEY = 'nc_refresh_token';
const AGENT_INFO_KEY = 'nc_agent_info';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal réactif : toute la UI peut s'abonner à l'état de connexion
  readonly agentConnecte = signal<AgentInfo | null>(this.lireAgentStocke());

  constructor(private http: HttpClient, private router: Router) {}

  private lireAgentStocke(): AgentInfo | null {
    const raw = localStorage.getItem(AGENT_INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  login(email: string, mot_de_passe: string): Observable<ApiResponse<LoginResponse>> {
    const payload: LoginRequest = { email, mot_de_passe };
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access_token);
            localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh_token);
            localStorage.setItem(AGENT_INFO_KEY, JSON.stringify(res.data.agent));
            this.agentConnecte.set(res.data.agent);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AGENT_INFO_KEY);
    this.agentConnecte.set(null);
    this.router.navigate(['/connexion']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  estConnecte(): boolean {
    return !!this.getAccessToken();
  }

  rafraichirToken(): Observable<ApiResponse<{ access_token: string }>> {
    return this.http.post<ApiResponse<{ access_token: string }>>(
      `${environment.apiUrl}/auth/refresh`,
      {},
      {
        headers: { Authorization: `Bearer ${this.getRefreshToken()}` },
      }
    );
  }

  /** Met à jour nom/prénom/email de l'agent connecté. Le mot de passe n'est jamais touché ici. */
  updateProfile(nom: string, prenom: string, email: string): Observable<ApiResponse<{ agent: AgentInfo; access_token: string }>> {
    return this.http
      .put<ApiResponse<{ agent: AgentInfo; access_token: string }>>(
        `${environment.apiUrl}/auth/me`,
        { nom, prenom, email }
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access_token);
            localStorage.setItem(AGENT_INFO_KEY, JSON.stringify(res.data.agent));
            this.agentConnecte.set(res.data.agent);
          }
        })
      );
  }
}
