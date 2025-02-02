import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { ClienteSharedService } from '../shared/shared.service';
import { Subscription } from 'rxjs';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-form',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnDestroy, AfterViewInit {
  private subscription: Subscription;
  isEditing = false;
  clienteId: number | null = null;
  private modalInstance!: Modal;
  clienteDataUpdate = {};
  clienteData = {};
  @ViewChild('clienteModal') modalElement!: ElementRef;

  model = {
    fullName: '',
    cuil: '',
    age: 0,
    gender: '',
    status: 'Activo',
    additionalAttributes: '',
    drives: false,
    wearsGlasses: false,
    isDiabetic: false,
    hasOtherDiseases: false,
    otherDiseases: ''
  };

  constructor(
    private clienteService: ClienteService,
    private clienteSharedService: ClienteSharedService
  ) {
    this.subscription = this.clienteSharedService.currentClienteData.subscribe(data => {
      if (data) {
        this.isEditing = true;
        this.clienteId = data.id;
        this.model = {
          fullName: data.nombreCompleto,
          cuil: data.cuil,
          age: data.edad,
          gender: data.genero,
          status: data.estado,
          additionalAttributes: data.atributosAdicionales,
          drives: data.maneja,
          wearsGlasses: data.usaLentes,
          isDiabetic: data.diabetico,
          hasOtherDiseases: !!data.enfermedadesAdicionales,
          otherDiseases: data.enfermedadesAdicionales || ''
        };
        this.modalInstance.show();
      } else {
        this.resetForm();
      }
    });
  }

  ngAfterViewInit() {
    if (this.modalElement?.nativeElement) {
      this.modalInstance = new Modal(this.modalElement.nativeElement);
    }
    const modal = document.getElementById('clienteModal');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  resetForm() {
    this.isEditing = false;
    this.clienteId = null;
    this.model = {
      fullName: '',
      cuil: '',
      age: 0,
      gender: '',
      status: 'Activo',
      additionalAttributes: '',
      drives: false,
      wearsGlasses: false,
      isDiabetic: false,
      hasOtherDiseases: false,
      otherDiseases: ''
    };
  }

  onSubmit(formData: any) {

    if (this.isEditing) {
      this.clienteDataUpdate = {
        id: this.clienteId,
        nombreCompleto: formData.fullName,
        cuil: formData.cuil,
        edad: formData.age,
        genero: formData.gender,
        estado: formData.status,
        atributosAdicionales: formData.additionalAttributes,
        maneja: formData.drives,
        usaLentes: formData.wearsGlasses,
        diabetico: formData.isDiabetic,
        enfermedadesAdicionales: formData.otherDiseases
      };
    } else {
      this.clienteData = {
        nombreCompleto: formData.fullName,
        cuil: formData.cuil,
        edad: formData.age,
        genero: formData.gender,
        estado: formData.status,
        atributosAdicionales: formData.additionalAttributes,
        maneja: formData.drives,
        usaLentes: formData.wearsGlasses,
        diabetico: formData.isDiabetic,
        enfermedadesAdicionales: formData.otherDiseases
      };
    }

    const operation = this.isEditing
      ? this.clienteService.updateCliente(this.clienteId!, this.clienteDataUpdate)
      : this.clienteService.createCliente(this.clienteData);

    operation.subscribe({
      next: (response: any) => {
        console.log('Operación exitosa', response);
        this.resetForm();
        this.modalInstance.hide();
        this.clienteSharedService.refreshClienteList();
      },
      error: (error: any) => {
        console.error('Error en la operación', error);
      }
    });
  }
}
