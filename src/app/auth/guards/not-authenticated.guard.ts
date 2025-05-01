import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatch,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async(
  route: Route,
  state: UrlSegment[]
) => {

  const authService =  inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom( authService.checkStatus());

  if(isAuthenticated){
    router.navigateByUrl('/');
    return false;
  }


  return true;
};
