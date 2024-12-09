import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { Computer } from 'src/app/interfaces/computer';
import { Incidencia } from 'src/app/interfaces/incidencia';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ComputerService } from 'src/app/services/computer.service';
import { IncidenciasService } from 'src/app/services/incidencias.service';
import { InfraestructuraService } from 'src/app/services/infraestructura.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-incidencia-detail',
  templateUrl: './incidencia-detail.page.html',
  styleUrls: ['./incidencia-detail.page.scss'],
})
export class IncidenciaDetailPage implements OnInit {
  
  totalTime: number = 0; // Variable para almacenar el tiempo total
  id = "";
  loggedUserType = 4;
  status = 0;
  tecnicos: User[] = [];
  edificios: string[] = [];
  aulas: string[][] = [];
  selectedAulas: string[] = [];
  computers: Computer[] = [];
  computer!: Computer;
  i!: Incidencia;
  added = false;

  // Nueva propiedad para manejar la checklist
  servicesR: { name: string; time: number; checked: boolean }[] = [];

  incidenciaForm = new FormGroup({
    aula: new FormControl('', [Validators.required]),
    edificio: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(50)]),
    type: new FormControl('', [Validators.required]),
    idEquipo: new FormControl('', [Validators.required, Validators.minLength(5)]),
    priority: new FormControl(-1),
    clasificacion: new FormControl(''),
    tecnico: new FormControl(''),
    diagnostico: new FormControl(''),
    tiempo: new FormControl(0),
    solicitudCambio: new FormControl(''),
  });

  constructor(
    private params: NavParams,
    private infraestructuraService: InfraestructuraService,
    private incidenciaService: IncidenciasService,
    private alertservice: AlertService,
    private userService: UserService,
    private computerService: ComputerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.added = false;

    if (!this.authService.getActualUser()) {
      this.router.navigateByUrl("login");
    }

    this.loggedUserType = this.authService.getActualUser()['type'];

    this.userService.getTecnicos().subscribe(ts => {
      this.tecnicos = ts;
    });

    
    // Cargar datos desde la colección servicesR
    this.incidenciaService.getServicesR().subscribe(data => {
      this.servicesR = data.map(item => ({
        name: `${item.problem} - ${item.time} minutos.`,
        time: item.time, // Añadir el tiempo de cada servicio
        checked: false,
      }));
    });
    

    if (params.get('incidencia')) {
      this.i = params.get('incidencia');
      this.id = this.i.id;
      this.status = this.i.status;
      this.incidenciaForm.controls['idEquipo'].disable();
      if (!params.get('canEdit')) {
        this.disableFormControls();
      }
      this.initializeFormValues();
    } else {
      this.loadDataForNewIncidencia();
    }
  }

  ngOnInit() {}

  loadServicesR() {
    // Carga los servicios desde el servicio IncidenciasService
    this.incidenciaService.getServicesR().subscribe(data => {
      this.servicesR = data.map(item => ({
        name: `${item.problem} - ${item.time} minutos.`,
        time: item.time,  // Guardamos el tiempo de cada servicio
        checked: false,  // Inicialmente, todos los servicios no están seleccionados
      }));
    });
  }

  updateTime() {
    console.log('Recalculando tiempo total...');
    // Filtra solo los servicios seleccionados y calcula el tiempo total
    this.totalTime = this.servicesR
      .filter(service => service.checked)  // Filtramos solo los seleccionados
      .reduce((acc, service) => acc + service.time, 0); // Sumar el tiempo de los seleccionados
  
    console.log('Tiempo total calculado: ', this.totalTime);
  
    // Actualiza el campo 'tiempo' en el formulario reactivo con el tiempo calculado
    this.incidenciaForm.controls['tiempo'].setValue(this.totalTime);
    console.log('Campo de tiempo actualizado con el valor: ', this.incidenciaForm.controls['tiempo'].value);
  }
  

  disableFormControls() {
    this.incidenciaForm.controls['aula'].disable();
    this.incidenciaForm.controls['edificio'].disable();
    this.incidenciaForm.controls['description'].disable();
    this.incidenciaForm.controls['type'].disable();
    if (this.status > 0) {
      this.incidenciaForm.controls['priority'].disable();
      this.incidenciaForm.controls['clasificacion'].disable();
      this.tecnicos = this.tecnicos.filter(t => t.clasificacion == this.i.clasificacion);
      this.tecnicos.sort((a, b) => a.incidencias - b.incidencias);
    }
    if (this.status > 1) {
      this.incidenciaForm.controls['tecnico'].disable();
    }
    if (this.status > 4 || this.loggedUserType != 2) {
      this.incidenciaForm.controls['diagnostico'].disable();
      this.incidenciaForm.controls['tiempo'].disable();
      this.incidenciaForm.controls['solicitudCambio'].disable();
    }
  }

  initializeFormValues() {
    this.incidenciaForm.setValue({
      aula: this.i.aula,
      edificio: this.i.edificio,
      description: this.i.description,
      clasificacion: this.i.clasificacion == null ? '' : this.i.clasificacion,
      idEquipo: this.i.equipo == null ? '' : this.i.equipo.id,
      type: this.i.type,
      priority: this.i.priority,
      tecnico: this.i.tecnico?.id + '',
      diagnostico: this.i.diagnostico == null ? '' : this.i.diagnostico,
      tiempo: this.i.tiempo == null ? 0 : this.i.tiempo,
      solicitudCambio: this.i.solicitudCambio == null ? '' : this.i.solicitudCambio,
    });
  }

  loadDataForNewIncidencia() {
    this.computerService.getByDepartamento(this.authService.getActualUser()['department']).subscribe(computers => {
      this.computers = computers;
      this.aulas = [];
      this.infraestructuraService.getAllEdificios().subscribe(es => {
        es.forEach(e => {
          if (e.departamento == this.authService.getActualUser()['department']) {
            this.edificios.push(e.nombre);
          }
        });
        this.infraestructuraService.getAllAulas().subscribe(as => {
          as.forEach(a => {
            if (a.departamento == this.authService.getActualUser()['department']) {
              if (!this.aulas[a.edificio.toString()]) {
                this.aulas[a.edificio.toString()] = [];
              }
              this.aulas[a.edificio.toString()].push(a.nombre);
            }
          });
        });
      });
    });
  }

  changeEdificio(e: any) {
    this.selectedAulas = this.aulas[e.detail.value];
    this.incidenciaForm.controls['aula'].setValue('');
  }

  changeAula(e: any) {
    if (this.incidenciaForm.controls['type'].value) {
      this.setIDComputer();
    }
  }

  changeType(e: any) {
    this.setIDComputer();
  }

  setIDComputer() {
    this.incidenciaForm.controls['idEquipo'].setValue('');
    const edificio = this.incidenciaForm.controls['edificio'].value!;
    const aula = this.incidenciaForm.controls['aula'].value!;
    const type = this.incidenciaForm.controls['type'].value!;
    this.computers.forEach(c => {
      if (c.edificio == edificio && c.aula == aula && c.tipoEquipo == type) {
        this.incidenciaForm.controls['idEquipo'].setValue(c.id);
        this.computer = c;
      }
    });
  }

  save() {
    let aula = this.incidenciaForm.controls['aula'].value!;
    let edificio = this.incidenciaForm.controls['edificio'].value!;
    let type = this.incidenciaForm.controls['type'].value!;
    if (this.computer) {
      let i: Incidencia = {
        id: this.id,
        aula: aula,
        edificio: edificio,
        clasificacion: this.incidenciaForm.controls['clasificacion'].value!,
        type: type,
        equipo: this.computer,
        department: this.authService.getActualUser().department,
        description: this.incidenciaForm.controls['description'].value!,
        priority: -1,
        creationDate: undefined,
        asignationDate: undefined,
        finishedDate: undefined,
        status: 0,
        tecnico: null,
        user: this.authService.getActualUser(),
        diagnostico: '',
        tiempo: 0,
        solicitudCambio: ''
      };
      if (!this.added) {
        this.incidenciaService.addSecreOJefeDpto(i).then(r => {
          this.alertservice.successful('Se ha agregado la incidencia');
        });
        this.added = true;
      }
      this.params.get('modal').dismiss();
    } else {
      this.alertservice.error("No existe un equipo de tipo " + type + " en el aula " + aula + " en el edificio " + edificio);
    }
  }

