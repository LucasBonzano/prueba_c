import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteSharedService {
  private clienteDataSubject = new BehaviorSubject<any>(null);
  currentClienteData = this.clienteDataSubject.asObservable();

  private refreshListSubject = new BehaviorSubject<boolean>(false);
  refreshList$ = this.refreshListSubject.asObservable();

  updateClienteData(data: any) {
    this.clienteDataSubject.next(data);
  }

  refreshClienteList() {
    this.refreshListSubject.next(true);
  }
}