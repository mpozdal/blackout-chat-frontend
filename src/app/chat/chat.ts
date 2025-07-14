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
import { Encryption } from '../encryption';
interface ChatMessage {
  type: string;
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
  isConnected = false;

  constructor(
    protected wsService: WebsocketService,
    protected authService: Auth,
    private cdr: ChangeDetectorRef,
    protected encryptionService: Encryption
  ) {
    this.clientId = authService.getClientId();
  }

  async ngOnInit(): Promise<void> {
    this.wsService.isConnected$.subscribe((connected) => {
      this.isConnected = connected;
      this.cdr.detectChanges();
    });
    this.wsService.connect(import.meta.env.NG_APP_APIURL);

    this.messageSub = this.wsService.messages$.subscribe(async (raw) => {
      try {
        var msg: ChatMessage;
        console.log(raw);
        const { type, user, ciphertext, iv, clientId, ExpiresAt } =
          JSON.parse(raw);
        if (type === 'image') {
          const imageData = await this.encryptionService.decryptBinary(
            ciphertext,
            iv
          );
          const blob = new Blob([imageData as BlobPart], {
            type: 'image/jpeg',
          }); // albo 'image/png'
          const url = URL.createObjectURL(blob);
          msg = {
            type,
            user,
            text: url,
            clientId,
            expiresAt: ExpiresAt,
          };
        } else {
          const message = await this.encryptionService.decrypt(ciphertext, iv);
          msg = {
            type,
            user,
            text: message,
            clientId,
            expiresAt: ExpiresAt,
          };
        }
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

  async sendImage(arrayBuffer: ArrayBuffer) {
    const { ciphertext, iv } = await this.encryptionService.encryptBinary(
      arrayBuffer
    );
    const msg = {
      type: 'image',
      user: this.authService.getUsername(),
      ciphertext,
      iv,
      clientId: this.clientId,
    };
    this.wsService.send(JSON.stringify(msg));
  }

  async sendMessage(text: string): Promise<void> {
    const { ciphertext, iv } = await this.encryptionService.encrypt(text);
    const msg = {
      type: 'text',
      user: this.authService.getUsername(),
      ciphertext,
      iv,
      clientId: this.clientId,
    };

    this.wsService.send(JSON.stringify(msg));
  }
  ngOnDestroy(): void {
    this.messageSub?.unsubscribe();
  }
}
