import { Routes } from '@angular/router';
import { LoginPageComponent } from './admin/pages/login-page/login-page.component';
import { ProductsComponent } from './client/pages/products/products.component';
import { HomeComponent } from './client/pages/home/home.component';

export const routes: Routes = [
  {
    path: 'admin', //*Cambiar en caso de ser necesario
    component: LoginPageComponent
  },
  {
    path: 'productos', //*Cambiar en caso de ser necesario
    component: ProductsComponent
  },
  {
    path: 'home', //*Cambiar en caso de ser necesario
    component: HomeComponent
  },{
    path:'**',
    redirectTo:'productos'
  }
];
