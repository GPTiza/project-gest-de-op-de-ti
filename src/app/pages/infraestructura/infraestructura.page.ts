import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Aula } from 'src/app/interfaces/aula';
import { Departamento } from 'src/app/interfaces/Departamento';
import { Edificio } from 'src/app/interfaces/edificio';
import { InfraestructuraService } from 'src/app/services/infraestructura.service';
import { AulaPage } from './aula/aula.page';
import { EdificioPage } from './edificio/edificio.page';
import { DepartamentoPage } from './departamento/departamento.page';

@Component({
  selector: 'app-infraestructura',
  templateUrl: './infraestructura.page.html',
  styleUrls: ['./infraestructura.page.scss'],
})
export class InfraestructuraPage implements OnInit {
  isDelete = false;
  txtSearch = '';
  selectedEdificio = 'Todos';
  selectedDepartamento = 'Todos';

  aulas: Aula[] = []; // Lista completa de aulas
  edificios: Edificio[] = []; // Lista completa de edificios
  departamentos: Departamento[] = []; // Lista completa de departamentos
  filteredAulas: Aula[] = []; // Lista filtrada de aulas
  groupedAulas: { [departamento: string]: { [edificio: string]: Aula[] } } = {};


  constructor(private infraestructuraService: InfraestructuraService, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.loadInfraestructura();
    // this.setInfraestructura();
  }

  setInfraestructura() {
    this.aulas = [
      { id: '1', nombre: 'A1', departamento: 'Sistemas', edificio: 'EA' },
      { id: '2', nombre: 'A2', departamento: 'Sistemas', edificio: 'EA' },
      { id: '3', nombre: 'SA', departamento: 'Sistemas', edificio: 'EA' },
      { id: '4', nombre: 'A1', departamento: 'Sistemas', edificio: 'EB' },
      { id: '5', nombre: 'SB', departamento: 'Sistemas', edificio: 'EB' },
      { id: '6', nombre: 'A1', departamento: 'Sistemas', edificio: 'EC' },
      { id: '7', nombre: 'A2', departamento: 'Sistemas', edificio: 'EC' },
      { id: '8', nombre: 'A1', departamento: 'Bioquimica', edificio: 'ED' },
    ];

    this.edificios = [
      { id: 'EA', nombre: 'Edificio A', departamento: 'Sistemas' },
      { id: 'EB', nombre: 'Edificio B', departamento: 'Sistemas' },
      { id: 'EC', nombre: 'Edificio C', departamento: 'Sistemas' },
      { id: 'ED', nombre: 'Edificio D', departamento: 'Sistemas' },
    ];

    this.departamentos = [
      { id: 'Sistemas', nombre: 'Sistemas' },
      { id: 'Bioquimica', nombre: 'Bioquímica' },
    ];

    this.groupAulas();
  }

  private groupAulas() {
    this.groupedAulas = {};

    this.aulas.forEach(aula => {
      const departamento = aula.departamento;
      const edificio = aula.edificio;

      if (!this.groupedAulas[departamento]) {
        this.groupedAulas[departamento] = {};
      }

      if (!this.groupedAulas[departamento][edificio]) {
        this.groupedAulas[departamento][edificio] = [];
      }

      this.groupedAulas[departamento][edificio].push(aula);
    });
  }

  private loadInfraestructura() {
    // Cargar aulas
    this.infraestructuraService.getAllAulas().subscribe(aulas => {
      this.aulas = aulas;
      this.filteredAulas = this.aulas;
      this.infraestructuraService.getAllEdificios().subscribe(edificios => {
        this.edificios = edificios;
        this.infraestructuraService.getAllDepartamentos().subscribe(departamentos => {
          this.departamentos = departamentos;
          this.groupAulas();
        });
      });
    });
  }

  filterAulas() {
    this.filteredAulas = this.aulas.filter(aula => {
      return (
        (this.selectedEdificio === 'Todos' || aula.edificio === this.selectedEdificio) &&
        (this.selectedDepartamento === 'Todos' || aula.departamento === this.selectedDepartamento) &&
        aula.nombre.toLowerCase().includes(this.txtSearch.toLowerCase())
      );
    });
  }

  filterByEdificio() {
    this.filterAulas();
  }

  filterByDepartamento() {
    this.filterAulas();
  }

