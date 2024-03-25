import { Component } from '@angular/core';
import { MainService } from './../../../services/service';
import { Users } from '../../../interfaces/users.interface';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { YesNoPipePipe } from '../../pipes/yes-no-pipe.pipe';
import { CommonModule } from '@angular/common';
import * as bcrypt from 'bcryptjs';
import { SweetAlertService } from '../../services/sweet-alert.service';

@Component({
  selector: 'admin-login-page',
  standalone: true,
  imports: [FormsModule, YesNoPipePipe, CommonModule],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  constructor(
    private router: Router,
    private service: MainService,
    private sweetAlertService: SweetAlertService
  ) {}

  public email: string = '';
  public password: string = '';
  public passwordFieldType: string = 'password';
  public passwordIcon: string = "assets/icons/visibility.svg";

  submitUserLogin(): void {
    if (this.email == '') { return; }
    this.service.getUserByEmail(this.email).subscribe((user) => {
      if (Object.keys(user).length == 0){
        this.sweetAlertService.showAlert('Error', 'El correo no se encuentra registrado', 'error');
        return;
      }
      bcrypt.compare(this.password, user.password, (err, result) => {
        if (err) {
          this.sweetAlertService.showAlert('Error', 'Error al comparar contraseñas:'+ err, 'error');
          return;
        }
        if (!result) {
          this.sweetAlertService.showAlert('Error', 'Contraseña equivocada', 'error');
          return;
        }
        this.service.login(user);
        this.router.navigate(['/admin/config']);
      });
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === "assets/icons/visibility.svg" ? "assets/icons/visibility_off.svg" : "assets/icons/visibility.svg";
  }

  forgotPassword() {
    if (this.email == '') {
      this.sweetAlertService.showAlert('Error', 'Debe ingresar un correo', 'error');
      return;
    }
    this.service.getUserByEmail(this.email).subscribe((user) => {
      if (Object.keys(user).length == 0){
        this.sweetAlertService.showAlert('Error', 'El correo ingresado no se encuentra ingresado', 'error');
        return;
      }
      this.service.forgotPassword(this.email, user.privileges);
      this.sweetAlertService.showAlert('Información', 'Se le ha enviado a su correo la nueva contraseña', 'info');
    });
  }

}
