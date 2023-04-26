import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Computer } from 'src/app/interfaces/computer';
import { AuthService } from 'src/app/services/auth.service';
import { ComputerService } from 'src/app/services/computer.service';
import { UserService } from 'src/app/services/user.service';
import { InventoryDetailPage } from './inventory-detail/inventory-detail.page';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  computers: Computer[] = [];
  filteredComputers: Computer[] = [];
  txtSearch = "";
  department = "Todos"
  responsable = "Todos"
  responsables: User[] = []
  type = "Todos"
  loggedUserType=4
  types = new Map<string, string>([
    ["pc", "Computadora de Escritorio"],
    ["laptop", "Laptop"],
    ["aio", "All in one"],
    ["printer", "Impresora"],
    ["projector", "Proyector"]
  ]);

  constructor(private computerService: ComputerService, private alertservice:AlertService, private authService: AuthService, private router: Router, public modalCtrl: ModalController) { }

  ngOnInit() {
    if (!this.authService.getActualUser())
      this.router.navigateByUrl("login");
      this.loggedUserType=this.authService.getActualUser()['type'];
    this.computerService.getAll().subscribe(c => {
      this.computers = c
      c.forEach((comp => {
        if (this.responsables.filter(r => r.id == comp.responsable.id).length == 0) {
          this.responsables.push(comp.responsable);
        }
      }))
    })
  }

  async edit(c: Computer) {
    const modal = await this.modalCtrl.create({
      component: InventoryDetailPage,
      componentProps: { modal: this.modalCtrl, computer: c, canEdit: true },
      cssClass: 'inventoryModal',

      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  async view(c: Computer) {
    const modal = await this.modalCtrl.create({
      component: InventoryDetailPage,
      componentProps: { modal: this.modalCtrl, computer: c, canEdit: false},
      cssClass: 'inventoryModal',

      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: InventoryDetailPage,
      cssClass: 'inventoryModal',
      componentProps: { modal: this.modalCtrl }
      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  del(id: string) {
    if (confirm("¿Está seguro que desea eliminar este dispositivo?")) {
      this.computerService.del(id).then(r => {
        this.alertservice.successful("Se ha eliminado el dispositivo");
      })
    }
  }


  changeDepartment(e: any) {
    this.department = e.detail.value;
    this.filterComputers()
  }

  changeResponsable(e: any) {
    this.responsable = e.detail.value;
    this.filterComputers()
  }

  changeType(e: any) {
    this.type = e.detail.value;
    this.filterComputers()
  }

  changeSearch(e: any) {
    this.txtSearch = e.detail.value;
    this.filterComputers()
  }

  compareWith(a: any, b: any) {
    return a == b
  }

  filterComputers() {
    this.filteredComputers = [];
    let inFilter = false;
    if (this.department != "Todos") {
      this.filteredComputers = this.computers.filter(u => u.department == this.department);
      inFilter = true
    }
    if (this.responsable != "Todos") {
      let filter: Computer[] = [];
      if (!inFilter) {
        filter = this.computers;
        inFilter = true;
      }
      else
        filter = this.filteredComputers;
      this.filteredComputers = filter.filter(u => u.responsable.id == this.responsable);
    }
    if (this.type != "Todos") {
      let filter: Computer[] = [];
      if (!inFilter) {
        filter = this.computers;
        inFilter = true;
      }
      else
        filter = this.filteredComputers;

      this.filteredComputers = filter.filter(u => u.tipoEquipo == this.type);
    }
    if (this.txtSearch.replace(" ", "").length > 0) {
      let filter: Computer[] = [];
      if (!inFilter)
        filter = this.computers;
      else
        filter = this.filteredComputers;
      let txt = this.txtSearch;
      this.filteredComputers = filter.filter(u => u.name.toLowerCase().includes(txt.toLowerCase()) || u.brand.toLowerCase().includes(txt.toLowerCase()) || u.id.toLowerCase().includes(txt.toLowerCase()));
    }
  }

}
