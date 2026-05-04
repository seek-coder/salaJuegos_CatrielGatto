import { Injectable, NgZone, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Router } from '@angular/router';

// interfaz para los datos publicos del usuario
interface UsuarioApp {
  email: string;
  nombre: string;
  apellido: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // estado reactivo del usuario logueado
  usuarioActual = signal<UsuarioApp | null>(null);

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private ngZone: NgZone
  ) {
    // recupero la sesion si recargan la pagina
    this.verificarSesion();
  }

  // verifica el token guardado
  private async verificarSesion() {
    try {
      const { data } = await this.supabaseService.client.auth.getSession();

      if (data.session) {
        const email = data.session.user.email!;
        await this.cargarDatosUsuario(email);
      }
    } catch (e) {
      console.error('Error al verificar sesión:', e);
    }
  }

  // trae los datos extra de la db
  private async cargarDatosUsuario(email: string) {
    const { data } = await this.supabaseService.client
      .from('usuarios')
      .select('email, nombre, apellido')
      .eq('email', email)
      .single();

    if (data) {
      // update del signal dentro de ngZone para q se entere la UI
      this.ngZone.run(() => {
        this.usuarioActual.set({
          email: data.email,
          nombre: data.nombre,
          apellido: data.apellido,
        });
      });
    }
  }

  // registro de usuario y guardado de datos extra
  async registrar(email: string, password: string, nombre: string, apellido: string, edad: number): Promise<string | null> {
    // supabase auth
    const { error: authError } = await this.supabaseService.client.auth.signUp({
      email,
      password,
    });

    if (authError) {
      if (authError.message === 'User already registered') return 'El usuario ya está registrado.';
      return authError.message;
    }

    // guardo el resto de datos en la tabla (sin la pass)
    const { error: dbError } = await this.supabaseService.client
      .from('usuarios')
      .insert({ email, nombre, apellido, edad });

    if (dbError) {
      return dbError.message;
    }

    // autologin despues de registrar
    const loginError = await this.iniciarSesion(email, password);
    return loginError;
  }

  // login con email y pass
  async iniciarSesion(email: string, password: string): Promise<string | null> {
    const { error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') return 'Credenciales inválidas. Revisá el email y la contraseña.';
      return error.message;
    }

    // cargo la data de la db y redirijo
    await this.cargarDatosUsuario(email);
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
    return null;
  }

  // logout
  async cerrarSesion() {
    await this.supabaseService.client.auth.signOut();
    this.ngZone.run(() => {
      this.usuarioActual.set(null);
      this.router.navigate(['/home']);
    });
  }
}
