import { Injectable } from '@angular/core';
import { Service } from '../interfaces/service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private db: AngularFirestore) { }


  public addProblem(s: Service) {
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

  public putProblem(s: Service) {
    return this.db.collection("services").doc(s.id).update({
      problem: s.problem,
      solution: s.solution,
      time: s.time,
    }).then(r => {
      return r;
    })
  }

  public delProblem(id: string) {
    return this.db.collection("services").doc(id).delete().then(r => {
      return r;
    })
  }

  public getAllProblem() {
    return this.db.collection("services").snapshotChanges().pipe(map(res => {
      return res.map(a => {
        const data = a.payload.doc.data() as Service;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public getProblem(id: string) {
    return this.db.collection("services").doc(id).get()
      .pipe(map(res => {
        const data = res.data() as Service;
        data.id = id;
        return data;
      }));
  }

  public addService(s: Service) {
    let id = this.db.createId();
    return this.db.collection("servicesR").doc(id).set({
      id:id,
      problem: s.problem,
      solution: s.solution,
      time: s.time,
      date:s.date,
      creationDate: new Date()
    })
  }

  public putService(s: Service) {
    return this.db.collection("servicesR").doc(s.id).update({
      problem: s.problem,
      solution: "",
      time: s.time,
    }).then(r => {
      return r;
    })
  }

  public delService(id: string) {
    return this.db.collection("servicesR").doc(id).delete().then(r => {
      return r;
    })
  }

  public getAllService() {
    return this.db.collection("servicesR").snapshotChanges().pipe(map(res => {
      return res.map(a => {
        const data = a.payload.doc.data() as Service;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public getService(id: string) {
    return this.db.collection("servicesR").doc(id).get()
      .pipe(map(res => {
        const data = res.data() as Service;
        data.id = id;
        return data;
      }));
  }
}