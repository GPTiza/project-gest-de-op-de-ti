import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { Incidencia } from 'src/app/interfaces/incidencia';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ComputerService } from 'src/app/services/computer.service';
import { IncidenciasService } from 'src/app/services/incidencias.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-incidencia-detail',
  templateUrl: './incidencia-detail.page.html',
  styleUrls: ['./incidencia-detail.page.scss'],
})
export class IncidenciaDetailPage implements OnInit {
  id = ""
  loggedUserType = 4
  status = 0;
  tecnicos: User[] = [];

  incidenciaForm = new FormGroup({
    aula: new FormControl('', [Validators.required]),
    edificio: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(50)]),
    type: new FormControl('', [Validators.required]),
    priority: new FormControl(-1),
    tecnico: new FormControl(this.userService.getExampleUser().name + " " + this.userService.getExampleUser().lastname),
    solicitudCambio: new FormControl(''),
  });

  constructor(private params: NavParams, private incidenciaService: IncidenciasService, private userService: UserService, private computerService: ComputerService, private authService: AuthService, private router: Router) {

    if (!this.authService.getActualUser())
      this.router.navigateByUrl("login");
    this.loggedUserType = this.authService.getActualUser()['type'];
    this.userService.getTecnicos().subscribe(ts => {
      this.tecnicos = ts;
    })

    if (params.get('incidencia')) {
      let i: Incidencia = params.get('incidencia');
      this.id = i.id;
      this.status = i.status;
      if (!params.get('canEdit')) {
        this.incidenciaForm.controls['aula'].disable()
        this.incidenciaForm.controls['edificio'].disable()
        this.incidenciaForm.controls['description'].disable()
        this.incidenciaForm.controls['type'].disable()
        if (this.status > 0)
          this.incidenciaForm.controls['priority'].disable()
        if (this.status > 1)
          this.incidenciaForm.controls['tecnico'].disable()
        if (this.status > 4 || this.loggedUserType != 2)
          this.incidenciaForm.controls['solicitudCambio'].disable()
      }
      this.incidenciaForm.setValue({
        aula: i.aula,
        edificio: i.edificio,
        description: i.description,
        type: i.type,
        priority: i.priority,
        tecnico: i.tecnico?.id + '',
        solicitudCambio: i.solicitudCambio == null ? '' : i.solicitudCambio
      });
    }
  }

  ngOnInit() {
  }

  save() {
    let aula = this.incidenciaForm.controls['aula'].value!;
    let edificio = this.incidenciaForm.controls['edificio'].value!;
    let type = this.incidenciaForm.controls['type'].value!;
    this.computerService.getByAulayEdificioyTipo(aula, edificio, type).subscribe(c => {
      if (c.length > 0) {
        let i: Incidencia = {
          id: this.id,
          aula: aula,
          edificio: edificio,
          type: type,
          equipo: c[0],
          department: this.authService.getActualUser().department,
          description: this.incidenciaForm.controls['description'].value!,
          priority: -1,
          creationDate: undefined,
          asignationDate: undefined,
          finishedDate: undefined,
          status: 0,
          tecnico: null,
          user: this.authService.getActualUser(),
          solicitudCambio: ''
        };
        this.incidenciaService.addSecreOJefeDpto(i).then(r => {
          alert('Se ha agregado la incidencia');
        });
        this.params.get('modal').dismiss();
      } else {
        alert("No existe un equipo de tipo " + type + " en el aula " + aula + " en el edificio " + edificio);
      }
    })
  }

  savePriority() {
    this.incidenciaService.asignarPrioridad(this.id, this.incidenciaForm.controls['priority'].value!).then(r => {
      alert("Se ha asignado la prioridad");
      this.params.get('modal').dismiss();
    }).catch(e => {
      alert("Ha ocurrido un error");
    })
  }


  cancel() {
    this.incidenciaService.rechazarIncidencias(this.id).then(r => {
      alert("Se ha cancelado la incidencia");
      this.params.get('modal').dismiss();
    }).catch(e => {
      alert("Ha ocurrido un error");
    })
  }

  saveTecnico() {
    let tec: User = this.tecnicos[0]
    this.tecnicos.forEach(t => {
      if (t.id == this.incidenciaForm.controls['tecnico'].value!)
        tec = t;
    })
    this.incidenciaService.asignarTecnico(this.id, tec!).then(r => {
      alert("Se ha asignado al tecnico");
      this.params.get('modal').dismiss();
    }).catch(e => {
      alert("Ha ocurrido un error");
    })
  }

  finish() {
    this.incidenciaService.TerminarIncidencia(this.id).then(r => {
      alert("Se ha terminado la incidencia");
      this.params.get('modal').dismiss();
    }).catch(e => {
      alert("Ha ocurrido un error");
    })
  }

  solicitudCambio() {
    this.incidenciaService.SolicitudCambio(this.id, this.incidenciaForm.controls['solicitudCambio'].value!).then(r => {
      alert("Se ha creado la solicitud de cambio");
      this.params.get('modal').dismiss();
    }).catch(e => {
      alert("Ha ocurrido un error");
    })
  }

  aceptarCambios() {
    this.incidenciaService.aceptarSolicitudCambio(this.id).then(r => {
      alert("Se ha aceptado la solicitud del cambio");
      this.params.get('modal').dismiss();
    }).catch(e => {
      alert("Ha ocurrido un error");
    })
  }

  rechazarCambios() {
    this.incidenciaService.rechazarSolicitudCambio(this.id).then(r => {
      alert("Se ha rechazado la solicitud del cambio");
      this.params.get('modal').dismiss();
    }).catch(e => {
      alert("Ha ocurrido un error");
    })
  }

}
