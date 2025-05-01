import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const IsAdminGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const authService = inject(AuthService);
// Como Estoy seguro de que ya paso el proceso de auth y estoy en el checking?
  await firstValueFrom(authService.checkStatus());
   //Una vez pasa el checkstatus ya se puede determinar si es admin o no

  return authService.isAdmin();
};
