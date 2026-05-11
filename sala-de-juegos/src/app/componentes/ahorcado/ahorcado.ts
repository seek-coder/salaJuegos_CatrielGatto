import { Component, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { JuegosService } from '../../servicios/juegos.service';

const PALABRAS = [
  'ANGULAR', 'COMPONENTE', 'SERVICIO', 'TYPESCRIPT', 'MODULAR',
  'ENRUTADOR', 'DIRECTIVA', 'OBSERVABLE', 'PLANTILLA', 'INYECCION',
  'INTERFAZ', 'NAVEGADOR', 'VARIABLE', 'FUNCION', 'PROMESA',
  'ARREGLO', 'MODULO', 'SELECTOR', 'EMISOR', 'DECORADOR',
  'FORMULARIO', 'VALIDADOR', 'REACTIVO', 'SINGLETON', 'BOOTSTRAP'
];

const MAX_ERRORES = 6;

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.scss'
})
export class AhorcadoComponent implements OnInit, OnDestroy {
  abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  palabraSecreta = signal('');
  letrasUsadas = signal<string[]>([]);
  errores = signal(0);
  estado = signal<'jugando' | 'gano' | 'perdio'>('jugando');

  tiempoSegundos = signal(0);
  private timerInterval: any = null;

  mostrarModal = signal(false);

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

  @HostListener('document:keydown', ['$event'])
  bloquearTeclado(event: KeyboardEvent) {
    if (this.estado() === 'jugando') {
      event.preventDefault();
    }
  }

  iniciarJuego() {
    const indice = Math.floor(Math.random() * PALABRAS.length);
    this.palabraSecreta.set(PALABRAS[indice]);
    this.letrasUsadas.set([]);
    this.errores.set(0);
    this.estado.set('jugando');
    this.tiempoSegundos.set(0);
    this.mostrarModal.set(false);
    this.iniciarTimer();
  }

  get palabraMostrada(): string[] {
    return this.palabraSecreta().split('').map(letra =>
      this.letrasUsadas().includes(letra) ? letra : '_'
    );
  }

  get maxErrores(): number {
    return MAX_ERRORES;
  }

  letraUsada(letra: string): boolean {
    return this.letrasUsadas().includes(letra);
  }

  letraCorrecta(letra: string): boolean {
    return this.letraUsada(letra) && this.palabraSecreta().includes(letra);
  }

  letraIncorrecta(letra: string): boolean {
    return this.letraUsada(letra) && !this.palabraSecreta().includes(letra);
  }

  seleccionarLetra(letra: string) {
    if (this.estado() !== 'jugando') return;
    if (this.letrasUsadas().includes(letra)) return;

    this.letrasUsadas.update(usadas => [...usadas, letra]);

    if (!this.palabraSecreta().includes(letra)) {
      this.errores.update(e => e + 1);
    }

    this.verificarEstado();
  }

  private verificarEstado() {
    const todasAdivinadas = this.palabraSecreta().split('').every(
      letra => this.letrasUsadas().includes(letra)
    );

    if (todasAdivinadas) {
      this.estado.set('gano');
      this.detenerTimer();
      this.guardarResultado();
      this.mostrarModal.set(true);
    } else if (this.errores() >= MAX_ERRORES) {
      this.estado.set('perdio');
      this.detenerTimer();
      this.guardarResultado();
      this.mostrarModal.set(true);
    }
  }

  private async guardarResultado() {
    await this.juegosService.guardarPartida('Ahorcado', this.estado() === 'gano' ? 1 : 0, {
      tiempo: this.tiempoSegundos(),
      letras_intentadas: this.letrasUsadas().length,
      palabra: this.palabraSecreta(),
      resultado: this.estado(),
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
}
