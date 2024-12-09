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
  types=["Administrador","Jefe de Taller","Técnico","Jefe de dpto","Secretaria"];

  constructor(private router: Router, private menuCtrl: MenuController, public authService: AuthService) {
  }

  ngOnInit(){
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

  goServices() {
    this.menuCtrl.close()
    this.router.navigateByUrl('/services')
  }

  goInfrastucture() {
    this.menuCtrl.close()
    this.router.navigateByUrl('/infrastructure')
  }

  goIncidencias() {
    this.menuCtrl.close()
    this.router.navigateByUrl('/incidencias')
  }

  goReports() {
    this.menuCtrl.close()
    this.router.navigateByUrl('/resports')
  }

  logout() {
    this.menuCtrl.close()
    this.authService.deleteAuth();
    this.router.navigateByUrl('/login')
  }
}
