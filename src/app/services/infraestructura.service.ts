import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Aula } from '../interfaces/aula';
import { Departamento } from '../interfaces/Departamento';
import { Edificio } from '../interfaces/edificio';

@Injectable({
  providedIn: 'root'
})
export class InfraestructuraService {
  constructor(private db: AngularFirestore) { }

  // Métodos para gestionar Aulas
  public addAula(aula: Aula) {
    let id = this.db.createId();

    return this.db.collection("aulas").doc(id).set({
      id: id,
      nombre: aula.nombre,
      edificio: aula.edificio,
      departamento: aula.departamento,
    })
  }

  public updateAula(data: Partial<Aula>) {
    return this.db.collection('aulas').doc(data.id).update(data);
  }

  public deleteAula(id: string) {
    return this.db.collection('aulas').doc(id).delete();
  }

  public getAllAulas() {
    return this.db.collection('aulas').snapshotChanges().pipe(map(res => {
      return res.map(a => {
        let res:any=a.payload.doc.data();
        let data:Aula={
          id: res.id,
          nombre: res.nombre,
          departamento: res.departamento,
          edificio: res.edificio
        };
        return data;
      });
    }));
  }

  public getAula(id: string) {
    return this.db.collection('aulas').doc(id).get().pipe(map(res => {
      const data = res.data() as Aula;
      data.id = id;
      return data;
    }));
  }

  // Métodos para gestionar Edificios
  public addEdificio(edificio: Edificio) {
    let id = this.db.createId();

    return this.db.collection("edificios").doc(id).set({
      id: id,
      nombre: edificio.nombre,
      departamento: edificio.departamento,
    })
  }

  public updateEdificio(data: Partial<Edificio>) {
    return this.db.collection('edificios').doc(data.id).update(data);
  }

  public deleteEdificio(id: string) {
    return this.db.collection('edificios').doc(id).delete();
  }

  public getAllEdificios() {
    return this.db.collection('edificios').snapshotChanges().pipe(map(res => {
      return res.map(e => {
        let res:any=e.payload.doc.data();
        let data:Edificio={
          id: res.id,
          nombre: res.nombre,
          departamento: res.departamento
        };
        return data;
      });
    }));
  }

  public getEdificio(id: string) {
    return this.db.collection('edificios').doc(id).get().pipe(map(res => {
      const data = res.data() as Edificio;
      data.id = id;
      return data;
    }));
  }

  // Métodos para gestionar Departamentos
  public addDepartamento(departamento: Departamento) {
    let id = this.db.createId();
    return this.db.collection("departamentos").doc(id).set({
      id: id,
      nombre: departamento.nombre,
    })
  }

  public updateDepartamento(data: Partial<Departamento>) {
    return this.db.collection('departamentos').doc(data.id).update(data);
  }

  public deleteDepartamento(id: string) {
    return this.db.collection('departamentos').doc(id).delete();
  }

  public getAllDepartamentos() {
    return this.db.collection('departamentos').snapshotChanges().pipe(map(res => {
      return res.map(d => {
        let res:any=d.payload.doc.data();
        let data:Departamento={
          id: res.id,
          nombre: res.nombre
        };
        return data;
      });
    }));
  }

  public getDepartamento(id: string) {
    return this.db.collection('departamentos').doc(id).get().pipe(map(res => {
      const data = res.data() as Departamento;
      data.id = id;
      return data;
    }));
  }
}
