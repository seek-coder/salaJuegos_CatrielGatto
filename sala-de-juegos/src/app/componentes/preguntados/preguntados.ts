import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { JuegosService } from '../../servicios/juegos.service';
import { TriviaService, Pregunta } from '../../servicios/trivia.service';

const TOTAL_PREGUNTAS = 10;

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.scss'
})
export class PreguntadosComponent implements OnInit, OnDestroy {
  preguntas = signal<Pregunta[]>([]);
  indicePregunta = signal(0);
  aciertos = signal(0);
  estado = signal<'cargando' | 'jugando' | 'respondida' | 'fin'>('cargando');
  respuestaElegida = signal<string | null>(null);
  mostrarModal = signal(false);
  errorCarga = signal(false);

  tiempoSegundos = signal(0);
  private timerInterval: any = null;

  constructor(
    public authService: AuthService,
    private juegosService: JuegosService,
    private triviaService: TriviaService,
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
    this.estado.set('cargando');
    this.indicePregunta.set(0);
    this.aciertos.set(0);
    this.respuestaElegida.set(null);
    this.mostrarModal.set(false);
    this.errorCarga.set(false);
    this.tiempoSegundos.set(0);
    this.detenerTimer();

    this.triviaService.obtenerPreguntas(TOTAL_PREGUNTAS).subscribe({
      next: (preguntas) => {
        this.preguntas.set(preguntas);
        this.estado.set('jugando');
        this.iniciarTimer();
      },
      error: () => {
        this.errorCarga.set(true);
        this.estado.set('cargando');
      }
    });
  }

  get preguntaActual(): Pregunta | null {
    const lista = this.preguntas();
    const idx = this.indicePregunta();
    return lista.length > idx ? lista[idx] : null;
  }

  get opciones(): string[] {
    return this.preguntaActual?.opciones || [];
  }

  get totalPreguntas(): number {
    return TOTAL_PREGUNTAS;
  }

  get progresoPorcentaje(): number {
    return ((this.indicePregunta()) / TOTAL_PREGUNTAS) * 100;
  }

  elegirRespuesta(opcion: string) {
    if (this.estado() !== 'jugando' || this.respuestaElegida()) return;

    this.respuestaElegida.set(opcion);
    this.estado.set('respondida');

    if (opcion === this.preguntaActual?.respuestaCorrecta) {
      this.aciertos.update(v => v + 1);
    }

    setTimeout(() => {
      this.siguientePregunta();
    }, 1200);
  }

  private siguientePregunta() {
    const siguiente = this.indicePregunta() + 1;

    if (siguiente >= TOTAL_PREGUNTAS) {
      this.estado.set('fin');
      this.detenerTimer();
      this.guardarResultado();
      this.mostrarModal.set(true);
    } else {
      this.indicePregunta.set(siguiente);
      this.respuestaElegida.set(null);
      this.estado.set('jugando');
    }
  }

  esCorrecta(opcion: string): boolean {
    return this.respuestaElegida() !== null && opcion === this.preguntaActual?.respuestaCorrecta;
  }

  esIncorrecta(opcion: string): boolean {
    return this.respuestaElegida() === opcion && opcion !== this.preguntaActual?.respuestaCorrecta;
  }

  private async guardarResultado() {
    await this.juegosService.guardarPartida('Preguntados', this.aciertos(), {
      total_preguntas: TOTAL_PREGUNTAS,
      tiempo: this.tiempoSegundos(),
      porcentaje: Math.round((this.aciertos() / TOTAL_PREGUNTAS) * 100),
    });
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

  dificultadColor(dificultad: string): string {
    switch (dificultad) {
      case 'easy': return '#9ece6a';
      case 'medium': return '#e0af68';
      case 'hard': return '#f7768e';
      default: return '#565f89';
    }
  }

  dificultadTexto(dificultad: string): string {
    switch (dificultad) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Media';
      case 'hard': return 'Difícil';
      default: return dificultad;
    }
  }
}
