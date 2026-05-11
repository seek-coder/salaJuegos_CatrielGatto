import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class JuegosService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  async guardarPartida(juego: string, puntaje: number, datosExtra: Record<string, any> = {}) {
    const usuario = this.authService.usuarioActual();
    if (!usuario) return;

    await this.supabaseService.client
      .from('partidas')
      .insert({
        juego,
        usuario: usuario.email,
        puntaje,
        fecha: new Date().toISOString(),
        datos_extra: datosExtra,
      });
  }
}
