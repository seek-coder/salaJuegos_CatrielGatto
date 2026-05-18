import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PreguntaAPI {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Pregunta {
  texto: string;
  opciones: string[];
  respuestaCorrecta: string;
  dificultad: string;
}

interface TriviaResponse {
  response_code: number;
  results: PreguntaAPI[];
}

@Injectable({
  providedIn: 'root',
})
export class TriviaService {
  private apiUrl = 'https://opentdb.com/api.php';

  constructor(private http: HttpClient) {}

  obtenerPreguntas(cantidad: number = 10): Observable<Pregunta[]> {
    const url = `${this.apiUrl}?amount=${cantidad}&category=15&type=multiple`;

    return this.http.get<TriviaResponse>(url).pipe(
      map(response => response.results.map(r => this.transformar(r)))
    );
  }

  private transformar(raw: PreguntaAPI): Pregunta {
    const opciones = this.mezclar([...raw.incorrect_answers, raw.correct_answer]);

    return {
      texto: this.decodificarHTML(raw.question),
      opciones: opciones.map(o => this.decodificarHTML(o)),
      respuestaCorrecta: this.decodificarHTML(raw.correct_answer),
      dificultad: raw.difficulty,
    };
  }

  private mezclar(arr: string[]): string[] {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  private decodificarHTML(texto: string): string {
    const doc = new DOMParser().parseFromString(texto, 'text/html');
    return doc.documentElement.textContent || texto;
  }
}
