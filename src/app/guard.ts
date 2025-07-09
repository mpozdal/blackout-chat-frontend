import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from './auth';

export const guard: CanActivateFn = (route, state) => {
  const authService = inject(Auth)
  return !authService.checkAuth();
};
