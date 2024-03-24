import { Component } from '@angular/core';
import { MainService } from './../../../services/service';
import { Users } from '../../../interfaces/users.interface';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { YesNoPipePipe } from '../../pipes/yes-no-pipe.pipe';
import { CommonModule } from '@angular/common';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'admin-login-page',
  standalone: true,
  imports: [FormsModule, YesNoPipePipe, CommonModule],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  constructor(
    private router: Router,
    private service: MainService
  ) {}

  public email: string = '';
  public password: string = '';
  public passwordFieldType: string = 'password';
  public passwordIcon: string = "assets/icons/visibility.svg";

  submitUserLogin(): void {
    if (this.email == '') { return; }
    this.service.getUserByEmail(this.email).subscribe((user) => {
      if (Object.keys(user).length == 0){
        console.log('no se encuentra el correo registrado');// TODO alert
        return;
      }
      bcrypt.compare(this.password, user.password, (err, result) => {
        if (err) {
          console.error('Error al comparar contraseñas:', err);// TODO alert
          return;
        }
        if (!result) {
          console.log('La contraseña no coincide');// TODO alert
          return;
        }
        console.log('log in');
        this.service.login(user);
        this.router.navigate(['/admin/config']);
      });
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === "assets/icons/visibility.svg" ? "assets/icons/visibility_off.svg" : "assets/icons/visibility.svg";
  }

}
