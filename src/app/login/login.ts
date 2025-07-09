import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms'
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username: string = "";

  constructor(private router: Router, private authService: Auth) {}

  login() {
    if(this.username.trim()) {
      this.authService.setUsername(this.username)
      this.router.navigate(["/chat"])
    }
  }
}
