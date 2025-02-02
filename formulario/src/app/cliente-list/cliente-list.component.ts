import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormComponent } from '../form/form.component';
import { ClienteSharedService } from '../shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  templateUrl: './cliente-list.component.html',
  imports: [CommonModule, NgClass, FormComponent]
})
export class ClienteListComponent implements OnInit, OnDestroy {
  clientes: any[] = [];
  private refreshSubscription: Subscription;
  clienteSeleccionado: any = null;

  constructor(
    private clienteService: ClienteService, 
    private clienteSharedService: ClienteSharedService
  ) {
    // Suscribirse a las actualizaciones
    this.refreshSubscription = this.clienteSharedService.refreshList$.subscribe(
      refresh => {
        if (refresh) {
          this.obtenerClientes();
        }
      }
    );
  }

  ngOnInit() {
    this.obtenerClientes();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  obtenerClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log('Clientes recibidos:', data);
        this.clientes = data;
      },
      error: (err) => console.error('Error al obtener clientes:', err)
    });
  }

  editarCliente(id: number) {
    this.clienteService.getClienteById(id).subscribe({
      next: (response) => {
        this.clienteSharedService.updateClienteData(response);
      },
      error: (error) => {
        console.error('Error al obtener los datos del cliente:', error);
      }
    });
  }

  eliminarCliente(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.deleteClientes(id).subscribe({
        next: () => {
          this.obtenerClientes();
          console.log('Cliente eliminado:', id);
        },
        error: (error) => {
          console.error('Error al eliminar cliente', error);
        }
      });
    }
  }

  seleccionarCliente(cliente: any) {
    this.clienteSeleccionado = cliente;
  }
}