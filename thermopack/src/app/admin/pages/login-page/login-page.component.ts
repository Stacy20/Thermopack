import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-login-page',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {

  constructor(private router: Router) {}

  submitUserLogin(): void {
    //?Aquí se consume la API para la verificación y acreditación del usuario.

    this.router.navigate(['/admin/config']);
  }
}
