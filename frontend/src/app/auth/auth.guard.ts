import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/AuthService";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedin()) {
    console.log("authGuard: " + authService.isLogged)
    router.navigate(['/login']);
    return false;
  }
  return true;
};
