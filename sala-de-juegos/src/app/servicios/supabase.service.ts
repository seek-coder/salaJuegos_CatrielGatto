import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

// Este servicio es un singleton (una sola instancia en toda la app) gracias a providedIn: 'root'.
// Eso significa que todos los componentes que lo inyecten comparten el MISMO cliente de Supabase.
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // createClient inicializa la conexión con tu proyecto de Supabase.
    // Recibe la URL del proyecto y la anon key (pública).
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Exponemos el cliente para usarlo desde cualquier componente.
  get client(): SupabaseClient {
    return this.supabase;
  }
}
