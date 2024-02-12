import { Routes } from '@angular/router';
import { LoginPageComponent } from './admin/pages/login-page/login-page.component';

export const routes: Routes = [
  {
    path: 'admin', //*Cambiar en caso de ser necesario
    component: LoginPageComponent
  }
];
