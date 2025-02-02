import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtService } from './services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.jwtService.getToken();

    if (!token.token) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.isTokenExpired(token.token)) {
      this.jwtService.removeToken();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(tokenPayload.exp * 1000);
      return expirationDate < new Date();
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return true;
    }
  }
}