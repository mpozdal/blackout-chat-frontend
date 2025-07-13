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
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
interface ChatMessage {
  text: string;
  user: string;
  clientId: string;
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
  clientId: string;
  messages: ChatMessage[] = [];
  private messageSub?: Subscription;

  constructor(
    private wsService: WebsocketService,
    protected authService: Auth,
    private cdr: ChangeDetectorRef
  ) {
    this.clientId = authService.getClientId();
  }

  ngOnInit(): void {
    this.wsService.connect(import.meta.env.NG_APP_APIURL);

    this.messageSub = this.wsService.messages$.subscribe((raw) => {
      try {
        console.log(raw);
        const { user, text, clientId, ExpiresAt } = JSON.parse(raw);
        const msg: ChatMessage = {
          user,
          clientId,
          text,
          expiresAt: ExpiresAt,
        };
        this.messages.push(msg);

        setTimeout(() => {
          this.messages = this.messages.filter((m) => m !== msg);
          this.cdr.detectChanges();
        }, 15000);
        setInterval(() => {
          this.cdr.detectChanges(); // zmusza Angulara do przeliczenia template
        }, 1000);
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
    setTimeout(() => {
      this.bottom?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  sendMessage(text: string): void {
    const msg = {
      user: this.authService.getUsername(),
      text,
      clientId: this.clientId,
    };
    this.wsService.send(JSON.stringify(msg));
  }
  ngOnDestroy(): void {
    this.messageSub?.unsubscribe();
  }
}
