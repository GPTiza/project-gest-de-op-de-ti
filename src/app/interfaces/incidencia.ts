import { Computer } from "./computer";
import { User } from "./user";

export interface Incidencia {
    id:string,
    aula:string,
    edificio:string,
    type:string,
    equipo:Computer,
    department:string,
    description:string,
    priority:number,
    creationDate:any,
    asignationDate:any,
    finishedDate:any,
    status:number,
    tecnico:User|null,
    user:User,
    solicitudCambio:string
}