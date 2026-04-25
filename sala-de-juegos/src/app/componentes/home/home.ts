import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Una interface es como una plantilla que define la estructura de un objeto.
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

// Acá se declaran las propiedades de la clase. En este caso, una lista de juegos. La lista de juegos incluye 4 objetos de tipo Juego, con sus respectivos nombres, descripciones, iconos, rutas, disponibilidad y colores.
export class HomeComponent {
  juegos: Juego[] = [
    {
      nombre: 'Ahorcado',
      descripcion: 'Adiviná la palabra letra por letra antes de que se complete el dibujo.',
      icono: '🪓',
      ruta: '/juegos/ahorcado',
      disponible: false, //por ahora no está implementado. Disponible: false quiere decir que no se han realizado los cambios pedidos en el enunciado del trabajo practico, aún.
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
      descripcion: 'Controlá un caballo de ajedrez y recolectá paquetes sin quedarte sin casillas.',
      icono: '♞',
      ruta: '/juegos/path-of-the-knight',
      disponible: false,
      color: 'green'
    }
  ];
}
