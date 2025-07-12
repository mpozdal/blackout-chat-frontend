import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterEvent } from '@angular/router';
import { Auth } from './auth';

export const guard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.checkAuth()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
