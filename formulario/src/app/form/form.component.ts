import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service'; 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  // Modelo del formulario
  model = {
    fullName: '',
    id: '',
    age: null,
    gender: '',
    status: 'Activo',
    additionalAttributes: '',
    drives: false,
    wearsGlasses: false,
    isDiabetic: false,
    hasOtherDiseases: false,
    otherDiseases: ''
  };

  constructor(private clienteService: ClienteService) {}

  // Método para enviar datos
  onSubmit(formData: any) {
    const clienteData = {
      nombreCompleto: formData.fullName,
      identificacion: formData.id,
      edad: formData.age,
      genero: formData.gender,
      estado: formData.status,
      atributosAdicionales: formData.additionalAttributes,
      maneja: formData.drives,
      usaLentes: formData.wearsGlasses,
      diabetico: formData.isDiabetic,
      enfermedadesAdicionales: formData.otherDiseases
    };

    this.clienteService.createCliente(clienteData).subscribe(
      response => {
        console.log('Datos enviados correctamente', response);

        // 🔄 Recargar la página
        window.location.reload();
      },
      error => {
        console.error('Error al enviar los datos', error);
      }
    );
  }
}
