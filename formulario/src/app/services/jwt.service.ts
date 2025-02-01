import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private tokenKey = 'auth_token';

  getToken(): string | null {
    const token = sessionStorage.getItem(this.tokenKey);
    return token;
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
    return 
    
  }

  removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    return console.log('JwtService - Token eliminado'); // ✅ Log cuando se elimina el token
  }
}
