import { Injectable, NgZone, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export interface Partida {
  id: number;
  juego: string;
  usuario: string;
  puntaje: number;
  fecha: string;
  datos_extra: Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class JuegosService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private ngZone: NgZone
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

  async obtenerRankingPorJuego(juego: string, limite: number = 10): Promise<Partida[]> {
    const { data } = await this.supabaseService.client
      .from('partidas')
      .select('*')
      .eq('juego', juego)
      .order('puntaje', { ascending: false })
      .order('fecha', { ascending: true })
      .limit(limite);

    return (data as Partida[]) || [];
  }

  async obtenerPartidasDeUsuario(email: string): Promise<Partida[]> {
    const { data } = await this.supabaseService.client
      .from('partidas')
      .select('*')
      .eq('usuario', email)
      .order('fecha', { ascending: false })
      .limit(50);

    return (data as Partida[]) || [];
  }

  async obtenerTodasLasPartidas(): Promise<Partida[]> {
    const { data } = await this.supabaseService.client
      .from('partidas')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(100);

    return (data as Partida[]) || [];
  }
}
