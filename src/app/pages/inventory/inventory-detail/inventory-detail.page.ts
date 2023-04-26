import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { Computer } from 'src/app/interfaces/computer';
import { Component as comp } from 'src/app/interfaces/component';
import { UserService } from 'src/app/services/user.service';
import { ComputerService } from 'src/app/services/computer.service';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { IncidenciasService } from 'src/app/services/incidencias.service';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.page.html',
  styleUrls: ['./inventory-detail.page.scss'],
})

export class InventoryDetailPage implements OnInit {

  id = "";
  users: User[] = [];
  selectedUser!: User;
  computer!: Computer;
  seeHistory = false;

  aulasFiltered = [];
  edificiosSistemas = ["EA", "EB", "EC", "CC"]
  aulasClases = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"];
  aulasCC = ["BD", "PW", "DM", "DS"]

  computerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    brand: new FormControl('', [Validators.required]),
    date: new FormControl(new Date().toISOString().split('T')[0]),
    department: new FormControl('', [Validators.required, Validators.minLength(6)]),
    latitude: new FormControl(''),
    longitude: new FormControl(''),
    red: new FormControl('', [Validators.required, Validators.minLength(6)]),
    responsable: new FormControl(this.userService.getExampleUser().name + " " + this.userService.getExampleUser().lastname, [Validators.required]),

    uso: new FormControl('', [Validators.required, Validators.minLength(6)]),
    tipoCompra: new FormControl('', [Validators.required, Validators.minLength(6)]),
    tipoEquipo: new FormControl('', [Validators.required]),
    so: new FormControl('', [Validators.required]),
    edificio: new FormControl('', [Validators.required]),
    aula: new FormControl('', [Validators.required]),

    diskname: new FormControl('', []),
    disktype: new FormControl('', []),
    diskcapacity: new FormControl(0, []),
    diskwarrantyExpirationDate: new FormControl(new Date().toISOString().split('T')[0]),
    diskserieNumber: new FormControl('', []),

    ramname: new FormControl('', []),
    ramtype: new FormControl('', []),
    ramcapacity: new FormControl(0, []),
    ramwarrantyExpirationDate: new FormControl(new Date().toISOString().split('T')[0]),
    ramserieNumber: new FormControl('', []),

    powerSupplyname: new FormControl('', []),
    powerSupplytype: new FormControl('', []),
    powerSupplycapacity: new FormControl(0, []),
    powerSupplywarrantyExpirationDate: new FormControl(new Date().toISOString().split('T')[0]),
    powerSupplyserieNumber: new FormControl('', []),

    motherboardname: new FormControl('', []),
    motherboardtype: new FormControl('', []),
    motherboardwarrantyExpirationDate: new FormControl(new Date().toISOString().split('T')[0]),
    motherboardserieNumber: new FormControl('', []),

    processadorname: new FormControl('', []),
    processadorwarrantyExpirationDate: new FormControl(new Date().toISOString().split('T')[0]),
    processadorserieNumber: new FormControl('', []),

    cabinetname: new FormControl('', []),
    cabinettype: new FormControl('', []),
    cabinetwarrantyExpirationDate: new FormControl(new Date().toISOString().split('T')[0]),
    cabinetserieNumber: new FormControl('', []),

    mousename: new FormControl('', []),
    mousewarrantyExpirationDate: new FormControl(new Date().toISOString().split('T')[0]),
    mouseserieNumber: new FormControl('', []),

    keyboardname: new FormControl('', []),
    keyboardwarrantyExpirationDate: new FormControl(new Date().toISOString().split('T')[0]),
    keyboardserieNumber: new FormControl('', []),

    printertype: new FormControl('', []),
    printerinktype: new FormControl('', []),
    printername: new FormControl('', []),

