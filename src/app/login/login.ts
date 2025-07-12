import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  constructor(private router: Router, private authService: Auth) {}

  login() {
    this.showErrorUsername = false;
    this.showErrorPassword = false;
    if (!this.username.trim()) {
      this.showErrorUsername = true;
      this.showErrorPassword = true;
    }
    if (!this.password.trim()) {
      this.showErrorPassword = true;
      return;
    }
    if (this.password !== import.meta.env.NG_APP_PASSWORD) {
      this.showErrorPassword = true;
      return;
    }
    this.authService.setUsername(this.username);
    this.router.navigate(['/chat']);
  }
}
