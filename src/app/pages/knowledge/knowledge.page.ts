import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Service } from 'src/app/interfaces/service';
import { AuthService } from 'src/app/services/auth.service';
import { ServicesService } from 'src/app/services/services.service';
import { UserService } from 'src/app/services/user.service';
import { KnowledgeDetailPage } from './knowledge-detail/knowledge-detail.page';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.page.html',
  styleUrls: ['./knowledge.page.scss'],
})
export class KnowledgePage implements OnInit {

  services:Service[]=[];

  constructor(private serviceService: ServicesService, private userService: UserService,private authService:AuthService,private router:Router, public modalCtrl: ModalController) { }

  ngOnInit() {
    if(!this.authService.getActualUser())
        this.router.navigateByUrl("login");
    this.serviceService.getAll().subscribe(c => {
      this.services = c
      console.log(c)
    })
  }

  async edit(c: Service) {
    const modal = await this.modalCtrl.create({
      component: KnowledgeDetailPage,
      componentProps: {modal:this.modalCtrl, service: c },
      cssClass: 'knowledgeModal',

      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: KnowledgeDetailPage,
      cssClass: 'knowledgeModal',
      componentProps:{modal:this.modalCtrl}
      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  delete(id: string) {
    if (confirm("¿Está seguro que desea eliminar este servicio?")) {
      this.serviceService.del(id).then(r => {
        alert("Se ha eliminado el servicio");
      })
    }
  }

}