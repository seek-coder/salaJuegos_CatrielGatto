import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { JuegosService } from '../../servicios/juegos.service';

interface Carta {
  valor: number;
  palo: string;
  nombre: string;
  emoji: string;
}

// podría pasar esto a JSON también
const PALOS: { nombre: string; emoji: string }[] = [
  { nombre: 'Espadas', emoji: '♠' },
  { nombre: 'Corazones', emoji: '♥' },
  { nombre: 'Diamantes', emoji: '♦' },
  { nombre: 'Tréboles', emoji: '♣' },
];

const VALORES: { valor: number; nombre: string }[] = [
  { valor: 1, nombre: 'A' },
  { valor: 2, nombre: '2' },
  { valor: 3, nombre: '3' },
  { valor: 4, nombre: '4' },
  { valor: 5, nombre: '5' },
  { valor: 6, nombre: '6' },
  { valor: 7, nombre: '7' },
  { valor: 8, nombre: '8' },
  { valor: 9, nombre: '9' },
  { valor: 10, nombre: '10' },
  { valor: 11, nombre: 'J' },
  { valor: 12, nombre: 'Q' },
  { valor: 13, nombre: 'K' },
];

function generarMazo(): Carta[] {
  const mazo: Carta[] = [];
  for (const palo of PALOS) {
    for (const val of VALORES) {
      mazo.push({
        valor: val.valor,
        palo: palo.nombre,
        nombre: val.nombre,
        emoji: palo.emoji,
      });
    }
  }
  return mezclar(mazo);
}

function mezclar(arr: Carta[]): Carta[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.scss'
})
export class MayorMenorComponent implements OnInit {
  mazo = signal<Carta[]>([]);
  cartaActual = signal<Carta | null>(null);
  cartaSiguiente = signal<Carta | null>(null);
  aciertos = signal(0);
  estado = signal<'jugando' | 'perdio'>('jugando');
  mostrarModal = signal(false);
  revelando = signal(false);
  ultimaEleccion = signal<'mayor' | 'menor' | null>(null);

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

  iniciarJuego() {
    const nuevoMazo = generarMazo();
    this.cartaActual.set(nuevoMazo[0]);
    this.mazo.set(nuevoMazo.slice(1));
    this.cartaSiguiente.set(null);
    this.aciertos.set(0);
    this.estado.set('jugando');
    this.mostrarModal.set(false);
    this.revelando.set(false);
    this.ultimaEleccion.set(null);
  }

  elegir(eleccion: 'mayor' | 'menor') {
    if (this.estado() !== 'jugando' || this.revelando()) return;

    const mazoActual = this.mazo();
    if (mazoActual.length === 0) return;

    const siguiente = mazoActual[0];
    this.cartaSiguiente.set(siguiente);
    this.ultimaEleccion.set(eleccion);
    this.revelando.set(true);

    const actual = this.cartaActual()!;
    const acierto =
      (eleccion === 'mayor' && siguiente.valor >= actual.valor) ||
      (eleccion === 'menor' && siguiente.valor <= actual.valor);

    setTimeout(() => {
      if (acierto) {
        this.aciertos.update(v => v + 1);
        this.cartaActual.set(siguiente);
        this.mazo.set(mazoActual.slice(1));
        this.cartaSiguiente.set(null);
        this.revelando.set(false);

        if (mazoActual.length <= 1) {
          this.estado.set('perdio');
          this.guardarResultado();
          this.mostrarModal.set(true);
        }
      } else {
        this.estado.set('perdio');
        this.guardarResultado();
        this.mostrarModal.set(true);
      }
    }, 800);
  }

  private async guardarResultado() {
    await this.juegosService.guardarPartida('Mayor o Menor', this.aciertos(), {
      cartas_acertadas: this.aciertos(),
    });
  }

  get cartasRestantes(): number {
    return this.mazo().length;
  }

  esRoja(carta: Carta): boolean {
    return carta.palo === 'Corazones' || carta.palo === 'Diamantes';
  }

  cerrarModalYReiniciar() {
    this.mostrarModal.set(false);
    this.iniciarJuego();
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }
}
