import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket?: WebSocket;
  private messagesSubject = new Subject<string>();
  public messages$: Observable<string> = this.messagesSubject.asObservable();

  private isConnected = false;

  connect(url: string): void {
    if (this.isConnected) {
      console.warn('[WebSocket] Already connected, skipping.');
      return;
    }

    this.socket = new WebSocket(url);
    this.isConnected = true;

    this.socket.onopen = () => {
      console.log('[WebSocket] Connected');
    };

    this.socket.onmessage = async (event) => {
      const raw =
        typeof event.data === 'string' ? event.data : await event.data.text(); // 🛠 obsługa Bloba

      this.messagesSubject.next(raw);
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };

    this.socket.onclose = () => {
      console.log('[WebSocket] Closed');
      this.isConnected = false;
    };
  }

  send(data: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    } else {
      console.warn('[WebSocket] Tried to send while not connected');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }

    this.messagesSubject.complete(); // zakończ stream
    this.messagesSubject = new Subject<string>(); // stwórz nowy
    this.messages$ = this.messagesSubject.asObservable();

    this.isConnected = false;
  }
}
