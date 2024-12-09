import { Component, OnInit } from '@angular/core';
import { KnowledgeDetailPage } from '../knowledge/knowledge-detail/knowledge-detail.page';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Service } from 'src/app/interfaces/service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  services:Service[]=[];
  loggedUserType=4
  constructor(private serviceService: ServicesService,private alertService:AlertService,private authService:AuthService,private router:Router, public modalCtrl: ModalController) { }

  ngOnInit() {
    if (!this.authService.getActualUser())
      this.router.navigateByUrl("login");
    this.loggedUserType=this.authService.getActualUser()['type'];
    this.serviceService.getAllService().subscribe(c => {
      this.services = c
    })
  }

  async edit(c: Service) {
    const modal = await this.modalCtrl.create({
      component: KnowledgeDetailPage,
      componentProps: {modal:this.modalCtrl, service: c,problems:true },
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
      componentProps:{modal:this.modalCtrl,problems:true}
      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  delete(id: string) {
    if (confirm("¿Está seguro que desea eliminar este servicio?")) {
      this.serviceService.delService(id).then(r => {
        this.alertService.successful("Se ha eliminado el servicio");
      })
    }
  }

}
