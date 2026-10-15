import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class OctroiService {
  private readonly base = `${environment.apiUrl}/octroi`;

  constructor(private http: HttpClient) {}

  predict(payload: Record<string, unknown>): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/predict`, payload);
  }

  explainShap(payload: Record<string, unknown>, topN = 6): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.base}/explain/shap?top_n=${topN}`,
      payload
    );
  }

  explainLime(payload: Record<string, unknown>, topN = 6): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.base}/explain/lime?top_n=${topN}`,
      payload
    );
  }

  confirmerDecision(payload: Record<string, unknown>): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/confirmer`, payload);
  }

  dossiersEnAttente(limit = 50): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/dossiers-en-attente?limit=${limit}`);
  }
}
