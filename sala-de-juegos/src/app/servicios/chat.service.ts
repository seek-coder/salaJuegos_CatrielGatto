import { Injectable, NgZone, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Mensaje {
  id?: number;
  usuario: string;
  texto: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  mensajes = signal<Mensaje[]>([]);
  private canal: RealtimeChannel | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private ngZone: NgZone
  ) {}

  async cargarMensajes() {
    const { data } = await this.supabaseService.client
      .from('mensajes')
      .select('*')
      .order('fecha', { ascending: true })
      .limit(100);

    if (data) {
      this.ngZone.run(() => {
        this.mensajes.set(data as Mensaje[]);
      });
    }
  }

  suscribirse() {
    this.canal = this.supabaseService.client
      .channel('mensajes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes' },
        (payload) => {
          this.ngZone.run(() => {
            this.mensajes.update(msgs => [...msgs, payload.new as Mensaje]);
          });
        }
      )
      .subscribe();
  }

  desuscribirse() {
    if (this.canal) {
      this.supabaseService.client.removeChannel(this.canal);
      this.canal = null;
    }
  }

  async enviarMensaje(usuario: string, texto: string) {
    await this.supabaseService.client
      .from('mensajes')
      .insert({
        usuario,
        texto,
        fecha: new Date().toISOString(),
      });
  }
}
