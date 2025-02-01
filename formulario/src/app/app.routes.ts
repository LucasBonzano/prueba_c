import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'list', component: ClienteListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }, // Redirigir al login si no se encuentra la ruta
];

