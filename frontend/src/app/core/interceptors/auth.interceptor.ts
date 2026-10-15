import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Intercepteur fonctionnel (Angular 17+) :
 * - Attache automatiquement "Authorization: Bearer <token>" sur chaque
 *   requête vers l'API Flask.
 * - Si la requête échoue avec 401 (token expiré), tente un refresh
 *   automatique via /auth/refresh, puis rejoue la requête originale.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const reqAvecToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqAvecToken).pipe(
    catchError((erreur) => {
      const estErreur401 = erreur.status === 401;
      const estRequeteAuth = req.url.includes('/auth/');

      if (estErreur401 && !estRequeteAuth && authService.getRefreshToken()) {
        return authService.rafraichirToken().pipe(
          switchMap((res) => {
            if (res.success && res.data.access_token) {
              authService.setAccessToken(res.data.access_token);
              const reqRejouee = req.clone({
                setHeaders: { Authorization: `Bearer ${res.data.access_token}` },
              });
              return next(reqRejouee);
            }
            authService.logout();
            return throwError(() => erreur);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => erreur);
          })
        );
      }

      return throwError(() => erreur);
    })
  );
};