savePriority() {
  this.incidenciaService.asignarPrioridad(this.id, this.incidenciaForm.controls['priority'].value!, this.incidenciaForm.controls['clasificacion'].value!).then(r => {
    this.alertservice.successful("Se ha asignado la prioridad");
    this.params.get('modal').dismiss();
  }).catch(e => {
    this.alertservice.error("Ha ocurrido un error");
  });
}

cancel() {
  this.incidenciaService.rechazarIncidencias(this.id).then(r => {
    this.alertservice.successful("Se ha cancelado la incidencia");
    this.params.get('modal').dismiss();
  }).catch(e => {
    this.alertservice.error("Ha ocurrido un error");
  });
}

saveTecnico() {
  let tec: User = this.tecnicos[0];
  this.tecnicos.forEach(t => {
    if (t.id == this.incidenciaForm.controls['tecnico'].value!) {
      tec = t;
    }
  });
  this.incidenciaService.asignarTecnico(this.id, tec!).then(r => {
    this.alertservice.successful("Se ha asignado al técnico");
    this.params.get('modal').dismiss();
  }).catch(e => {
    this.alertservice.error("Ha ocurrido un error");
  });
}

finish() {
  this.incidenciaService.TerminarIncidencia(this.id, this.incidenciaForm.controls['diagnostico'].value!, this.incidenciaForm.controls['tiempo'].value!, this.i.tecnico?.id!).then(r => {
    this.alertservice.successful("Se ha terminado la incidencia");
    this.params.get('modal').dismiss();
  }).catch(e => {
    this.alertservice.error("Ha ocurrido un error");
  });
}

