import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

interface Juego {
  nombre: string;
  descripcion: string;
  icono: string;
  ruta: string;
  disponible: boolean;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  constructor(public authService: AuthService) {}

  juegos: Juego[] = [
    {
      nombre: 'Ahorcado',
      descripcion: 'Adiviná la palabra letra por letra antes de que se complete el dibujo.',
      icono: '🪓',
      ruta: '/juegos/ahorcado',
      disponible: true,
      color: 'cyan'
    },
    {
      nombre: 'Mayor o Menor',
      descripcion: 'Adiviná si la siguiente carta es mayor o menor que la anterior.',
      icono: '🃏',
      ruta: '/juegos/mayor-menor',
      disponible: true,
      color: 'purple'
    },
    {
      nombre: 'Preguntados',
      descripcion: 'Respondé preguntas de trivia contra el reloj.',
      icono: '🧠',
      ruta: '/juegos/preguntados',
      disponible: true,
      color: 'amber'
    },
    {
      nombre: 'Path of the Knight',
      descripcion: 'Controlá un caballo de ajedrez y recolectá paquetes de datos sin quedarte sin casillas.',
      icono: '♞',
      ruta: '/juegos/path-of-the-knight',
      disponible: true,
      color: 'green'
    }
  ];

  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}
