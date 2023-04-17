import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Computer } from 'src/app/interfaces/computer';
import { AuthService } from 'src/app/services/auth.service';
import { ComputerService } from 'src/app/services/computer.service';
import { UserService } from 'src/app/services/user.service';
import { InventoryDetailPage } from './inventory-detail/inventory-detail.page';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  computers: Computer[] = [];

  constructor(private computerService: ComputerService, private userService: UserService,private authService:AuthService,private router:Router, public modalCtrl: ModalController) { }

  ngOnInit() {
    if(!this.authService.getActualUser())
        this.router.navigateByUrl("login");
    this.computerService.getAll().subscribe(c => {
      this.computers = c
    })
  }

  async edit(c: Computer) {
    const modal = await this.modalCtrl.create({
      component: InventoryDetailPage,
      componentProps: {modal:this.modalCtrl, computer: c },
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
      componentProps:{modal:this.modalCtrl}
      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  del(id: string) {
    if (confirm("¿Está seguro que desea eliminar este dispositivo?")) {
      this.computerService.del(id).then(r => {
        alert("Se ha eliminado el dispositivo");
      })
    }
  }

}
