import { Component, OnInit, OnDestroy, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { ChatService, Mensaje } from '../../servicios/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  readonly MAX_CARACTERES = 200;

  textoMensaje = signal('');
  enviando = signal(false);
  caracteresRestantes = computed(() => this.MAX_CARACTERES - this.textoMensaje().length);

  @ViewChild('contenedorMensajes') contenedorMensajes!: ElementRef;

  constructor(
    public authService: AuthService,
    public chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.usuarioActual()) {
      this.router.navigate(['/login']);
      return;
    }
    this.chatService.cargarMensajes().then(() => {
      this.scrollAlFinal();
    });
    this.chatService.suscribirse();
  }

  ngOnDestroy() {
    this.chatService.desuscribirse();
  }

  esMio(mensaje: Mensaje): boolean {
    const usuario = this.authService.usuarioActual();
    return !!usuario && mensaje.usuario === usuario.email;
  }

  async enviar() {
    const texto = this.textoMensaje().trim();
    if (!texto) return;

    const usuario = this.authService.usuarioActual();
    if (!usuario) return;

    this.enviando.set(true);
    await this.chatService.enviarMensaje(usuario.email, texto);
    this.textoMensaje.set('');
    this.enviando.set(false);

    setTimeout(() => this.scrollAlFinal(), 100);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  actualizarTexto(valor: string) {
    if (valor.length <= this.MAX_CARACTERES) {
      this.textoMensaje.set(valor);
    } else {
      this.textoMensaje.set(valor.substring(0, this.MAX_CARACTERES));
    }
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
    });
  }

  extraerNombre(email: string): string {
    return email.split('@')[0];
  }

  private scrollAlFinal() {
    if (this.contenedorMensajes) {
      const el = this.contenedorMensajes.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
