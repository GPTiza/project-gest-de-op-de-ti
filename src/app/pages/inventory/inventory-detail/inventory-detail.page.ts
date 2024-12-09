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
import { InfraestructuraService } from 'src/app/services/infraestructura.service';
import { Aula } from 'src/app/interfaces/aula';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.page.html',
  styleUrls: ['./inventory-detail.page.scss'],
})

export class InventoryDetailPage implements OnInit {
  edificiosSistemas = []
  id = "";
  users: User[] = [];
  selectedUser!: User;
  computer!: Computer;
  seeHistory = false;

  edificiosFiltrados: string[] = [];
  aulasFiltradas: string[] = [];

  departamentos: string[] = ['Sistemas', 'Bioquimica', 'Mecánica', 'Ciencias Básicas'];
  edificios: any = {};
  aulas: any = {};

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

  constructor(private params: NavParams, private infraestructuraService: InfraestructuraService, private userService: UserService, private incidenciasService: IncidenciasService, private computerService: ComputerService, private alertservice: AlertService) {
    this.loadInit()
  }

  ngOnInit() {
    this.loadInit()
  }

  loadInit() {
    this.computerForm.get('aula')?.disable()
    this.computerForm.get('edificio')?.disable()
    this.userService.getAll().subscribe(u => {
      this.users = u;
      this.selectedUser = this.users[0];
      this.infraestructuraService.getAllAulas().subscribe((data) => {
        this.aulas = {};
        data.forEach(d => {
          if (!this.aulas[d.edificio]) {
            this.aulas[d.edificio] = [];
          }
          this.aulas[d.edificio].push(d.nombre);
        })
        this.infraestructuraService.getAllEdificios().subscribe((data) => {
          this.edificios = {};
          data.forEach(d => {
            if (!this.edificios[d.departamento]) {
              this.edificios[d.departamento] = [];
            }
            this.edificios[d.departamento].push(d.nombre);
          })
          this.infraestructuraService.getAllDepartamentos().subscribe((data) => {
            this.departamentos = data.map(d => d.nombre);
          });
        });
      });
    })
    this.computerForm.get('department')?.valueChanges.subscribe(department => {
      this.updateEdificios(department!);
      this.updateAulas(null); // Reset aulas cuando cambie el departamento
    });

    // Suscribir al cambio de edificio
    this.computerForm.get('edificio')?.valueChanges.subscribe(edificio => {
      this.updateAulas(edificio);
    });
    if (this.params.get('computer')) {
      if (!this.params.get('canEdit')) {
        this.computerForm.disable();
      }
    
      let c: Computer = this.params.get('computer');
      this.computer = c;
    
      // Actualiza las listas de edificios y aulas
      this.updateEdificios(c.department);
      this.updateAulas(c.edificio);
    
      // Habilita los controles de edificio y aula
      this.computerForm.get('edificio')?.enable();
      this.computerForm.get('aula')?.enable();
    
      // Establece los valores en el formulario
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
        disktype: c.disk.type || '',
        diskcapacity: c.disk.capacity || 0,
        diskwarrantyExpirationDate: c.disk.warrantyExpirationDate || new Date().toISOString().split('T')[0],
        diskserieNumber: c.disk.serieNumber || '',
        ramname: c.ram.name,
        ramtype: c.ram.type || '',
        ramcapacity: c.ram.capacity || 0,
        ramwarrantyExpirationDate: c.ram.warrantyExpirationDate || new Date().toISOString().split('T')[0],
        ramserieNumber: c.ram.serieNumber || '',
        powerSupplyname: c.powerSupply.name,
        powerSupplytype: c.powerSupply.type || '',
        powerSupplycapacity: c.powerSupply.capacity || 0,
        powerSupplywarrantyExpirationDate: c.powerSupply.warrantyExpirationDate || new Date().toISOString().split('T')[0],
        powerSupplyserieNumber: c.powerSupply.serieNumber || '',
        motherboardname: c.motherboard.name,
        motherboardtype: c.motherboard.type || '',
        motherboardwarrantyExpirationDate: c.motherboard.warrantyExpirationDate || new Date().toISOString().split('T')[0],
        motherboardserieNumber: c.motherboard.serieNumber || '',
        processadorname: c.processador.name,
        processadorwarrantyExpirationDate: c.processador.warrantyExpirationDate || new Date().toISOString().split('T')[0],
        processadorserieNumber: c.processador.serieNumber || '',
        cabinetname: c.cabinet.name,
        cabinettype: c.cabinet.type || '',
        cabinetwarrantyExpirationDate: c.cabinet.warrantyExpirationDate || new Date().toISOString().split('T')[0],
        cabinetserieNumber: c.cabinet.serieNumber || '',
        mousename: c.mouse.name,
        mousewarrantyExpirationDate: c.mouse.warrantyExpirationDate || new Date().toISOString().split('T')[0],
        mouseserieNumber: c.mouse.serieNumber || '',
        keyboardname: c.keyboard.name,
        keyboardwarrantyExpirationDate: c.keyboard.warrantyExpirationDate || new Date().toISOString().split('T')[0],
        keyboardserieNumber: c.keyboard.serieNumber || '',
        printertype: c.printertype || '',
        printerinktype: c.printerinktype || '',
        printername: c.printername || '',
        projectorfocusname: c.projectorfocusname || '',
        projectorfocusvolt: c.projectorfocusvolt || 0,
        projectorfocusbase: c.projectorfocusbase || ''
      });
    }    
  }

  updateEdificios(department: string) {
    const edificioControl = this.computerForm.get('edificio');
    if (department) {
      this.edificiosFiltrados = this.edificios[department] || [];
      if (this.edificiosFiltrados.length > 0) {
        edificioControl?.enable();
      } else {
        edificioControl?.disable();
      }
    } else {
      this.edificiosFiltrados = [];
      edificioControl?.disable();
    }
  }
  
  updateAulas(edificio: string | null) {
    const aulaControl = this.computerForm.get('aula');
    if (edificio) {
      this.aulasFiltradas = this.aulas[edificio] || [];
      if (this.aulasFiltradas.length > 0) {
        aulaControl?.enable();
      } else {
        aulaControl?.disable();
      }
    } else {
      this.aulasFiltradas = [];
      aulaControl?.disable();
    }
  }
  
  save() {
    // Construye el objeto de la computadora desde el formulario
    const c: Computer = {
      id: this.id, // Utiliza el id existente si es una edición
      name: this.computerForm.controls['name'].value!,
      brand: this.computerForm.controls['brand'].value!,
      date: this.computerForm.controls['date'].value!,
      department: this.computerForm.controls['department'].value!,
      location: {
        latitude: this.computerForm.controls['latitude'].value,
        longitude: this.computerForm.controls['longitude'].value,
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
    };
  
    if (this.id && this.id.length > 0) {
      // Si el id existe, actualiza el registro existente
      this.computerService.put(c).then(() => {
        this.alertservice.successful('Se ha actualizado el dispositivo correctamente.');
        this.params.get('modal').dismiss(); // Cierra el modal
      }).catch(err => {
        this.alertservice.error('Hubo un problema al actualizar el dispositivo.');
        console.error(err);
      });
    } else {
      // Si no existe id, crea un nuevo registro
      this.computerService.add(c).then(() => {
        this.alertservice.successful('Se ha agregado el dispositivo correctamente.');
        this.params.get('modal').dismiss(); // Cierra el modal
      }).catch(err => {
        this.alertservice.error('Hubo un problema al agregar el dispositivo.');
        console.error(err);
      });
    }
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