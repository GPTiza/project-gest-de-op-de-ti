import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserService } from 'src/app/services/user.service';
// import { AlertService } from 'src/app/services/alert.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm = new FormGroup({
    noControl: new FormControl('', [Validators.required,Validators.pattern('[0-9]{8}')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  loading = false;

  constructor(private userService: UserService, private router: Router,
    // private alertSrv: AlertService
    ) { }

  ngOnInit() {
    if(this.userService.getActualUser())
        this.router.navigateByUrl("news");
  }

  signIn() {
    this.loading = true;
    let noControl = this.loginForm.value['noControl'];
    let pass = this.loginForm.value['password'];
    if(noControl=="19170634"){
      if(pass=="Prueba1234."){
        this.userService.setUser(1);
        this.loading=false;
        window.location.reload();
        return;
      }
    }
    alert('xd');
    this.loading=false;
    // this.userService.login(email, pass).then(data => {
    //   this.userService.getUser(data['user']['uid']).subscribe(user => {
    //     if (user) {
    //       this.loading=false;
    //       this.userService.saveUser(user);
    //       this.alertSrv.successful("Bienvenido " + user['name']);
    //       this.router.navigateByUrl("home");
    //     }else{
    //       this.loading=false;
    //       this.alertSrv.error("Ese usuario tiene problemas para iniciar sesión. Favor de contactar al administrador :c");
    //     }
    //   });
    // }).catch((error) => {
    //   this.loading=false;
    //   let txt = error;
    //   if ((error + "").includes(' user record')) {
    //     txt = "No existe ese usuario"
    //   }
    //   if ((error + "").includes('password is invalid')) {
    //     txt = "La contraseña es incorrecta"
    //   }
    //   if ((error + "").includes('temporarily disabled')) {
    //     txt = "Demasiados intentos fallidos"
    //   }
    //   this.alertSrv.error(txt);
    // })
  }

}
