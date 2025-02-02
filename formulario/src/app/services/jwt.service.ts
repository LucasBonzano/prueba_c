import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private tokenKey = 'auth_token';
  private tokenName = 'Name';

  getToken() {
    const token = sessionStorage.getItem(this.tokenKey);
    const name = sessionStorage.getItem(this.tokenName);
    return {token: token, name: name};
  }

  setToken(token: string, name:string): void {
    sessionStorage.setItem(this.tokenKey, token);
    sessionStorage.setItem(this.tokenName, name);
    return 
    
  }

  removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenName);
    return console.log('JwtService - Token eliminado'); // ✅ Log cuando se elimina el token
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token.token !== null && !this.isTokenExpired(token.token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(tokenPayload.exp * 1000);
      return expirationDate < new Date();
    } catch {
      return true;
    }
  }
}
