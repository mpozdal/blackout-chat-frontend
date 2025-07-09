import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Chat } from './chat/chat';
import { guard } from './guard';
import { Dashboard } from './dashboard/dashboard';
export const routes: Routes = [
  {
    path: "",
    component: Login
  },
  {
    path: "chat",
    component: Dashboard,
    canActivate: [guard]
  },
  { path: '**', component: Login }
];
