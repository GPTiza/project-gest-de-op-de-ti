import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
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
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  loading = false;

  constructor(private authService:AuthService,private userService: UserService, private router: Router,
    private alertService: AlertService
    ) { }

  ngOnInit() {
    if(this.authService.isLogged())
        this.router.navigateByUrl("incidencias");
  }

  signIn() {
    this.loading = true;
    this.authService.signInWithEmailAndPassword(this.loginForm.controls['email'].value!, this.loginForm.controls['password'].value!).then(data => {
      this.userService.get(data['user']!['uid']).subscribe(user => {
        if (user) {
          this.loading=false;
          this.authService.saveUser(user);
          // this.alertSrv.successful("Bienvenido " + user['name']);
          this.alertService.successful("Bienvenido " + user['name']);
          this.router.navigateByUrl("incidencias");
        }else{
          this.loading=false;
          // this.alertSrv.error("Ese usuario tiene problemas para iniciar sesión. Favor de contactar al administrador :c");
          this.alertService.successful("Ese usuario tiene problemas para iniciar sesión. Favor de contactar al administrador :c");
        }
      });
    }).catch((error:any) => {
      this.loading=false;
      let txt = error;
      if ((error + "").includes(' user record')) {
        txt = "No existe ese usuario"
      }
      if ((error + "").includes('password is invalid')) {
        txt = "La contraseña es incorrecta"
      }
      if ((error + "").includes('temporarily disabled')) {
        txt = "Demasiados intentos fallidos"
      }
      // this.alertSrv.error(txt);
      this.alertService.error(txt);
    })
  }

}
