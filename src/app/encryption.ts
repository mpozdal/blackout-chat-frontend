import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Encryption {
  private key: CryptoKey | null = null;
  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();

  async setPassword(password: string): Promise<void> {
    const salt = this.encoder.encode('salt');
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    this.key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100_000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(
    plaintext: string | ArrayBuffer
  ): Promise<{ ciphertext: string; iv: string }> {
    if (!this.key)
      throw new Error('Nie ustawiono klucza. Wywołaj setPassword() najpierw.');

    const iv = crypto.getRandomValues(new Uint8Array(12)); // IV musi być unikalne
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      this.encoder.encode(plaintext as string)
    );

    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv)),
    };
  }

  async decrypt(ciphertext: string, iv: string): Promise<string> {
    if (!this.key)
      throw new Error('Nie ustawiono klucza. Wywołaj setPassword() najpierw.');

    const ctBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      this.key,
      ctBytes
    );

    return this.decoder.decode(decrypted);
  }
  async encryptBinary(
    data: ArrayBuffer
  ): Promise<{ ciphertext: string; iv: string }> {
    if (!this.key) throw new Error('Key not set');

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      data
    );

    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv)),
    };
  }

  async decryptBinary(ciphertext: string, iv: string): Promise<Uint8Array> {
    if (!this.key) throw new Error('Key not set');

    const ctBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      this.key,
      ctBytes
    );

    return new Uint8Array(decrypted);
  }
  clearKey(): void {
    this.key = null;
  }

  constructor() {}
}
