import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { JuegosService } from '../../servicios/juegos.service';

interface Celda {
  fila: number;
  col: number;
}

const FILAS = 8;
const COLS = 8;
const TOTAL_PAQUETES = 5;

const MOVIMIENTOS_CABALLO: [number, number][] = [
  [-2, -1], [-2, 1],
  [-1, -2], [-1, 2],
  [1, -2],  [1, 2],
  [2, -1],  [2, 1],
];

@Component({
  selector: 'app-path-knight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './path-knight.html',
  styleUrl: './path-knight.scss'
})
export class PathKnightComponent implements OnInit, OnDestroy {
  filasArray = Array.from({ length: FILAS }, (_, i) => i);
  colsArray = Array.from({ length: COLS }, (_, i) => i);

  posicionCaballo = signal<Celda>({ fila: 0, col: 0 });
  celdasVisitadas = signal<Set<string>>(new Set());
  paquetes = signal<Set<string>>(new Set());
  paquetesRecolectados = signal(0);
  estado = signal<'jugando' | 'gano' | 'perdio'>('jugando');
  mostrarModal = signal(false);
  movimientosRealizados = signal(0);
  celdasLegales = signal<Set<string>>(new Set());

  tiempoSegundos = signal(0);
  private timerInterval: any = null;

  constructor(
    public authService: AuthService,
    private juegosService: JuegosService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.usuarioActual()) {
      this.router.navigate(['/login']);
      return;
    }
    this.iniciarJuego();
  }

  ngOnDestroy() {
    this.detenerTimer();
  }

  iniciarJuego() {
    const filaInicial = Math.floor(Math.random() * FILAS);
    const colInicial = Math.floor(Math.random() * COLS);

    this.posicionCaballo.set({ fila: filaInicial, col: colInicial });

    const visitadas = new Set<string>();
    visitadas.add(this.celdaKey(filaInicial, colInicial));
    this.celdasVisitadas.set(visitadas);

    this.generarPaquetes(filaInicial, colInicial);
    this.paquetesRecolectados.set(0);
    this.movimientosRealizados.set(0);
    this.estado.set('jugando');
    this.mostrarModal.set(false);
    this.tiempoSegundos.set(0);

    this.actualizarCeldasLegales();
    this.iniciarTimer();
  }

  private generarPaquetes(filaExcluida: number, colExcluida: number) {
    const paquetesSet = new Set<string>();
    while (paquetesSet.size < TOTAL_PAQUETES) {
      const f = Math.floor(Math.random() * FILAS);
      const c = Math.floor(Math.random() * COLS);
      const key = this.celdaKey(f, c);
      if (f !== filaExcluida || c !== colExcluida) {
        paquetesSet.add(key);
      }
    }
    this.paquetes.set(paquetesSet);
  }

  celdaKey(fila: number, col: number): string {
    return `${fila}-${col}`;
  }

  esCaballoAqui(fila: number, col: number): boolean {
    const pos = this.posicionCaballo();
    return pos.fila === fila && pos.col === col;
  }

  esVisitada(fila: number, col: number): boolean {
    return this.celdasVisitadas().has(this.celdaKey(fila, col));
  }

  esPaquete(fila: number, col: number): boolean {
    return this.paquetes().has(this.celdaKey(fila, col));
  }

  esLegal(fila: number, col: number): boolean {
    return this.celdasLegales().has(this.celdaKey(fila, col));
  }

  moverCaballo(fila: number, col: number) {
    if (this.estado() !== 'jugando') return;
    if (!this.esLegal(fila, col)) return;

    const nuevaKey = this.celdaKey(fila, col);

    const nuevasVisitadas = new Set(this.celdasVisitadas());
    nuevasVisitadas.add(nuevaKey);
    this.celdasVisitadas.set(nuevasVisitadas);

    if (this.paquetes().has(nuevaKey)) {
      const nuevosPaquetes = new Set(this.paquetes());
      nuevosPaquetes.delete(nuevaKey);
      this.paquetes.set(nuevosPaquetes);
      this.paquetesRecolectados.update(v => v + 1);
    }

    this.posicionCaballo.set({ fila, col });
    this.movimientosRealizados.update(v => v + 1);

    this.actualizarCeldasLegales();
    this.verificarEstado();
  }

  private actualizarCeldasLegales() {
    const pos = this.posicionCaballo();
    const legales = new Set<string>();

    for (const [df, dc] of MOVIMIENTOS_CABALLO) {
      const nf = pos.fila + df;
      const nc = pos.col + dc;
      if (nf >= 0 && nf < FILAS && nc >= 0 && nc < COLS) {
        const key = this.celdaKey(nf, nc);
        if (!this.celdasVisitadas().has(key)) {
          legales.add(key);
        }
      }
    }

    this.celdasLegales.set(legales);
  }

  private verificarEstado() {
    if (this.paquetes().size === 0) {
      this.estado.set('gano');
      this.detenerTimer();
      this.guardarResultado();
      this.mostrarModal.set(true);
      return;
    }

    if (this.celdasLegales().size === 0) {
      this.estado.set('perdio');
      this.detenerTimer();
      this.guardarResultado();
      this.mostrarModal.set(true);
    }
  }

  private async guardarResultado() {
    await this.juegosService.guardarPartida('Path of the Knight', this.paquetesRecolectados(), {
      resultado: this.estado(),
      movimientos: this.movimientosRealizados(),
      tiempo: this.tiempoSegundos(),
      paquetes_total: TOTAL_PAQUETES,
    });
  }

  get totalPaquetes(): number {
    return TOTAL_PAQUETES;
  }

  private iniciarTimer() {
    this.detenerTimer();
    this.timerInterval = setInterval(() => {
      this.tiempoSegundos.update(t => t + 1);
    }, 1000);
  }

  private detenerTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  get tiempoFormateado(): string {
    const mins = Math.floor(this.tiempoSegundos() / 60);
    const secs = this.tiempoSegundos() % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  cerrarModalYReiniciar() {
    this.mostrarModal.set(false);
    this.iniciarJuego();
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }
}
