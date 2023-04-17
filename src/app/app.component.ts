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
  constructor(private router:Router, private menuCtrl:MenuController, private authService:AuthService) {
  }

  goUsers(){
    this.menuCtrl.close()
    this.router.navigateByUrl('/users')
  }

  goInventory(){
    this.menuCtrl.close()
    this.router.navigateByUrl('/inventory')
  }

  goKnowledge(){
    this.menuCtrl.close()
    this.router.navigateByUrl('/knowledge')
  }

  logout(){
    this.menuCtrl.close()
    this.authService.deleteAuth();
    this.router.navigateByUrl('/login')
  }
}
