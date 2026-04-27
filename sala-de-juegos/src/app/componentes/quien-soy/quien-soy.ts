import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Para traer info. desde GitHub uso la API correspondiente, llamada "GitHub API". Este tipo de APIs que devuelven datos en formato JSON se llaman APIs REST.
interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
  html_url: string;
  company: string;
  blog: string;
  created_at: string;
}

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.scss'
})
export class QuienSoyComponent implements OnInit {
  profile = signal<GitHubProfile | null>(null);
  loading = signal(true);
  error = signal(false);

  readonly githubUsername = 'seek-coder';
  readonly apiUrl = `https://api.github.com/users/${this.githubUsername}`;

  constructor(private http: HttpClient) {}

  // En OnInit uso el método GET de HttpClient para obtener los datos de la API.
  // El método subscribe() se usa para suscribirse a la respuesta de la API.
  // En el caso de que la respuesta sea exitosa (next), se guarda el perfil y se detiene la carga.
  // En el caso de que haya un error (error), se guarda el error y se detiene la carga.
  // El método unsubscribe() se usa para cancelar la suscripción a la respuesta de la API.
  ngOnInit() {
    this.http.get<GitHubProfile>(this.apiUrl).subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
