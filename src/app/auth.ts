import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private username: string = '';
  router = inject(Router);
  setUsername(name: string) {
    this.username = name;
  }
  getUsername(): string {
    return this.username;
  }
  checkAuth(): boolean {
    if (this.username.trim() === '') return false;
    return true;
  }
  logout(): void {
    this.username = '';
    this.router.navigate(['/']);
  }

  constructor() {}
}