solicitudCambio() {
  this.incidenciaService.SolicitudCambio(this.id, this.incidenciaForm.controls['diagnostico'].value!, this.incidenciaForm.controls['tiempo'].value!, this.incidenciaForm.controls['solicitudCambio'].value!).then(r => {
    this.alertservice.successful("Se ha creado la solicitud de cambio");
    this.params.get('modal').dismiss();
  }).catch(e => {
    this.alertservice.error("Ha ocurrido un error");
  });
}

aceptarCambios() {
  this.incidenciaService.aceptarSolicitudCambio(this.id).then(r => {
    this.alertservice.successful("Se ha aceptado la solicitud del cambio");
    this.params.get('modal').dismiss();
  }).catch(e => {
    this.alertservice.error("Ha ocurrido un error");
  });
}

rechazarCambios() {
  this.incidenciaService.rechazarSolicitudCambio(this.id, this.i.tecnico?.id!).then(r => {
    this.alertservice.successful("Se ha rechazado la solicitud del cambio");
    this.params.get('modal').dismiss();
  }).catch(e => {
    this.alertservice.error("Ha ocurrido un error");
  });
}

liberar() {
  this.incidenciaService.LiberarIncidencia(this.id).then((r: any) => {
    this.alertservice.successful("Se ha liberado la incidencia");
    this.params.get('modal').dismiss();
  }).catch((e: any) => {
    this.alertservice.error("Ha ocurrido un error");
  });
}

copyId() {
  const val = this.incidenciaForm.controls['idEquipo'].value!;
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}
}
