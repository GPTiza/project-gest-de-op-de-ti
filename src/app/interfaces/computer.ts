import { Component } from "./component";
import { User } from "./user";

export interface Computer {
    id:string,
    name: string,
    brand: string,
    date:any,
    department:string,
    location: any,
    red: string,
    responsable: User,
    uso:string,
    tipoCompra:string,
    tipoEquipo: string,
    so: string,
    edificio:string,
    aula:string,
    disk: Component,
    ram: Component,
    powerSupply: Component,
    motherboard: Component,
    processador: Component,
    cabinet: Component,
    mouse:Component,
    keyboard:Component,

    printertype:string,
    printerinktype:string,
    printername:string,

    projectorfocusname: string,
    projectorfocusvolt: number,
    projectorfocusbase: string,

    history:any
}
