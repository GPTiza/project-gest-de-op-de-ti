import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastController: ToastController,private router:Router) { }

  async successful(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      cssClass: 'successful-toast'
    });
    toast.present();
  }

  async warning(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      cssClass: 'warning-toast'
    });
    toast.present();
  }

  async error(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      cssClass: 'error-toast'
    });
    toast.present();
  }

  async confirm(message: string) {
    const toast = await this.toastController.create({
      message: message,
      cssClass: 'confirm-toast',
      buttons:[
        {
          text:'No',
          role:'cancel',
          handler: () => {
            return false;
          }
        },
        {
          text:'Si',
          handler: () => {
            return true;
          }
        }
      ]
    });
    toast.present();
  }
}
