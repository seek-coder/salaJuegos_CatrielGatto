import { Component, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class RegistroComponent {

  // form de registro con los campos obligatorios
  registroForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  mostrarModal = false;
  mensajeError = '';
  cargando = false;

  constructor(private authService: AuthService, private ngZone: NgZone) {}

  // getters para el html
  get email() { return this.registroForm.get('email'); }
  get nombre() { return this.registroForm.get('nombre'); }
  get apellido() { return this.registroForm.get('apellido'); }
  get edad() { return this.registroForm.get('edad'); }
  get password() { return this.registroForm.get('password'); }

  async onSubmit() {
    if (this.registroForm.invalid) return;

    this.cargando = true;
    try {
      const error = await this.authService.registrar(
        this.email!.value!,
        this.password!.value!,
        this.nombre!.value!,
        this.apellido!.value!,
        Number(this.edad!.value),
      );

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
