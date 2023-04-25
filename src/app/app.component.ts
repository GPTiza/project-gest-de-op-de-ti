import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  loggedUserType = 4
  name = ""
  types=["Administrador","Jefe de Taller","Técnico","Jefe de dpto","Secretaria"];
  constructor(private router: Router, private menuCtrl: MenuController, private authService: AuthService) {
    let u=this.authService.getActualUser()
    if (u) {
      this.loggedUserType = u['type'];
      this.name = u['name'] + ' ' + u['lastname'];
    }
  }

  goUsers() {
    this.menuCtrl.close()
    this.router.navigateByUrl('/users')
  }

  goInventory() {
    this.menuCtrl.close()
    this.router.navigateByUrl('/inventory')
  }

  goKnowledge() {
    this.menuCtrl.close()
    this.router.navigateByUrl('/knowledge')
  }

  goIncidencias() {
    this.menuCtrl.close()
    this.router.navigateByUrl('/incidencias')
  }

  logout() {
    this.menuCtrl.close()
    this.authService.deleteAuth();
    this.router.navigateByUrl('/login')
  }
}
