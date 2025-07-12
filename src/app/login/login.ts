import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';
  showError: boolean = false;

  constructor(private router: Router, private authService: Auth) {}

  login() {
    this.showError = false;
    if (!this.username.trim() || !this.password.trim()) {
      this.showError = true;
      return;
    }
    if (this.password !== environment.password) {
      this.showError = true;
      return;
    }
    this.authService.setUsername(this.username);
    this.router.navigate(['/chat']);
  }
}
