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
  filteredUsers: User[] = [];
  txtSearch = "";
  department = "Todos"
  type = -1
  loggedUserType=4

  constructor(private userService: UserService, private authService: AuthService, private router: Router, public modalCtrl: ModalController) { }

  ngOnInit() {
    if (!this.authService.getActualUser())
      this.router.navigateByUrl("login");
    this.loggedUserType=this.authService.getActualUser()['type'];
    this.userService.getAll().subscribe(u => {
      this.users = u;
    })
  }

  async edit(u: User) {
    const modal = await this.modalCtrl.create({
      component: NewPage,
      componentProps: { modal: this.modalCtrl, user: u },
      // cssClass: 'setting-modal',
      // backdropDismiss: false,
    });

    modal.present();

    const modalData = await modal.onWillDismiss();
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: NewPage,
      componentProps: { modal: this.modalCtrl }
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

  changeDepartment(e: any) {
    this.department = e.detail.value;
    this.filterUsers()
  }

  changeType(e: any) {
    this.type = e.detail.value;
    this.filterUsers()
  }

  changeSearch(e: any) {
    this.txtSearch = e.detail.value;
    this.filterUsers()
  }

  compareWith(a: any, b: any) {
    return a == b
  }

  filterUsers() {
    this.filteredUsers = [];
    let inFilter = false;
    if (this.department != "Todos") {
      this.filteredUsers = this.users.filter(u => u.department == this.department);
      inFilter = true
    }
    if (this.type >= 0) {
      let filter: User[] = [];
      if (!inFilter) {
        filter = this.users;
        inFilter = true;
      }
      else
        filter = this.filteredUsers;

      this.filteredUsers = filter.filter(u => u.type == this.type);
    }
    if (this.txtSearch.replace(" ", "").length > 0) {
      let filter: User[] = [];
      if (!inFilter)
        filter = this.users;
      else
        filter = this.filteredUsers;
      let txt = this.txtSearch;
      this.filteredUsers = filter.filter(u => u.name.toLowerCase().includes(txt.toLowerCase()) || u.lastname.toLowerCase().includes(txt.toLowerCase()) || u.phone.toLowerCase().includes(txt.toLowerCase()) || u.email.toLowerCase().includes(txt.toLowerCase()));
    }
  }

}
