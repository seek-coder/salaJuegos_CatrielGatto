import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Una interface es como una plantilla que define la estructura de un objeto. Lo uso acá para que el tipado sea consistente. Por ejemplo, si yo me equivocara y en lugar de un string pusiera un número en el nombre del juego, me saltaría un error de tipado y no me dejaría ejecutar el código. Lo que hace que TypeScript sea tan útil, es justamente eso. Evita errores antes de que se ejecute el código.
interface Juego {
  nombre: string;
  descripcion: string;
  icono: string;
  ruta: string;
  disponible: boolean;
  color: string;
}

// Angular necesita saber qué otros componentes, directivas o pipes necesita para funcionar. En este caso, necesita RouterLink para poder navegar entre rutas. Por eso, lo importamos y lo pasamos como parámetro del decorador @Component en la propiedad imports.
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
      descripcion: 'Controlá un caballo de ajedrez y recolectá paquetes de datos sin quedarte sin casillas.',
      icono: '♞',
      ruta: '/juegos/path-of-the-knight',
      disponible: false,
      color: 'green'
    }
  ];
}
