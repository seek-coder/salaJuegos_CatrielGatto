import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
