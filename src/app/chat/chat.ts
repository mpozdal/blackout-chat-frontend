import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
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
  standalone: true,
  imports: [ChatBubble, Input],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit, AfterViewInit {
  @ViewChild('bottom') bottom?: ElementRef<HTMLDivElement>;

  messages: ChatMessage[] = [];

  constructor(
    private wsService: WebsocketService,
    private authService: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.wsService.connect(import.meta.env.NG_APP_APIURL);

    this.wsService.messages$.subscribe((raw) => {
      try {
        const { user, text } = JSON.parse(raw);
        const msg: ChatMessage = {
          user,
          text,
          expiresAt: Date.now() + 10000,
        };
        this.messages.push(msg);

        // Usuń wiadomość po 10s
        setTimeout(() => {
          this.messages = this.messages.filter((m) => m !== msg);
          this.cdr.detectChanges(); // odśwież widok, jeśli trzeba
        }, 10000);

        // Auto-scroll
        setTimeout(() => this.scrollToBottom(), 0);
      } catch (err) {
        console.error('Błąd parsowania wiadomości:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.bottom?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  sendMessage(text: string): void {
    const msg = {
      user: this.authService.getUsername(),
      text,
    };
    this.wsService.send(JSON.stringify(msg));
  }
}
