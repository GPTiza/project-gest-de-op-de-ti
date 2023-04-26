import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Time } from "@angular/common";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore, private authService: AuthService) { }

  public add(u: User) {
    let id = ""
    return this.authService.register(u.email, "Tec1234.").then(authUser => {
      id = authUser['user']!['uid'];
      return this.db.collection("users").doc(id).set({
        id:id,
        name: u.name,
        lastname: u.lastname,
        phone: u.phone,
        email: u.email,
        isMale: u.isMale,
        birthdate: u.birthdate,
        department: u.department,
        clasificacion:u.clasificacion,
        incidencias:u.incidencias,
        entryTime: u.entryTime,
        departureTime: u.departureTime,
        type: u.type,
        creationDate: new Date()
      })
    })
  }

  public put(u: User) {
    return this.db.collection("users").doc(u.id).update({
      name: u.name,
      lastname: u.lastname,
      phone: u.phone,
      isMale: u.isMale,
      birthdate: u.birthdate,
      department: u.department,
      clasificacion:u.clasificacion,
      entryTime: u.entryTime,
      departureTime: u.departureTime,
      type: u.type,
    }).then(r => {
      return r;
    })
  }

  public subIncidencias(id:string){
    this.get(id).subscribe(t=>{
      return this.db.collection("users").doc(t.id).update({
        incidencias:t.incidencias-1
      })
    })
  }

  public del(id: string) {
    return this.db.collection("users").doc(id).delete().then(r => {
      return r;
    })
  }

  public getAll() {
    return this.db.collection("users").snapshotChanges().pipe(map((res:any) => {
      return res.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public getTecnicos() {
    return this.db.collection("users",ref=>ref.where("type","==","2")).snapshotChanges().pipe(map((res:any) => {
      return res.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public get(id: string) {
    return this.db.collection("users").doc(id).get()
      .pipe(map((res:any) => {
        const data = res.data() as User;
        data.id = id;
        return data;
      }));
  }

  public getExampleUser() {
    let user: User = {
      id: "xd",
      name: "José Raúl",
      lastname: "Noriega Meza",
      phone: "6671263673",
      email: "joranome@gmail.com",
      incidencias:4,
      isMale: true,
      birthdate: new Date(),
      department: "Sistemas",
clasificacion: '',
      type: 0,
      entryTime: "08:00",
      departureTime: "14:00",
      expiredTime: 0
    };
    return user;
  }
}
