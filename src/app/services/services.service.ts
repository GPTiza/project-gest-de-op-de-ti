import { Injectable } from '@angular/core';
import { Service } from '../interfaces/service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private db: AngularFirestore) { }


  public add(s: Service) {
    let id = this.db.createId();
    return this.db.collection("services").doc(id).set({
      id:id,
      problem: s.problem,
      solution: s.solution,
      time: s.time,
      date:s.date,
      creationDate: new Date()
    })
  }

  public put(s: Service) {
    return this.db.collection("services").doc(s.id).update({
      problem: s.problem,
      solution: s.solution,
      time: s.time,
    }).then(r => {
      return r;
    })
  }

  public del(id: string) {
    return this.db.collection("services").doc(id).delete().then(r => {
      return r;
    })
  }

  public getAll() {
    return this.db.collection("services").snapshotChanges().pipe(map(res => {
      return res.map(a => {
        const data = a.payload.doc.data() as Service;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public get(id: string) {
    return this.db.collection("services").doc(id).get()
      .pipe(map(res => {
        const data = res.data() as Service;
        data.id = id;
        return data;
      }));
  }
}