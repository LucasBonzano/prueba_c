import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:5107/api/clientes'; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any> {
    const authToken = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }

  createCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente);
  }

  putClientes(id: number): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, id);
  }

  deleteClientes(id: number): Observable<any[]> {
    return this.http.delete<any[]>(this.apiUrl + `/${id}` );
  }
}
