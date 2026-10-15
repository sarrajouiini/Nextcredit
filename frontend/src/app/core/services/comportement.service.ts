import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ComportementService {
  private readonly base = `${environment.apiUrl}/comportement`;

  constructor(private http: HttpClient) {}

  predict(clientCode: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/predict`, {
      client_code: clientCode,
    });
  }

  explainShap(clientCode: string, topN = 6): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.base}/explain/shap?top_n=${topN}`,
      { client_code: clientCode }
    );
  }

  explainLime(clientCode: string, topN = 6): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.base}/explain/lime?top_n=${topN}`,
      { client_code: clientCode }
    );
  }

  historiquePaiements(clientCode: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.base}/historique-paiements?client_code=${encodeURIComponent(clientCode)}`
    );
  }

  listeARisque(limit = 300): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/liste-a-risque?limit=${limit}`);
  }

  recommandationIA(clientCode: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/recommandation-ia`, {
      client_code: clientCode,
    });
  }
}
