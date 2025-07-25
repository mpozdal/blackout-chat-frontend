import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from './local';
import { webSocket } from 'rxjs/webSocket';
import { WebsocketService } from './websocket';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  username: string = '';
  router = inject(Router);
  //wsService = inject(webSocket);
  localService = inject(LocalService);

  constructor(private wsService: WebsocketService) {}

  getClientId() {
    return this.localService.getData('id');
  }
  setUsername(name: string) {
    this.username = name;
    //this.localService.saveData('id', crypto.randomUUID());
  }
  getUsername(): string {
    return this.username;
  }
  checkAuth(): boolean {
    if (this.getUsername() === '') return false;
    return true;
  }
  logout(): void {
    this.localService.clearData();
    this.wsService.disconnect();
    this.router.navigate(['/']);
  }
}
