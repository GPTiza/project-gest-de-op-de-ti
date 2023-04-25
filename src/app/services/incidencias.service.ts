import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Incidencia } from '../interfaces/incidencia';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {

  constructor(private db: AngularFirestore, private authService: AuthService) { }

  public addSecreOJefeDpto(s: Incidencia) {
    let id = this.db.createId();

    return this.db.collection("incidencias").doc(id).set({
      id: id,
      aula: s.aula,
      edificio: s.edificio,
      type: s.type,
      user: s.user,
      userId: s.user.id,
      equipo: s.equipo,
      department: s.department,
      description: s.description,
      priority: -1,
      status: 0,
      tecnico: null,
      tecnicoId: null,
      solicitudCambio: null,
      creationDate: new Date(),
      asignationDate: null,
      finishedDate: null,
    })
  }

  public asignarPrioridad(id: string, priority: number) {
    return this.db.collection("incidencias").doc(id).update({
      priority: priority,
      status: 1
    })
  }

  public asignarTecnico(id: string, tecnico: User) {
    return this.db.collection("incidencias").doc(id).update({
      tecnico: tecnico,
      tecnicoId: tecnico.id,
      status: 2,
      asignationDate: new Date()
    })
  }

  public TerminarIncidencia(id: string) {
    return this.db.collection("incidencias").doc(id).update({
      status: 3,
      finishedDate: new Date(),
    })
  }

  public LiberarIncidencia(id: string) {
    return this.db.collection("incidencias").doc(id).update({
      status: 4,
      finishedDate: new Date(),
    })
  }

  public SolicitudCambio(id: string, cambio: string) {
    return this.db.collection("incidencias").doc(id).update({
      solicitudCambio: cambio,
      status: 5
    })
  }

  public aceptarSolicitudCambio(id: string) {
    return this.db.collection("incidencias").doc(id).update({
      status: 6
    })
  }

  public rechazarSolicitudCambio(id: string) {
    return this.db.collection("incidencias").doc(id).update({
      status: 7
    })
  }

  public rechazarIncidencias(id: string) {
    return this.db.collection("incidencias").doc(id).update({
      status: 8
    })
  }

  public del(id: string) {
    return this.db.collection("incidencias").doc(id).delete().then(r => {
      return r;
    })
  }

  public getAll() {
    let ref = this.db.collection("incidencias");
    let user = this.authService.getActualUser();
    if (user['type'] == 2)
      ref = this.db.collection("incidencias", ref => ref.where("tecnicoId", "==", user['id']));
    if (user['type'] > 2)
      ref = this.db.collection("incidencias", ref => ref.where("userId", "==", user['id']));
    return ref.snapshotChanges().pipe(map(res => {
      return res.map(a => {
        const data = a.payload.doc.data() as Incidencia;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public get(id: string) {
    return this.db.collection("incidencias").doc(id).get()
      .pipe(map(res => {
        const data = res.data() as Incidencia;
        data.id = id;
        return data;
      }));
  }
}