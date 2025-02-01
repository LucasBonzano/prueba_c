import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { JwtService } from './services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(): boolean {
    const token = this.jwtService.getToken();
    console.log('AuthGuard - Token encontrado:', token);  // Verifica si se encuentra el token

    if (!token) {
      console.warn('AuthGuard - No hay token');
      return false;  // Redirige si no hay token
    }

    return true;  // Permite la navegación si hay token
  }
}
