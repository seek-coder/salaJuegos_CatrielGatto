import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

// defino la interfaz para la config de los juegos de la grilla
interface Juego {
  nombre: string;
  descripcion: string;
  icono: string;
  ruta: string;
  disponible: boolean;
  color: string;
}

// inyecto RouterLink para el enrutamiento desde el html
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

// datos de los juegos para armar las cards
export class HomeComponent {

  // Inyectamos AuthService para acceder al estado del usuario desde el template.
  constructor(public authService: AuthService) {}

  juegos: Juego[] = [
    {
      nombre: 'Ahorcado',
      descripcion: 'Adiviná la palabra letra por letra antes de que se complete el dibujo.',
      icono: '🪓',
      ruta: '/juegos/ahorcado',
      disponible: false, // deshabilitado hasta que se implementen en proximos sprints
      color: 'cyan'
    },
    {
      nombre: 'Mayor o Menor',
      descripcion: 'Adiviná si la siguiente carta es mayor o menor que la anterior.',
      icono: '🃏',
      ruta: '/juegos/mayor-menor',
      disponible: false,
      color: 'purple'
    },
    {
      nombre: 'Preguntados',
      descripcion: 'Respondé preguntas de trivia contra el reloj.',
      icono: '🧠',
      ruta: '/juegos/preguntados',
      disponible: false,
      color: 'amber'
    },
    {
      nombre: 'Path of the Knight',
      descripcion: 'Controlá un caballo de ajedrez y recolectá paquetes de datos sin quedarte sin casillas.',
      icono: '♞',
      ruta: '/juegos/path-of-the-knight',
      disponible: false,
      color: 'green'
    }
  ];

  // logout
  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}