    projectorfocusname: new FormControl('', []),
    projectorfocusvolt: new FormControl(0, []),
    projectorfocusbase: new FormControl('', []),
  });

  constructor(private params: NavParams, private userService: UserService, private incidenciasService: IncidenciasService, private computerService: ComputerService, private alertservice: AlertService) {
    this.loadInit()
  }

  ngOnInit() {
    this.loadInit
  }

  loadInit() {

    this.userService.getAll().subscribe(u => {
      this.users = u;
      this.selectedUser = this.users[0];
    })
    if (this.params.get('computer')) {
      if (!this.params.get('canEdit')) {
        this.computerForm.disable()
      }

      let c: Computer = this.params.get('computer');
      this.computer = c;
      var disk = new Date(0);
      disk.setUTCSeconds(c.disk.warrantyExpirationDate['seconds']);
      var ram = new Date(0);
      ram.setUTCSeconds(c.ram.warrantyExpirationDate['seconds']);
      var powerSupply = new Date(0);
      powerSupply.setUTCSeconds(c.powerSupply.warrantyExpirationDate['seconds']);
      var motherboard = new Date(0);
      motherboard.setUTCSeconds(c.motherboard.warrantyExpirationDate['seconds']);
      var cabinet = new Date(0);
      cabinet.setUTCSeconds(c.cabinet.warrantyExpirationDate['seconds']);
      var processador = new Date(0);
      processador.setUTCSeconds(c.processador.warrantyExpirationDate['seconds']);
      var mouse = new Date(0);
      mouse.setUTCSeconds(c.mouse.warrantyExpirationDate['seconds']);
      var keyboard = new Date(0);
      keyboard.setUTCSeconds(c.keyboard.warrantyExpirationDate['seconds']);

      this.id = c.id;
      this.computerForm.setValue({
        name: c.name,
        brand: c.brand,
        date: c.date,
        department: c.department,
        latitude: c.location ? c.location.latitude : 1,
        longitude: c.location ? c.location.longitude : 1,
        red: c.red,
        responsable: c.responsable.id,

        uso: c.uso,
        tipoCompra: c.tipoCompra,
        tipoEquipo: c.tipoEquipo,
        so: c.so,
        edificio: c.edificio,
        aula: c.aula,

        diskname: c.disk.name,
        disktype: c.disk.type ? c.disk.type : '',
        diskcapacity: c.disk.capacity ? c.disk.capacity : 0,
        diskwarrantyExpirationDate: new Date().toISOString().split('T')[0],// disk.toISOString().split('T')[0],
        diskserieNumber: c.disk.serieNumber,

        ramname: c.ram.name,
        ramtype: c.ram.type ? c.ram.type : '',
        ramcapacity: c.ram.capacity ? c.ram.capacity : 0,
        ramwarrantyExpirationDate: new Date().toISOString().split('T')[0],// ram.toISOString().split('T')[0],
        ramserieNumber: c.ram.serieNumber,

        powerSupplyname: c.powerSupply.name,
        powerSupplytype: c.powerSupply.type ? c.powerSupply.type : '',
        powerSupplycapacity: c.powerSupply.capacity ? c.powerSupply.capacity : 0,
        powerSupplywarrantyExpirationDate: new Date().toISOString().split('T')[0],// powerSupply.toISOString().split('T')[0],
        powerSupplyserieNumber: c.powerSupply.serieNumber,

        motherboardname: c.motherboard.name,
        motherboardtype: c.motherboard.type ? c.motherboard.type : '',
        motherboardwarrantyExpirationDate: new Date().toISOString().split('T')[0],// motherboard.toISOString().split('T')[0],
        motherboardserieNumber: c.motherboard.serieNumber,

        cabinetname: c.cabinet.name,
        cabinettype: c.cabinet.type ? c.cabinet.type : '',
        cabinetwarrantyExpirationDate: new Date().toISOString().split('T')[0],// cabinet.toISOString().split('T')[0],
        cabinetserieNumber: c.cabinet.serieNumber,

        processadorname: c.processador.name,
        processadorwarrantyExpirationDate: new Date().toISOString().split('T')[0],// processador.toISOString().split('T')[0],
        processadorserieNumber: c.processador.serieNumber,

        mousename: c.mouse.name,
        mousewarrantyExpirationDate: new Date().toISOString().split('T')[0],// mouse.toISOString().split('T')[0],
        mouseserieNumber: c.mouse.serieNumber,

        keyboardname: c.keyboard.name,
        keyboardwarrantyExpirationDate: new Date().toISOString().split('T')[0],// keyboard.toISOString().split('T')[0],
        keyboardserieNumber: c.keyboard.serieNumber,

        printertype: c.printertype,
        printerinktype: c.printerinktype,
        printername: c.printername,

        projectorfocusname: c.projectorfocusname,
        projectorfocusvolt: c.projectorfocusvolt,
        projectorfocusbase: c.projectorfocusbase,
      });
    }
  }

  save() {
    let c: Computer = {
      id: this.id,
      name: this.computerForm.controls['name'].value!,
      brand: this.computerForm.controls['brand'].value!,
      date: this.computerForm.controls['date'].value!,
      department: this.computerForm.controls['department'].value!,
      location: {
        'latitude': this.computerForm.controls['latitude'].value,
        'longitude': this.computerForm.controls['longitude'].value,
      },
      red: this.computerForm.controls['red'].value!,
      responsable: this.selectedUser,
      disk: this.getComponent('disk'),
      ram: this.getComponent('ram'),
      powerSupply: this.getComponent('powerSupply'),
      motherboard: this.getComponent('motherboard'),
      processador: this.getComponent('processador'),
      cabinet: this.getComponent('cabinet'),
      mouse: this.getComponent('mouse'),
      keyboard: this.getComponent('keyboard'),
      uso: this.computerForm.controls['uso'].value!,
      tipoCompra: this.computerForm.controls['tipoCompra'].value!,
      tipoEquipo: this.computerForm.controls['tipoEquipo'].value!,
      so: this.computerForm.controls['so'].value!,
      edificio: this.computerForm.controls['edificio'].value!,
      aula: this.computerForm.controls['aula'].value!,
      printertype: this.computerForm.controls['printertype'].value!,
      printerinktype: this.computerForm.controls['printerinktype'].value!,
      printername: this.computerForm.controls['printername'].value!,
      projectorfocusname: this.computerForm.controls['projectorfocusname'].value!,
      projectorfocusvolt: this.computerForm.controls['projectorfocusvolt'].value!,
      projectorfocusbase: this.computerForm.controls['projectorfocusbase'].value!,
      history: []
    }
    if (this.id.length > 0) {
      let guardado = false;
      this.incidenciasService.getByComputerAndStatus(c.id, 6).subscribe(i => {
        if (!guardado) {
          if (i) {
            let h = c.history;
            console.log(h)
            c.history = this.computerService.setHistory(this.computer, c, i)
            console.log(c.history)
            if (h.length < c.history.length)
              this.computerService.put(c).then(r => {
                this.alertservice.successful('Se ha actualizado el dispositivo');
                guardado = true;
              });
            this.alertservice.error('No ha cambiado el No. de Serie');
          } else {
            this.alertservice.error('No hay ninguna incidencia con el cambio aprobado');
          }
        }
      })
    }
    else
      this.computerService.add(c).then(r => {
        this.alertservice.successful('Se ha agregado el dispositivo');
      });
    this.params.get('modal').dismiss();
  }

  getComponent(name: any) {
    let c: comp = {
      name: this.computerForm.get(name + 'name')?.value,
      warrantyExpirationDate: this.computerForm.get(name + 'warrantyExpirationDate')?.value,
      serieNumber: this.computerForm.get(name + 'serieNumber')?.value
    }
    if (this.computerForm.get(name + 'capacity'))
      c.capacity = this.computerForm.get(name + 'capacity')?.value;
    if (this.computerForm.get(name + 'type'))
      c.type = this.computerForm.get(name + 'type')?.value;
    return c;
  }

  viewHistory() {
    this.seeHistory = !this.seeHistory;
  }

}
