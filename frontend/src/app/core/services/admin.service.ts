import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface AgentAccount {
  Id_Agent: number;
  Email: string;
  Nom: string;
  Prenom: string;
  Role: 'agent' | 'admin';
  Actif: boolean;
  Derniere_Connexion?: string | null;
}

export interface PlanInfo {
  key: string;
  label: string;
  agent_limit: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAgents(): Observable<ApiResponse<{ agents: AgentAccount[]; plan: PlanInfo; agents_actifs: number }>> {
    return this.http.get<ApiResponse<{ agents: AgentAccount[]; plan: PlanInfo; agents_actifs: number }>>(`${this.base}/agents`);
  }

  createAgent(nom: string, prenom: string, email: string, mot_de_passe: string, role: string): Observable<ApiResponse<{ agent: any }>> {
    return this.http.post<ApiResponse<{ agent: any }>>(`${this.base}/agents`, { nom, prenom, email, mot_de_passe, role });
  }

  updateAgent(id: number, nom: string, prenom: string, email: string, role: string, actif: boolean): Observable<ApiResponse<{ agent: any }>> {
    return this.http.put<ApiResponse<{ agent: any }>>(`${this.base}/agents/${id}`, { nom, prenom, email, role, actif });
  }

  resetPassword(id: number, mot_de_passe: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.base}/agents/${id}/password`, { mot_de_passe });
  }

  deleteAgent(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.base}/agents/${id}`);
  }

  getPlan(): Observable<ApiResponse<{ plan_actuel: PlanInfo; plans_disponibles: PlanInfo[] }>> {
    return this.http.get<ApiResponse<{ plan_actuel: PlanInfo; plans_disponibles: PlanInfo[] }>>(`${this.base}/plan`);
  }

  setPlan(key: string): Observable<ApiResponse<{ plan_actuel: PlanInfo }>> {
    return this.http.put<ApiResponse<{ plan_actuel: PlanInfo }>>(`${this.base}/plan`, { plan: key });
  }
}
