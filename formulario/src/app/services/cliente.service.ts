import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:5107/api/clientes'; // Ajusta la URL de tu API
  private pepe:any
  constructor(private http: HttpClient) {}

  getClienteById(id: number): Observable<any> {
    const authToken = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  createCliente(cliente: any): Observable<any> {
    const authToken = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    const solicitud = this.http.post<any>(this.apiUrl, cliente, { headers });
    return solicitud
  }

  getClientes(): Observable<any> {
    const authToken = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  updateCliente(id: number, data: any): Observable<any> {
    const authToken = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });

    const solicitud = this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers });
    return solicitud
  }

  deleteClientes(id: number): Observable<any> {
    const authToken = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    const solicitud = this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
    return solicitud
  }
}
