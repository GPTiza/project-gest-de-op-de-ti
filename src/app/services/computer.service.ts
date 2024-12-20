import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component } from '../interfaces/component';
import { User } from '../interfaces/user';
import { Computer } from '../interfaces/computer';
import { map } from 'rxjs';
import { IncidenciasService } from './incidencias.service';
import { Incidencia } from '../interfaces/incidencia';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {

  constructor(private db: AngularFirestore) { }

  public add(c: Computer) {
    let id = this.db.createId();
    return this.db.collection("computers").doc(id).set({
      id: id,
      brand: c.brand,
      name: c.name,
      date: c.date,
      department: c.department,
      location: c.location,
      red: c.red,
      uso: c.uso,
      tipoCompra: c.tipoCompra,
      tipoEquipo: c.tipoEquipo,
      so: c.so,
      edificio: c.edificio,
      aula: c.aula,
      responsable: c.responsable,
      disk: c.disk,
      ram: c.ram,
      powerSupply: c.powerSupply,
      motherboard: c.motherboard,
      processador: c.processador,
      cabinet: c.cabinet,
      mouse: c.mouse,
      keyboard: c.keyboard,

      printertype: c.printertype,
      printerinktype: c.printerinktype,
      printername: c.printername,

      projectorfocusname: c.projectorfocusname,
      projectorfocusvolt: c.projectorfocusvolt,
      projectorfocusbase: c.projectorfocusbase,
      creationDate: new Date()
    })
  }

  setHistory(antes: Computer, c: Computer, i: Incidencia) {
    let history = antes.history;
    let compAntes, compDespues,type;
    if (antes.disk.serieNumber != c.disk.serieNumber) {
      compAntes = antes.disk
      compDespues = c.disk
      type='Disco de Almacenamiento'
    } else
      if (antes.ram.serieNumber != c.ram.serieNumber) {
        compAntes = antes.ram
        compDespues = c.ram
        type='Memoria Ram'
      } else
        if (antes.powerSupply.serieNumber != c.powerSupply.serieNumber) {
          compAntes = antes.powerSupply
          compDespues = c.powerSupply
          type='Fuente de Poder'
        } else
          if (antes.motherboard.serieNumber != c.motherboard.serieNumber) {
            compAntes = antes.motherboard
            compDespues = c.motherboard
            type='Tajeta madre'
          } else
            if (antes.processador.serieNumber != c.processador.serieNumber) {
              compAntes = antes.processador
              compDespues = c.processador
              type='Procesador'
            } else
              if (antes.cabinet.serieNumber != c.cabinet.serieNumber) {
                compAntes = antes.cabinet
                compDespues = c.cabinet
                type='Gabinete'
              } else
                if (antes.mouse.serieNumber != c.mouse.serieNumber) {
                  compAntes = antes.mouse
                  compDespues = c.mouse
                  type='Mouse'
                } else
                  if (antes.keyboard.serieNumber != c.keyboard.serieNumber) {
                    compAntes = antes.keyboard
                    compDespues = c.keyboard
                    type='Teclado'
                  }

    if (compAntes && compDespues) {
      history.push({
        'antes': compAntes,
        'despues': compDespues,
        'tecnico': i.tecnico,
        'user': i.user,
        'incidencia': i.id,
        'incidenciaDate': i.creationDate,
        'comp':type,
        'date': new Date().toISOString().substring(0, 10)
      })
      return history
    }
    return []
  }

  public put(c: Computer) {
    return this.db.collection("computers").doc(c.id).update({
      name: c.name,
      department: c.department,
      location: c.location,
      history: c.history,
      red: c.red,
      responsable: c.responsable,
      uso: c.uso,
      tipoCompra: c.tipoCompra,
      tipoEquipo: c.tipoEquipo,
      so: c.so,
      edificio: c.edificio,
      aula: c.aula,
      disk: c.disk,
      ram: c.ram,
      powerSupply: c.powerSupply,
      motherboard: c.motherboard,
      processador: c.processador,
      cabinet: c.cabinet,
      mouse: c.mouse,
      keyboard: c.keyboard,

      printertype: c.printertype,
      printerinktype: c.printerinktype,
      printername: c.printername,

      projectorfocusname: c.projectorfocusname,
      projectorfocusvolt: c.projectorfocusvolt,
      projectorfocusbase: c.projectorfocusbase,
    }).then(r => {
      return r;
    })
  }

  public del(id: string) {
    return this.db.collection("computers").doc(id).delete().then(r => {
      return r;
    })
  }

  public getAll() {
    return this.db.collection("computers").snapshotChanges().pipe(map(res => {
      return res.map(a => {
        const data = a.payload.doc.data() as Computer;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public get(id: string) {
    return this.db.collection("computers").doc(id).get()
      .pipe(map(res => {
        const data = res.data() as Computer;
        data.id = id;
        return data;
      }));
  }

  public getByAulayEdificioyTipo(aula: string, edificio: string, tipo: string) {
    return this.db.collection("computers", ref => ref.where("aula", "==", aula).where("edificio", "==", edificio).where("tipoEquipo", "==", tipo)).snapshotChanges().pipe(map(res => {
      return res.map(a => {
        const data = a.payload.doc.data() as Computer;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public getByDepartamento(Departamento: string) {
    return this.db.collection("computers", ref => ref.where("department", "==", Departamento)).snapshotChanges().pipe(map(res => {
      return res.map(a => {
        const data = a.payload.doc.data() as Computer;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  public getComputerExample(user: User) {
    let computer: Computer = {
      id: "1",
      name: 'Ejemplo',
      brand: 'Ejemplo',
      date: new Date(),
      department: user.department,
      location: undefined,
      red: 'Ejemplo',
      responsable: user,
      uso: 'Docente',
      tipoCompra: 'Comprada',
      tipoEquipo: 'PC',
      so: 'Windows',
      edificio: "EB",
      aula: "A3",
      disk: this.getComponentExample(),
      ram: this.getComponentExample(),
      powerSupply: this.getComponentExample(),
      motherboard: this.getComponentExample(),
      cabinet: this.getComponentExample(),
      mouse: this.getComponentExample(),
      keyboard: this.getComponentExample(),
      processador: this.getComponentExample(),
      printertype: 'Ejemplo',
      printerinktype: 'Ejemplo',
      printername: 'Ejemplo',
      projectorfocusname: 'Ejemplo',
      projectorfocusvolt: 0,
      projectorfocusbase: 'Ejemplo',
      history: []
    };
    return computer;
  }

  getComponentExample() {
    let c: Component = {
      name: 'Ejemplo',
      warrantyExpirationDate: new Date(),
      serieNumber: '012345'
    }
    return c;
  }
}