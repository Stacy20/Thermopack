import { Component } from '@angular/core';
import { MainService } from './../../../services/service';
import { Brands } from '../../../interfaces/brands.interface';
import { Categories } from '../../../interfaces/categories.interface';
import { Users } from '../../../interfaces/users.interface';
import { Types } from '../../../interfaces/types.interface';
import { Services } from '../../../interfaces/services.interface';
import { Products } from '../../../interfaces/products.interface';
import { Privileges } from '../../../interfaces/privileges.interface';
import { Data } from '../../../interfaces/data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-login-page',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  constructor(
    private router: Router,
    private service: MainService
  ) {}

  submitUserLogin(): void {
    //?Aquí se consume la API para la verificación y acreditación del usuario.

    this.router.navigate(['/admin/config']);
  }
}
