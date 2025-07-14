import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Encryption } from '../encryption';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';
  showErrorUsername: boolean = false;
  showErrorPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: Auth,
    protected encryptionService: Encryption
  ) {}

  async login() {
    this.showErrorUsername = false;
    this.showErrorPassword = false;
    if (!this.username.trim() || this.username.length > 12) {
      this.showErrorUsername = true;
      this.showErrorPassword = true;
      return;
    }
    if (!this.password.trim()) {
      this.showErrorPassword = true;
      return;
    }
    try {
      await this.encryptionService.setPassword(this.password); // ⬅️ ważne!
      this.authService.setUsername(this.username);
      this.router.navigate(['/chat']);
    } catch (err) {
      console.error('Błąd ustawiania hasła:', err);
      this.showErrorPassword = true;
    }
  }
}
