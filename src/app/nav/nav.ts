import { Component, inject } from '@angular/core';
import { Auth } from '../auth';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  username: string;
  authService = inject(Auth);
  constructor() {
    this.username = this.authService.getUsername();
  }

  logout() {
    console.log('click');
    this.authService.logout();
  }
}
