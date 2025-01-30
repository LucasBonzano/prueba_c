import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-form',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
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

  onSubmit() {
    console.log(this.model);
  }
}
