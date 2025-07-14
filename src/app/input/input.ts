import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat } from '../chat/chat';
import { Encryption } from '../encryption';

@Component({
  selector: 'app-input',
  imports: [FormsModule, CommonModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {
  @ViewChild('submit') btn: ElementRef | undefined;
  constructor(private chat: Chat) {}

  message: string = '';
  onChange(event: any) {
    const input = event.target as HTMLInputElement;
    this.message = input.value;
  }
  async handleImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    console.log(file?.size);
    if (!file || file.size > 8 * 1024) return;

    const arrayBuffer = await file.arrayBuffer();

    this.chat.sendImage(arrayBuffer);
  }

  handleSend(emoji?: string) {
    if (emoji) {
      this.chat.sendMessage(emoji);
    } else if (this.message.trim() !== '' && this.message.length < 100) {
      this.chat.sendMessage(this.message);
      this.message = '';
    }
  }
}
