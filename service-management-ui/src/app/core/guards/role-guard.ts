import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const RoleGuard: CanActivateFn = (route) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const userRole = tokenService.role;

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  if (userRole === expectedRole) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

