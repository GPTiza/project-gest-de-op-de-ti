import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { InfraestructuraService } from 'src/app/services/infraestructura.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  id=""
  loggedUserType=4
  departamentos: string[] = [];

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phone: new FormControl('', [Validators.required,Validators.pattern('[0-9]{8}')]),
    email: new FormControl('', [Validators.required, Validators.minLength(6)]),
    isMale: new FormControl(false, [Validators.required]),
    birthdate: new FormControl(new Date().toISOString().split('T')[0], [Validators.required]),
    department: new FormControl('', [Validators.required, Validators.minLength(6)]),
    clasificacion: new FormControl(''),
    type: new FormControl(0, [Validators.required]),
    entryTime: new FormControl('', [Validators.required]),
    departureTime: new FormControl('', [Validators.required]),
  });

  constructor(private params: NavParams,private infraestructuraService:InfraestructuraService,private userService:UserService, private authService: AuthService,private alertservice:AlertService) {
    if(params.get('user')){
      let u:User=params.get('user');
      var d = new Date(0);
      d.setUTCSeconds(u.birthdate['seconds']);
      this.id=u.id;
      this.userForm.setValue({
        name: u.name,
        lastname: u.lastname,
        phone: u.phone,
        email: u.email,
        isMale: u.isMale,
        birthdate: d.toISOString().split('T')[0],
        department: u.department,
        clasificacion:u.clasificacion,
        type: u.type,
        entryTime: u.entryTime,
        departureTime: u.departureTime
      });
    }
  }

  ngOnInit() {
    this.loggedUserType=this.authService.getActualUser()['type'];
    if(this.loggedUserType<2)
      this.params.get('modal').dismiss();
    this.infraestructuraService.getAllDepartamentos().subscribe(ds=>{
      this.departamentos = ds.map(d=>{
        return d.nombre;
      });
    })
  }

  save(){
    let u:User={
      id: this.id,
      name: this.userForm.controls['name'].value!,
      lastname: this.userForm.controls['lastname'].value!,
      phone: this.userForm.controls['phone'].value!,
      email: this.userForm.controls['email'].value!,
      isMale: this.userForm.controls['isMale'].value!,
      incidencias:0,
      birthdate: new Date(this.userForm.controls['birthdate'].value!),
      department: this.userForm.controls['department'].value!,
      clasificacion: this.userForm.controls['clasificacion'].value!,
      type: this.userForm.controls['type'].value!,
      entryTime: this.userForm.controls['entryTime'].value!,
      departureTime: this.userForm.controls['departureTime'].value!,
      expiredTime: 0
    };
    if(this.id.length>0)
      this.userService.put(u).then(r=>{
        this.alertservice.successful('Se ha actualizado el usuario');
      });
    else
    this.userService.add(u).then(r=>{
      this.alertservice.successful('Se ha agregado el usuario');
    });
    this.params.get('modal').dismiss();
  }

}
