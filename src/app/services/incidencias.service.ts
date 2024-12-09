import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Incidencia } from '../interfaces/incidencia';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {

  constructor(private db: AngularFirestore, private authService: AuthService, private userService: UserService) { }

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
      equipoId: s.equipo.id,
      department: s.department,
      description: s.description,
      clasificacion: '',
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

  public asignarPrioridad(id: string, priority: number, clasificacion: string) {
    return this.db.collection("incidencias").doc(id).update({
      priority: priority,
      clasificacion: clasificacion,
      status: 1
    })
  }

  public asignarTecnico(id: string, tecnico: User) {
    tecnico.incidencias += 1;
    return this.db.collection("incidencias").doc(id).update({
      tecnico: tecnico,
      tecnicoId: tecnico.id,
      status: 2,
      asignationDate: new Date()
    }).then(() => {
      this.db.collection("users").doc(tecnico.id).update({
        incidencias: tecnico.incidencias
      })
    })
  }

  public TerminarIncidencia(id: string, diagnostico:string, tiempo:number, tecnicoId: string) {
    return this.db.collection("incidencias").doc(id).update({
      status: 3,
      diagnostico:diagnostico,
      tiempo:tiempo,
      finishedDate: new Date(),
    }).then(() => {
      if (tecnicoId)
        this.userService.subIncidencias(tecnicoId);
    })
  }

  public LiberarIncidencia(id: string) {
    return this.db.collection("incidencias").doc(id).update({
      status: 4,
      finishedDate: new Date(),
    })
  }

  public SolicitudCambio(id: string, diagnostico:string, tiempo:number, cambio: string) {
    return this.db.collection("incidencias").doc(id).update({
      solicitudCambio: cambio,
      diagnostico:diagnostico,
      tiempo:tiempo,
      status: 5
    })
  }

  public aceptarSolicitudCambio(id: string) {
    return this.db.collection("incidencias").doc(id).update({
      status: 6
    })
  }

  public rechazarSolicitudCambio(id: string, tecnicoId: string) {
    return this.db.collection("incidencias").doc(id).update({
      status: 7
    }).then(() => {
      if (tecnicoId)
        this.userService.subIncidencias(tecnicoId);
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

  public getAllget() {
    let ref = this.db.collection("incidencias");
    let user = this.authService.getActualUser();
    if (user['type'] == 2)
      ref = this.db.collection("incidencias", ref => ref.where("tecnicoId", "==", user['id']));
    if (user['type'] > 2)
      ref = this.db.collection("incidencias", ref => ref.where("userId", "==", user['id']));
    return ref.get().pipe(map(res => {
      let incidencias:Incidencia[]=[]
      res.docs.forEach(r=>{
          const data = r.data() as Incidencia;
          data.id = r.id;
          incidencias.push(data);
      });
      return incidencias;
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

  public getByComputerAndStatus(computerId: string,status:number) {
    return this.db.collection("incidencias",ref=>ref.where("equipoId","==",computerId).where("status","==",status)).get().pipe(map(res => {
        const data = res.docs[0].data() as Incidencia;
        data.id = res.docs[0].id;
        return data;
    }));
  }

  public getServicesR() {
    return this.db.collection("servicesR").snapshotChanges().pipe(
      map(res => res.map(a => {
        const data = a.payload.doc.data() as any;
        data.id = a.payload.doc.id;
        return data;
      }))
    );
  }
}