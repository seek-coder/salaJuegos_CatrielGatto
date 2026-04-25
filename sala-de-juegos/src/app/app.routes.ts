import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login';
import { RegistroComponent } from './componentes/registro/registro';
import { HomeComponent } from './componentes/home/home';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  { path: '**', redirectTo: 'home' },
];
