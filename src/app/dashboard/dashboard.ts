import { Component } from '@angular/core';
import { Chat } from "../chat/chat";
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'app-dashboard',
  imports: [Chat, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
