import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NewPage } from './new/new.page';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService,private authService:AuthService,private router:Router, public modalCtrl: ModalController) { }

  ngOnInit() {
    if(!this.authService.getActualUser())
        this.router.navigateByUrl("login");
    this.userService.getAll().subscribe(u => {
      this.users = u;
    })
  }

  async edit(u: User) {
    const modal = await this.modalCtrl.create({
      component: NewPage,
      componentProps: {modal:this.modalCtrl, user: u },
      // cssClass: 'setting-modal',
      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: NewPage,
      componentProps:{modal:this.modalCtrl}
      // cssClass: 'setting-modal',
      // backdropDismiss: false,
    });
    modal.present();
    const modalData = await modal.onWillDismiss();
  }

  public delete(id: string) {

    if (confirm("¿Está seguro que desea eliminar este usuario?")) {
      this.userService.del(id).then(r => {
        alert("Se ha eliminado el usuario");
      })
    }
  }

}
