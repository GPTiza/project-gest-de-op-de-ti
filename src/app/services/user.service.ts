import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Time } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public getUser() {
      let user:User = {
        id: "xd",
        name: "José Raúl",
        lastName: "Noriega Meza",
        phone: "6671263673",
        email: "joranome@gmail.com",
        isMale: true,
        birthdate: new Date(),
        department: "Sistemas",
        location: new GeolocationPosition(),
        type:0,
        entryTime: new Date(),
        departureTime: new Date(),
        expiredTime: 0
      };
      return user;
  }

  public setUser(i:number) {
    if (i == 1) {
      let user = {
        id: "xd",
        name: "José Raúl",
        lastName: "Noriega Meza",
        phone: "6671263673",
        email: "joranome@gmail.com",
        isMale: true,
        birthdate: new Date(),
        department: "Sistemas",
        location: new GeolocationPosition(),
        type:0,
        entryTime: new Date(),
        departureTime: new Date(),
        expiredTime: 0
      };
      this.saveUser(user);
    }
  }

  saveUser(u: User) {
    u['expiredTime']=Date.now()+60*1000*60;
    localStorage.setItem('incitecUser', JSON.stringify(u))
  }

  deleteUser() {
    localStorage.clear();
  }

  getActualUser() {
    let u = localStorage.getItem('incitecUser');
    if (!u) return null;
    let user=JSON.parse(u);
    if(!user['expiredTime']) return null;
    if(user['expiredTime']<Date.now()) return null;
    return user;
  }
}
