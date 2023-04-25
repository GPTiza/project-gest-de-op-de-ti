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
        location: u.location,
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
      location: u.location,
      entryTime: u.entryTime,
      departureTime: u.departureTime,
      type: u.type,
    }).then(r => {
      return r;
    })
  }

  public del(id: string) {
    return this.db.collection("users").doc(id).delete().then(r => {
      return r;
    })
  }

  public getAll() {
    return this.db.collection("users").snapshotChanges().pipe(map(res => {
      return res.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public getTecnicos() {
    return this.db.collection("users",ref=>ref.where("type","==","2")).snapshotChanges().pipe(map(res => {
      return res.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public get(id: string) {
    return this.db.collection("users").doc(id).get()
      .pipe(map(res => {
        const data = res.data() as User;
        data.id = id;
        return data;
      }));
  }

  public getExampleUsers() {
    let users: User[] = [];
    users.push({
      id: "xxxd",
      name: "Javier",
      lastname: "Castro Fernandez",
      phone: "9571263673",
      email: "jFernandez@hotmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Bioquimica",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "07:00",
      departureTime: "17:00",
      expiredTime: 0
    })




    users.push({
      id: "xxxxd",
      name: "Josue",
      lastname: "Olivas Meza",
      phone: "9991263673",
      email: "jOlivas@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "G.Empresarial",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "09:00",
      departureTime: "16:00",
      expiredTime: 0
    })





    users.push({
      id: "xxxxxd",
      name: "Jaime",
      lastname: "Mendoza Lopez",
      phone: "1452263673",
      email: "MendozaL@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Mecanica",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "07:00",
      departureTime: "16:00",
      expiredTime: 0
    })



    users.push({
      id: "xxxxxxd",
      name: "Fernando",
      lastname: "Cardoza",
      phone: "5861263673",
      email: "Mendoza@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Mecatronica",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "07:00",
      departureTime: "18:00",
      expiredTime: 0
    })




    users.push({
      id: "xxxxxxxd",
      name: "Omar",
      lastname: "Espinoza",
      phone: "8561263673",
      email: "Espinoza@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Electrica",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "07:00",
      departureTime: "18:00",
      expiredTime: 0
    })




    users.push({
      id: "xxxxxxxxd",
      name: "Giovani",
      lastname: "Fernandez Lopez",
      phone: "8891263673",
      email: "GFer@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Electronica",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "07:00",
      departureTime: "16:00",
      expiredTime: 0
    })




    users.push({
      id: "xxxxxxxxxd",
      name: "Javier",
      lastname: "Hernandez",
      phone: "581263673",
      email: "jHernandez@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Tics",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "07:00",
      departureTime: "16:00",
      expiredTime: 0
    })




    users.push({
      id: "xxxxxxxxxxd",
      name: "Jeronimo",
      lastname: "Castro ",
      phone: "8551263673",
      email: "jjCastro@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Industrial",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "07:00",
      departureTime: "16:00",
      expiredTime: 0
    })




    users.push({
      id: "xxxxxxxxxxxd",
      name: "JOsue",
      lastname: "Balderrama",
      phone: "5627263673",
      email: "jBastro@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Mecanica",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "07:00",
      departureTime: "16:00",
      expiredTime: 0
    })
    users.push({
      id: "User10",
      name: "Oscar",
      lastname: "Ocegueda Escobedo",
      phone: "5627266042",
      email: "oscarOce@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Centro de Información",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "07:00",
      departureTime: "16:00",
      expiredTime: 0
    })

    users.push({
      id: "User11",
      name: "Luis Fernando",
      lastname: "Rodriguez Lopez",
      phone: "4169198765",
      email: "rodriFer@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Centro de Información",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "11:00",
      departureTime: "20:00",
      expiredTime: 0
    })

    users.push({
      id: "User12",
      name: "Carlos Daniel",
      lastname: "Valdez Sanchez",
      phone: "4169160403",
      email: "carlosvalsan@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Centro de Información",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "10:00",
      departureTime: "19:00",
      expiredTime: 0
    })
    return users;
  }

  public getExampleUser() {
    let user: User = {
      id: "xd",
      name: "José Raúl",
      lastname: "Noriega Meza",
      phone: "6671263673",
      email: "joranome@gmail.com",
      isMale: true,
      birthdate: new Date(),
      department: "Sistemas",
      location: {
        longitude: 1,
        latitude: 1
      },
      type: 0,
      entryTime: "08:00",
      departureTime: "14:00",
      expiredTime: 0
    };
    return user;
  }
}
