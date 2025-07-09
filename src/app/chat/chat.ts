import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { ChatBubble } from '../chat-bubble/chat-bubble';
import { Input } from '../input/input';
import { WebsocketService } from '../websocket';
import { Auth } from '../auth';

interface ChatMessage {
  text: string;
  user: string;
  expiresAt: number;
}

@Component({
  selector: 'app-chat',
  imports: [ChatBubble, Input],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('bottom') bottom!: ElementRef;
  messages: ChatMessage[] = [];

  constructor(private wsService: WebsocketService, private authService: Auth) {}
  scrollToBottom(): void {
    this.bottom?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  ngOnInit(): void {
    this.wsService.connect('wss://black-out-chat-backend.onrender.com/ws');

    this.wsService.messages$.subscribe((raw) => {
      try {
        const { user, text } = JSON.parse(raw);
        const msg: ChatMessage = {
          user,
          text,
          expiresAt: Date.now() + 10000, // 10s do wygaśnięcia
        };
        this.messages.push(msg);

        setTimeout(() => {
          this.messages = this.messages.filter((m) => m !== msg);
        }, 10000);
      } catch (err) {
        console.error('Błąd parsowania wiadomości:', err);
      }
    });
    setInterval(() => {
      // Triggeruje change detection
      this.messages = [...this.messages];
    }, 1000);
  }

  sendMessage(text: string) {
    const msg = {
      user: this.authService.getUsername(),
      text,
    };
    this.wsService.send(JSON.stringify(msg));
  }
}
