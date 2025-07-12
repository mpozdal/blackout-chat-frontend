import { Component } from '@angular/core';
import { Chat } from '../chat/chat';
import { Sidebar } from '../sidebar/sidebar';
import { Nav } from '../nav/nav';

@Component({
  selector: 'app-dashboard',
  imports: [Chat, Nav],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
