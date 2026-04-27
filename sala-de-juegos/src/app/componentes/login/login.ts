import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email = '';
  password = '';

  // TODO Sprint 2: inyectar SupabaseService y usar signInWithPassword()
  onSubmit() {
    console.log('Login con:', this.email);
  }
}
