import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { Aula } from 'src/app/interfaces/aula';
import { Departamento } from 'src/app/interfaces/Departamento';
import { Edificio } from 'src/app/interfaces/edificio';
import { InfraestructuraService } from 'src/app/services/infraestructura.service';

@Component({
  selector: 'app-aula',
  templateUrl: './aula.page.html',
  styleUrls: ['./aula.page.scss'],
})
export class AulaPage implements OnInit {
  aulaForm = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    edificio: new FormControl('', [Validators.required]),
    departamento: new FormControl('')
  });
  edificios: Edificio[] = [];
  departamentos: Departamento[] = [];

  constructor(
    private params: NavParams,
    private infraestructuraService: InfraestructuraService
  ) {
    if (params.get('data')) {
      let a: Aula = params.get('data');
      this.aulaForm.setValue({
        id: a.id,
        nombre: a.nombre,
        edificio: a.edificio,
        departamento: a.departamento
      });
    }
  }

  ngOnInit() {
    this.infraestructuraService.getAllEdificios().subscribe(edificios => {
      this.edificios = edificios;
    });

    this.infraestructuraService.getAllDepartamentos().subscribe(departamentos => {
      this.departamentos = departamentos;
    });
  }

  onSave() {
    if (this.aulaForm.valid) {
      let departamento='';
      this.edificios.forEach(e=>{
        if(e.nombre == this.aulaForm.controls['edificio'].value!){
          departamento=e.departamento
        }
      })
      let aula: Aula = {
        id: this.aulaForm.controls['id'].value!,
        nombre: this.aulaForm.controls['nombre'].value!,
        edificio: this.aulaForm.controls['edificio'].value!,
        departamento: departamento
      }

      if(aula.id!=''){
        this.infraestructuraService.updateAula(aula).then(() => {
          this.params.get('modal').dismiss();
        });
      }else{
        this.infraestructuraService.addAula(aula).then(() => {
          this.params.get('modal').dismiss();
        });
      }  
    }
  }

  onCancel() {
    this.params.get('modal').dismiss();
  }
}