  getEdificioName(id: string): string {
    const edificio = this.edificios.find(e => e.id === id);
    return edificio ? edificio.nombre : 'N/A';
  }

  getDepartamentoName(id: string): string {
    const departamento = this.departamentos.find(d => d.id === id);
    return departamento ? departamento.nombre : 'N/A';
  }

  async addAula() {
    if (!this.isDelete) {
      const modal = await this.modalCtrl.create({
        component: AulaPage,
        componentProps: { modal: this.modalCtrl },
        // cssClass: 'inventoryModal',
      });
      modal.present();
      const modalData = await modal.onWillDismiss();
    }
    this.isDelete = false;
  }

  async addEdificio() {
    if (!this.isDelete) {
      const modal = await this.modalCtrl.create({
        component: EdificioPage,
        componentProps: { modal: this.modalCtrl },
        // cssClass: 'inventoryModal',
      });
      modal.present();
      const modalData = await modal.onWillDismiss();
    }
    this.isDelete = false;
  }

  async addDepartamento() {
    if (!this.isDelete) {
      const modal = await this.modalCtrl.create({
        component: DepartamentoPage,
        componentProps: { modal: this.modalCtrl },
        // cssClass: 'inventoryModal',
      });
      modal.present();
      const modalData = await modal.onWillDismiss();
    }
    this.isDelete = false;
  }

  async editAula(aula: Aula) {
    if (!this.isDelete) {
      const modal = await this.modalCtrl.create({
        component: AulaPage,
        componentProps: { modal: this.modalCtrl, data: aula }
      });
      modal.present();
      const modalData = await modal.onWillDismiss();
    }
    this.isDelete = false;
  }

  async editEdificio(edificioString: String) {
    this.isDelete = true;
    if (this.isDelete) {
      let edificio = this.edificios[0];
      this.edificios.forEach(e => {
        if (e.nombre == edificioString && e != null) {
          edificio = e;
        }
      })
      const modal = await this.modalCtrl.create({
        component: EdificioPage,
        componentProps: { modal: this.modalCtrl, data: edificio }
      });
      modal.present();
      const modalData = await modal.onWillDismiss();
    }
    this.isDelete = false;
  }

  async editDepartamento(departamentoString: String) {
    this.isDelete = true;
    if (this.isDelete) {
      let departamento = this.departamentos[0];
      this.departamentos.forEach(e => {
        if (e.nombre == departamentoString && e != null) {
          departamento = e;
        }
      })
      const modal = await this.modalCtrl.create({
        component: DepartamentoPage,
        componentProps: { modal: this.modalCtrl, data: departamento }
      });
      modal.present();
      const modalData = await modal.onWillDismiss();
    }
    this.isDelete = false;
  }

  deleteAula(aula: Aula) {
    this.isDelete = true;
    if (confirm('¿Deseas eliminar el aula ' + aula.nombre + ' del edificio ' + aula.edificio + ' del departamento ' + aula.departamento + '?')) {
      this.infraestructuraService.deleteAula(aula.id).then(() => {
        this.loadInfraestructura(); // Recargar datos tras eliminar
      }).catch(error => {
        console.error('Error al eliminar aula:', error);
      });
    }
  }

  deleteEdificio(edificioString: String) {
    this.isDelete = true;
    let edificio = this.edificios[0];
    this.edificios.forEach(e => {
      if (e.nombre == edificioString && e != null) {
        edificio = e;
      }
    })
    if (confirm('¿Deseas eliminar el edificio ' + edificio.nombre + ' del departamento ' + edificio.departamento + '?')) {
      this.infraestructuraService.deleteEdificio(edificio.id).then(() => {
        this.loadInfraestructura(); // Recargar datos tras eliminar
      }).catch(error => {
        console.error('Error al eliminar edificio:', error);
      });
    }
  }

  deleteDepartamento(departamentoString: String) {
    this.isDelete = true;
    let departamento = this.departamentos[0];
    this.departamentos.forEach(e => {
      if (e.nombre == departamentoString && e != null) {
        departamento = e;
      }
    })
    console.log(this.departamentos)
    if (confirm('¿Deseas eliminar el departamento ' + departamento.nombre + '?')) {
      this.infraestructuraService.deleteDepartamento(departamento.id).then(() => {
        this.loadInfraestructura(); // Recargar datos tras eliminar
      }).catch(error => {
        console.error('Error al eliminar departamento:', error);
      });
    }
  }
}