import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  templateUrl: './cliente-list.component.html',
  imports: [CommonModule, NgClass, FormComponent]
})
export class ClienteListComponent implements OnInit {
  clientes: any[] = [];

  constructor(private clienteService: ClienteService, private http: HttpClient) {}

  ngOnInit() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log('Clientes recibidos:', data);
        this.clientes= data;
      },
      error: (err) => console.error('Error al obtener clientes:', err)
    });
  }

  clienteSeleccionado: any = null;

  seleccionarCliente(cliente: any) {
    this.clienteSeleccionado = cliente;
  }

  editarCliente(id: number) {
    console.log('Editar cliente con ID:', id);
    // Aquí puedes abrir el modal y cargar los datos en `model`
  }


  eliminarCliente(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.deleteClientes(id).subscribe(
        () => {
          this.clientes = this.clientes.filter(cliente => cliente.id !== id);
          console.log('Cliente eliminado:', id);
        },
        error => {
          console.error('Error al eliminar cliente', error);
        }
      );
    }
  }
}  

