import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', loadComponent: () => import('./componentes/login/login').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./componentes/registro/registro').then(m => m.RegistroComponent) },
  { path: 'quien-soy', loadComponent: () => import('./componentes/quien-soy/quien-soy').then(m => m.QuienSoyComponent) },
  { path: 'juegos/ahorcado', loadComponent: () => import('./componentes/ahorcado/ahorcado').then(m => m.AhorcadoComponent) },
  { path: 'juegos/mayor-menor', loadComponent: () => import('./componentes/mayor-menor/mayor-menor').then(m => m.MayorMenorComponent) },
  { path: 'juegos/preguntados', loadComponent: () => import('./componentes/preguntados/preguntados').then(m => m.PreguntadosComponent) },
  { path: 'juegos/path-of-the-knight', loadComponent: () => import('./componentes/path-knight/path-knight').then(m => m.PathKnightComponent) },
  { path: 'chat', loadComponent: () => import('./componentes/chat/chat').then(m => m.ChatComponent) },
  { path: 'resultados', loadComponent: () => import('./componentes/resultados/resultados').then(m => m.ResultadosComponent) },
  { path: '**', redirectTo: 'home' },
];
