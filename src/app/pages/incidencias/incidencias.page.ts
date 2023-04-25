import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Incidencia } from 'src/app/interfaces/incidencia';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { IncidenciasService } from 'src/app/services/incidencias.service';
import { IncidenciaDetailPage } from './incidencia-detail/incidencia-detail.page';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.page.html',
  styleUrls: ['./incidencias.page.scss'],
})
export class IncidenciasPage implements OnInit {

  incidencias: Incidencia[] = [];
  filteredIncidencias: Incidencia[] = [];
  txtSearch = "";
  statusSelected = "Todos"
  responsable = "Todos"
  tecnico = "Todos"
  tecnicos: User[] = []
  responsables: User[] = []
  prioridad = "Todos"
  loggedUserType = 4
  initialDate= new Date().toISOString().substring(0,10)
  finishDate= new Date().toISOString().substring(0,10)
  today=new Date().toISOString().substring(0,10)

  types = new Map<string, string>([
    ["pc", "Computadora de Escritorio"],
    ["laptop", "Laptop"],
    ["aio", "All in one"],
    ["printer", "Impresora"],
    ["projector", "Proyector"]
  ]);


  prioridades = new Map<string, string>([
    ["-1", "Sin Asignar"],
    ["0", "Muy Baja"],
    ["1", "Baja"],
    ["2", "Media"],
    ["3", "Alta"],
    ["4", "Muy alta"]
  ]);


  status = new Map<number, string>([
    [0, "Creada"],
    [1, "Prioridad Asignada"],
    [2, "Técnico Asignado"],
    [3, "Incidencia Terminada"],
    [4, "Incidencia Liberada"],
    [5, "Con Solicitud de Cambio"],
    [6, "Solicitud de Cambio Aceptada"],
    [7, "Solicitud de Cambio Rechazada"],
    [8, "Incidencia Rechazada"],
  ]);

  constructor(private incidenciaservice: IncidenciasService, private userService: UserService, private authService: AuthService, private router: Router, public modalCtrl: ModalController) { }

  ngOnInit() {
    if (!this.authService.getActualUser())
      this.router.navigateByUrl("login");
    this.loggedUserType = this.authService.getActualUser()['type'];
    let d=new Date()
    d.setDate(d.getDate()-1)
    this.initialDate=d.toISOString().substring(0,10)
    this.incidenciaservice.getAll().subscribe(c => {
      this.incidencias = c;
      this.incidencias.sort((a, b) => { return parseFloat(a.status.toString()) - parseFloat(b.status.toString()) })
      c.forEach((comp => {
        if (this.responsables.filter(r => r.id == comp.user.id).length == 0)
          this.responsables.push(comp.user);
        if (comp.tecnico)
          if (this.tecnicos.filter(r => r.id == comp.tecnico!.id).length == 0)
            this.tecnicos.push(comp.tecnico!);
      }))
      this.filterincidencias()
    })
  }

  async edit(c: Incidencia) {
    const modal = await this.modalCtrl.create({
      component: IncidenciaDetailPage,
      componentProps: { modal: this.modalCtrl, incidencia: c, canEdit: true },
      cssClass: 'inventoryModal',

      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  async view(c: Incidencia) {
    const modal = await this.modalCtrl.create({
      component: IncidenciaDetailPage,
      componentProps: { modal: this.modalCtrl, incidencia: c, canEdit: false },
      cssClass: 'inventoryModal',

      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: IncidenciaDetailPage,
      cssClass: 'inventoryModal',
      componentProps: { modal: this.modalCtrl }
      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  del(id: string) {
    if (confirm("¿Está seguro que desea eliminar este dispositivo?")) {
      this.incidenciaservice.del(id).then(r => {
        alert("Se ha eliminado el dispositivo");
      })
    }
  }


  changeStatus(e: any) {
    this.statusSelected = e.detail.value;
    this.filterincidencias()
  }

  changeResponsable(e: any) {
    this.responsable = e.detail.value;
    this.filterincidencias()
  }

  changeTecnico(e: any) {
    this.tecnico = e.detail.value;
    this.filterincidencias()
  }

  changePrioridad(e: any) {
    this.prioridad = e.detail.value;
    this.filterincidencias()
  }

  changeSearch(e: any) {
    this.txtSearch = e.detail.value;
    this.filterincidencias()
  }

  changeInitialDate(e:any){
    this.initialDate = e.detail.value;
    this.filterincidencias()
  }

  changeFinishDate(e:any){
    this.finishDate = e.detail.value;
    this.filterincidencias()
  }

  compareWith(a: any, b: any) {
    return a == b
  }

  filterincidencias() {
    this.filteredIncidencias = [];
    let inFilter = false;
    if (this.statusSelected != "Todos") {
      this.filteredIncidencias = this.incidencias.filter(u => u.status.toString() == this.statusSelected);
      inFilter = true
    }
    if (this.responsable != "Todos") {
      let filter: Incidencia[] = [];
      if (!inFilter) {
        filter = this.incidencias;
        inFilter = true;
      }
      else
        filter = this.filteredIncidencias;
      this.filteredIncidencias = filter.filter(u => u.user.id == this.responsable);
    }
    if (this.tecnico != "Todos") {
      let filter: Incidencia[] = [];
      if (!inFilter) {
        filter = this.incidencias;
        inFilter = true;
      }
      else
        filter = this.filteredIncidencias;
      this.filteredIncidencias = filter.filter(u => u.tecnico!.id == this.tecnico);
    }
    if (this.prioridad != "Todos") {
      let filter: Incidencia[] = [];
      if (!inFilter) {
        filter = this.incidencias;
        inFilter = true;
      }
      else
        filter = this.filteredIncidencias;

      this.filteredIncidencias = filter.filter(u => u.priority.toString() == this.prioridad);
    }
    if (this.txtSearch.replace(" ", "").length > 0) {
      let filter: Incidencia[] = [];
      if (!inFilter)
        filter = this.incidencias;
      else
        filter = this.filteredIncidencias;
      let txt = this.txtSearch;
      this.filteredIncidencias = filter.filter(u => u.description.toLowerCase().includes(txt.toLowerCase()));
    }

    
    let filter: Incidencia[] = [];
    let filter2: Incidencia[] = [];
      if (!inFilter)
        filter = this.incidencias;
      else
        filter = this.filteredIncidencias;
      
      filter.forEach(i=>{
        let d=new Date(0)
        d.setUTCSeconds(i.creationDate['seconds']);
        let finishDate=new Date(this.finishDate);
        finishDate.setDate(finishDate.getDate()+1)
        if(d>new Date(this.initialDate) && d<finishDate){
          filter2.push(i);
        }
      })
      this.filteredIncidencias = filter2;
  }

}
