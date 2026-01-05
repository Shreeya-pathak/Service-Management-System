import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TokenService } from '../services/auth/token.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.token;

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(authReq).pipe(
    catchError(err => {

      
      if (
        err.status === 401 &&
        !req.url.includes('/auth/login')
      ) {
        tokenService.clear();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};
