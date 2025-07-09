import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private username: string = "michal"

  setUsername(name: string) {
    this.username = name
  }
  getUsername(): string {
    return this.username;
  }
  checkAuth(): boolean {
    return this.username.trim() === ""
  }

  constructor() { 
    
  }
}
