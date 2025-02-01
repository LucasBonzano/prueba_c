import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { provideHttpClient } from '@angular/common/http';
import { ClienteListComponent } from './app/cliente-list/cliente-list.component';
import { AuthGuard } from './app/auth.guard';
import { FormComponent } from './app/form/form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'list', component: ClienteListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }, // Redirigir al login si no se encuentra la ruta
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()]
}).catch(err => console.error(err));
