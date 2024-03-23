import { Component } from '@angular/core';
import { MainService } from './../../../services/service';
import { Users } from '../../../interfaces/users.interface';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { YesNoPipePipe } from '../../pipes/yes-no-pipe.pipe';
import { CommonModule } from '@angular/common';

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

  submitUserLogin(): void {
    if (this.email == '') { return; }
    this.service.getUserByEmail(this.email).subscribe((user) => {
      if (Object.keys(user).length == 0){
        console.log('no se encuentra el correo registrado');// TODO alert
        return;
      }
      if (!(user.password == this.password)){
        console.log('la contrasenha no coincide');// TODO alert
        return;
      }
      this.router.navigate(['/admin/config']);
    });
  }
}
