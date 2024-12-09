import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore, private authService: AuthService) {}

  public add(u: User) {
    let id = '';
    return this.authService
      .register(u.email, 'Tec1234.')
      .then((authUser) => {
        id = authUser['user']!['uid'];
        return this.db.collection('users').doc(id).set({
          id: id,
          name: u.name,
          lastname: u.lastname,
          phone: u.phone,
          email: u.email,
          isMale: u.isMale,
          birthdate: u.birthdate,
          department: u.department,
          clasificacion: u.clasificacion || '',
          incidencias: u.incidencias || 0,
          entryTime: u.entryTime || '',
          departureTime: u.departureTime || '',
          type: u.type || 0,
          creationDate: new Date(),
        });
      })
      .catch((error) => {
        console.error('Error al registrar usuario:', error);
        throw error;
      });
  }

  public put(u: User) {
    if (!u.id) {
      console.error('El ID del usuario es requerido para actualizar.');
      return Promise.reject('El ID del usuario es requerido para actualizar.');
    }
    return this.db
      .collection('users')
      .doc(u.id)
      .update({
        name: u.name,
        lastname: u.lastname,
        phone: u.phone,
        isMale: u.isMale,
        birthdate: u.birthdate,
        department: u.department,
        clasificacion: u.clasificacion || '',
        entryTime: u.entryTime || '',
        departureTime: u.departureTime || '',
        type: u.type || 0,
      })
      .then((r) => r)
      .catch((error) => {
        console.error('Error al actualizar usuario:', error);
        throw error;
      });
  }

  public subIncidencias(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.get(id).subscribe(
        (user) => {
          if (user && user.incidencias > 0) {
            this.db
              .collection("users")
              .doc(user.id)
              .update({
                incidencias: user.incidencias - 1,
              })
              .then(() => {
                resolve(); // Operación exitosa
              })
              .catch((error) => {
                console.error("Error al reducir incidencias:", error);
                reject(error); // Rechazar en caso de error
              });
          } else {
            const errorMsg = "Usuario no encontrado o incidencias ya es 0.";
            console.error(errorMsg);
            reject(errorMsg); // Rechazar si no hay incidencias
          }
        },
        (error) => {
          console.error("Error al obtener usuario:", error);
          reject(error); // Rechazar en caso de error en `get`
        }
      );
    });
  }

  public del(id: string) {
    if (!id) {
      console.error('El ID del usuario es requerido para eliminar.');
      return Promise.reject('El ID del usuario es requerido para eliminar.');
    }
    return this.db
      .collection('users')
      .doc(id)
      .delete()
      .then((r) => r)
      .catch((error) => {
        console.error('Error al eliminar usuario:', error);
        throw error;
      });
  }

  public getAll() {
    return this.db
      .collection('users')
      .snapshotChanges()
      .pipe(
        map((res: any) => {
          return res.map((a: any) => {
            const data = a.payload.doc.data() as User;
            data.id = a.payload.doc.id;
            return data;
          });
        }),
        catchError((error) => {
          console.error('Error al obtener todos los usuarios:', error);
          return of([]);
        })
      );
  }

  public getTecnicos() {
    return this.db
      .collection('users', (ref) => ref.where('type', '==', '2'))
      .snapshotChanges()
      .pipe(
        map((res: any) => {
          return res.map((a: any) => {
            const data = a.payload.doc.data() as User;
            data.id = a.payload.doc.id;
            return data;
          });
        }),
        catchError((error) => {
          console.error('Error al obtener técnicos:', error);
          return of([]);
        })
      );
  }

public get(id: string) {
  return this.db
    .collection("users")
    .doc(id)
    .get()
    .pipe(
      map((res: any) => {
        if (res.exists) {
          const data = res.data() as User;
          data.id = id;
          return data;
        } else {
          throw new Error("El usuario no existe en la base de datos.");
        }
      })
    );
}

  public getExampleUser() {
    let user: User = {
      id: 'xd',
      name: 'José Raúl',
      lastname: 'Noriega Meza',
      phone: '6671263673',
      email: 'joranome@gmail.com',
      incidencias: 4,
      isMale: true,
      birthdate: new Date(),
      department: 'Sistemas',
      clasificacion: '',
      type: 0,
      entryTime: '08:00',
      departureTime: '14:00',
      expiredTime: 0,
    };
    return user;
  }
}
