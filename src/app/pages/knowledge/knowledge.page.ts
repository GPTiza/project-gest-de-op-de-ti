import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Service } from 'src/app/interfaces/service';
import { AuthService } from 'src/app/services/auth.service';
import { ServicesService } from 'src/app/services/services.service';
import { UserService } from 'src/app/services/user.service';
import { KnowledgeDetailPage } from './knowledge-detail/knowledge-detail.page';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.page.html',
  styleUrls: ['./knowledge.page.scss'],
})
export class KnowledgePage implements OnInit {
  services:Service[]=[];
  loggedUserType=4
  constructor(private serviceService: ServicesService,private alertService:AlertService,private authService:AuthService,private router:Router, public modalCtrl: ModalController) { }

  ngOnInit() {
    if (!this.authService.getActualUser())
      this.router.navigateByUrl("login");
    this.loggedUserType=this.authService.getActualUser()['type'];
    this.serviceService.getAllProblem().subscribe(c => {
      this.services = c
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
      this.serviceService.delProblem(id).then(r => {
        this.alertService.successful("Se ha eliminado el servicio");
      })
    }
  }

}
