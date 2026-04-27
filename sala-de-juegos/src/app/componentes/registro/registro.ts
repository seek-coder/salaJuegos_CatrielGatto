import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  confirmarPassword = '';

  // TODO Sprint 2: inyectar SupabaseService y usar signUp()
  onSubmit() {
    console.log('Registro de:', this.nombre, this.email);
  }
}
