import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { Aula } from 'src/app/interfaces/aula';
import { Departamento } from 'src/app/interfaces/Departamento';
import { Edificio } from 'src/app/interfaces/edificio';
import { InfraestructuraService } from 'src/app/services/infraestructura.service';

@Component({
  selector: 'app-edificio',
  templateUrl: './edificio.page.html',
  styleUrls: ['./edificio.page.scss'],
})
export class EdificioPage implements OnInit {
  edificioForm = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    departamento: new FormControl('', [Validators.required])
  });
  departamentos: Departamento[] = [];

  constructor(
    private params: NavParams,
    private infraestructuraService: InfraestructuraService
  ) {
    if (params.get('data')) {
      let a: Edificio = params.get('data');
      this.edificioForm.setValue({
        id: a.id,
        nombre: a.nombre,
        departamento: a.departamento
      });
    }
  }

  ngOnInit() {
    this.infraestructuraService.getAllDepartamentos().subscribe(departamentos => {
      this.departamentos = departamentos;
    });
  }

  onSave() {
    if (this.edificioForm.valid) {
      let edificio: Edificio = {
        id: this.edificioForm.controls['id'].value!,
        nombre: this.edificioForm.controls['nombre'].value!,
        departamento: this.edificioForm.controls['departamento'].value!
      }

      if(edificio.id!=''){
        this.infraestructuraService.updateEdificio(edificio).then(() => {
          this.params.get('modal').dismiss();
        });
      }else{
        this.infraestructuraService.addEdificio(edificio).then(() => {
          this.params.get('modal').dismiss();
        });
      }      
    }
  }

  onCancel() {
    this.params.get('modal').dismiss();
  }
}
