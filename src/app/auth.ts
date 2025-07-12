import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private username: string = '';

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

  constructor() {}
}
