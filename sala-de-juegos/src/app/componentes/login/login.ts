import { Component, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  // form para el login
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  // flags para la UI
  mostrarModal = false;
  mensajeError = '';
  cargando = false;

  // mocks para cumplir con el requisito de ingreso rápido
  usuariosRapidos = [
    { email: 'test1@test.com', password: '123456', nombre: 'Usuario 1' },
    { email: 'test2@test.com', password: '123456', nombre: 'Usuario 2' },
    { email: 'test3@test.com', password: '123456', nombre: 'Usuario 3' },
  ];

  // inyecto NgZone porque sino la UI se traba despues del await de supabase
  constructor(private authService: AuthService, private ngZone: NgZone) {}

  // getters para el html
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  // submit del login
  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.cargando = true;
    try {
      const error = await this.authService.iniciarSesion(
        this.email!.value!,
        this.password!.value!,
      );

      // forzamos el update visual
      this.ngZone.run(() => {
        if (error) {
          this.mensajeError = error;
          this.mostrarModal = true;
        }
        this.cargando = false;
      });
    } catch (e: any) {
      this.ngZone.run(() => {
        this.mensajeError = e.message || 'Error de conexión con el servidor.';
        this.mostrarModal = true;
        this.cargando = false;
      });
    }
  }

  // funcion para los 3 botones de login rapido
  async loginRapido(usuario: { email: string; password: string }) {
    this.loginForm.setValue({
      email: usuario.email,
      password: usuario.password,
    });

    this.cargando = true;
    try {
      const error = await this.authService.iniciarSesion(usuario.email, usuario.password);

      this.ngZone.run(() => {
        if (error) {
          this.mensajeError = error;
          this.mostrarModal = true;
        }
        this.cargando = false;
      });
    } catch (e: any) {
      this.ngZone.run(() => {
        this.mensajeError = e.message || 'Error de conexión con el servidor.';
        this.mostrarModal = true;
        this.cargando = false;
      });
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mensajeError = '';
  }
}
