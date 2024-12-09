import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { Departamento } from 'src/app/interfaces/Departamento';
import { InfraestructuraService } from 'src/app/services/infraestructura.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.page.html',
  styleUrls: ['./departamento.page.scss'],
})
export class DepartamentoPage implements OnInit {
  departamentoForm = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required])
  });

  constructor(
    private params: NavParams,
    private infraestructuraService: InfraestructuraService
  ) {
    if (params.get('data')) {
      let a: Departamento = params.get('data');
      this.departamentoForm.setValue({
        id: a.id,
        nombre: a.nombre
      });
    }
  }

  ngOnInit() {
    
  }

  onSave() {
    if (this.departamentoForm.valid) {
      let aula: Departamento = {
        id: this.departamentoForm.controls['id'].value!,
        nombre: this.departamentoForm.controls['nombre'].value!
      }

      if(aula.id!=''){
        this.infraestructuraService.updateDepartamento(aula).then(() => {
          this.params.get('modal').dismiss();
        });
      }else{
        this.infraestructuraService.addDepartamento(aula).then(() => {
          this.params.get('modal').dismiss();
        });
      }      
    }
  }

  onCancel() {
    this.params.get('modal').dismiss();
  }
}