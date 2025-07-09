import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-bubble',
  imports: [],
  templateUrl: './chat-bubble.html',
  styleUrl: './chat-bubble.css',
})
export class ChatBubble {
  @Input() msg!: { text: string; user: string; expiresAt: number };
  getSecondsLeft(msg: { expiresAt: number }): number {
    const seconds = Math.floor((msg.expiresAt - Date.now()) / 1000);
    return Math.max(0, seconds); // nie pokaż ujemnych wartości
  }
}
