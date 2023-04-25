import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth, private router: Router) { }

  //Iniciar Sesión
  signInWithEmailAndPassword(email: string, pass: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, pass).then(r => {
      return r;
    });
  }

  // Registrar nuevo usuario
  register(email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email.toLowerCase(), password);
  }

  isLogged() {
    let user = this.getActualUser();
    if (user)
      if (user.name.lenght > 0)
        return true;
    return false;
  }

  saveUser(u: User) {
    localStorage.setItem('incitecUser', JSON.stringify(u))
  }

  deleteAuth() {
    localStorage.clear();
  }

  getActualUser() {
    let u = localStorage.getItem('incitecUser');
    if (!u) return null;
    let user = JSON.parse(u!);
    // if (!user['expiredTime']) return null;
    // if (user['expiredTime'] < Date.now()) return null;
    return user;
  }


  // Cerrar Sesión
  logout() {
    return this.angularFireAuth.signOut().then(auth => {
    });


  }

  resetPassword(email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(
      email
    );
  }


}
