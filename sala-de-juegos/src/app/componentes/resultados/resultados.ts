import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { JuegosService, Partida } from '../../servicios/juegos.service';

type TabActiva = 'ahorcado' | 'mayor-menor' | 'preguntados' | 'path-knight' | 'mis-partidas';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resultados.html',
  styleUrl: './resultados.scss'
})
export class ResultadosComponent implements OnInit {
  tabActiva = signal<TabActiva>('ahorcado');
  cargando = signal(true);

  rankingAhorcado = signal<Partida[]>([]);
  rankingMayorMenor = signal<Partida[]>([]);
  rankingPreguntados = signal<Partida[]>([]);
  rankingKnight = signal<Partida[]>([]);
  misPartidas = signal<Partida[]>([]);

  constructor(
    public authService: AuthService,
    private juegosService: JuegosService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando.set(true);

    const [ahorcado, mayorMenor, preguntados, knight] = await Promise.all([
      this.juegosService.obtenerRankingPorJuego('Ahorcado'),
      this.juegosService.obtenerRankingPorJuego('Mayor o Menor'),
      this.juegosService.obtenerRankingPorJuego('Preguntados'),
      this.juegosService.obtenerRankingPorJuego('Path of the Knight'),
    ]);

    this.rankingAhorcado.set(ahorcado);
    this.rankingMayorMenor.set(mayorMenor);
    this.rankingPreguntados.set(preguntados);
    this.rankingKnight.set(knight);

    const usuario = this.authService.usuarioActual();
    if (usuario) {
      const partidas = await this.juegosService.obtenerPartidasDeUsuario(usuario.email);
      this.misPartidas.set(partidas);
    }

    this.cargando.set(false);
  }

  cambiarTab(tab: TabActiva) {
    this.tabActiva.set(tab);
  }

  extraerNombre(email: string): string {
    return email.split('@')[0];
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  medallaIcono(indice: number): string {
    if (indice === 0) return '🥇';
    if (indice === 1) return '🥈';
    if (indice === 2) return '🥉';
    return `#${indice + 1}`;
  }

  resultadoAhorcado(partida: Partida): string {
    return partida.datos_extra?.['resultado'] === 'gano' ? 'Victoria' : 'Derrota';
  }

  tiempoAhorcado(partida: Partida): string {
    const seg = partida.datos_extra?.['tiempo'] || 0;
    const mins = Math.floor(seg / 60);
    const secs = seg % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  letrasAhorcado(partida: Partida): number {
    return partida.datos_extra?.['letras_intentadas'] || 0;
  }

  palabraAhorcado(partida: Partida): string {
    return partida.datos_extra?.['palabra'] || '—';
  }

  porcentajePreguntados(partida: Partida): number {
    return partida.datos_extra?.['porcentaje'] || 0;
  }

  tiempoPreguntados(partida: Partida): string {
    const seg = partida.datos_extra?.['tiempo'] || 0;
    const mins = Math.floor(seg / 60);
    const secs = seg % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  resultadoKnight(partida: Partida): string {
    return partida.datos_extra?.['resultado'] === 'gano' ? 'Victoria' : 'Derrota';
  }

  movimientosKnight(partida: Partida): number {
    return partida.datos_extra?.['movimientos'] || 0;
  }

  tiempoKnight(partida: Partida): string {
    const seg = partida.datos_extra?.['tiempo'] || 0;
    const mins = Math.floor(seg / 60);
    const secs = seg % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  iconoJuego(juego: string): string {
    switch (juego) {
      case 'Ahorcado': return '🪓';
      case 'Mayor o Menor': return '🃏';
      case 'Preguntados': return '🧠';
      case 'Path of the Knight': return '♞';
      default: return '🎮';
    }
  }

  detallePartida(partida: Partida): string {
    switch (partida.juego) {
      case 'Ahorcado':
        return `${this.palabraAhorcado(partida)} · ${this.tiempoAhorcado(partida)} · ${this.letrasAhorcado(partida)} letras`;
      case 'Mayor o Menor':
        return `${partida.puntaje} cartas acertadas`;
      case 'Preguntados':
        return `${partida.puntaje}/10 · ${this.porcentajePreguntados(partida)}% · ${this.tiempoPreguntados(partida)}`;
      case 'Path of the Knight':
        return `${partida.puntaje}/${partida.datos_extra?.['paquetes_total'] || 5} paquetes · ${this.movimientosKnight(partida)} mov · ${this.tiempoKnight(partida)}`;
      default:
        return `${partida.puntaje} pts`;
    }
  }
}
