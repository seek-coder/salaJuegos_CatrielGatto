import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './servicios/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'sala-de-juegos';
  menuOpen = false;

  // uso authService publico para leer el usuarioActual desde el html
  constructor(public authService: AuthService) {}

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.menuOpen = false;
  }
}
