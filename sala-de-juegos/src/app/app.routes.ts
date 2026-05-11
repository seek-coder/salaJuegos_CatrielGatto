import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login';
import { RegistroComponent } from './componentes/registro/registro';
import { HomeComponent } from './componentes/home/home';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado';
import { MayorMenorComponent } from './componentes/mayor-menor/mayor-menor';
import { ChatComponent } from './componentes/chat/chat';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  { path: 'juegos/ahorcado', component: AhorcadoComponent },
  { path: 'juegos/mayor-menor', component: MayorMenorComponent },
  { path: 'chat', component: ChatComponent },
  { path: '**', redirectTo: 'home' },
];
