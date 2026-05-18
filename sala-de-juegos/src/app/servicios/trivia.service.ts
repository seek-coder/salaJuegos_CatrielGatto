import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PaisAPI {
  name: { common: string };
  flags: { png: string; svg: string };
  translations: {
    spa?: { common: string };
    [key: string]: { common: string; official?: string } | undefined;
  };
}

export interface Pregunta {
  texto: string;
  opciones: string[];
  respuestaCorrecta: string;
  dificultad: string;
  imagenUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class TriviaService {
  private apiUrl = 'https://restcountries.com/v3.1/all?fields=name,flags,translations';

  constructor(private http: HttpClient) {}

  obtenerPreguntas(cantidad: number = 10): Observable<Pregunta[]> {
    return this.http.get<PaisAPI[]>(this.apiUrl).pipe(
      map(paises => this.generarPreguntas(paises, cantidad))
    );
  }

  private generarPreguntas(paises: PaisAPI[], cantidad: number): Pregunta[] {
    const paisesValidos = paises.filter(
      p => p.translations?.spa?.common && p.flags?.png
    );

    const preguntas: Pregunta[] = [];
    const usados = new Set<number>();

    while (preguntas.length < cantidad && usados.size < paisesValidos.length) {
      const idx = Math.floor(Math.random() * paisesValidos.length);
      if (usados.has(idx)) continue;
      usados.add(idx);

      const paisCorrecto = paisesValidos[idx];
      const nombreCorrecto = paisCorrecto.translations.spa!.common;

      const incorrectas = this.obtenerIncorrectas(paisesValidos, idx, 3);

      if (incorrectas.length < 3) continue;

      const opciones = this.mezclar([nombreCorrecto, ...incorrectas]);

      const dificultad = this.calcularDificultad(paisCorrecto);

      preguntas.push({
        texto: '¿A qué país pertenece esta bandera?',
        opciones,
        respuestaCorrecta: nombreCorrecto,
        dificultad,
        imagenUrl: paisCorrecto.flags.png,
      });
    }

    return preguntas;
  }

  private obtenerIncorrectas(paises: PaisAPI[], excluirIdx: number, cantidad: number): string[] {
    const nombres = new Set<string>();
    const nombreCorrecto = paises[excluirIdx].translations.spa!.common;
    let intentos = 0;

    while (nombres.size < cantidad && intentos < 100) {
      intentos++;
      const idx = Math.floor(Math.random() * paises.length);
      if (idx === excluirIdx) continue;

      const nombre = paises[idx].translations?.spa?.common;
      if (nombre && nombre !== nombreCorrecto && !nombres.has(nombre)) {
        nombres.add(nombre);
      }
    }

    return Array.from(nombres);
  }

  private calcularDificultad(pais: PaisAPI): string {
    const nombre = pais.translations.spa!.common.toLowerCase();
    const conocidos = [
      'argentina', 'brasil', 'chile', 'méxico', 'colombia', 'perú', 'uruguay',
      'estados unidos', 'canadá', 'españa', 'francia', 'alemania', 'italia',
      'japón', 'china', 'rusia', 'australia', 'reino unido', 'india',
      'venezuela', 'ecuador', 'bolivia', 'paraguay', 'cuba', 'costa rica',
      'panamá', 'portugal', 'suecia', 'noruega', 'suiza',
    ];
    const intermedios = [
      'turquía', 'grecia', 'egipto', 'sudáfrica', 'nigeria', 'marruecos',
      'tailandia', 'corea del sur', 'nueva zelanda', 'irlanda', 'finlandia',
      'dinamarca', 'austria', 'bélgica', 'países bajos', 'república dominicana',
      'honduras', 'guatemala', 'nicaragua', 'el salvador', 'puerto rico',
      'filipinas', 'indonesia', 'vietnam', 'arabia saudí', 'israel',
    ];

    if (conocidos.includes(nombre)) return 'easy';
    if (intermedios.includes(nombre)) return 'medium';
    return 'hard';
  }

  private mezclar(arr: string[]): string[] {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }
}
