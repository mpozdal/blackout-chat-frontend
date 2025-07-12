import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat } from '../chat/chat';

@Component({
  selector: 'app-input',
  imports: [FormsModule, CommonModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {
  constructor(private chat: Chat) {}

  message: string = '';

  handleSend() {
    if (this.message.trim() !== '') {
      this.chat.sendMessage(this.message);
      this.message = '';
    }
  }
}
