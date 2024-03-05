import { Routes } from '@angular/router';
import { LoginPageComponent } from './admin/pages/login-page/login-page.component';
import { ProductsComponent } from './client/pages/products/products.component';
import { HomeComponent } from './client/pages/home/home.component';
import { ContactUsComponent } from './client/pages/contact-us/contact-us.component';
import { PageServicesComponent } from './client/pages/page-services/page-services.component';
import { DetailPageComponent } from './client/pages/detail-page/detail-page.component';
import { AdminProductsComponent } from './admin/pages/admin-products/admin-products.component';
import { AdminServicesComponent } from './admin/pages/admin-services/admin-services.component';

export const routes: Routes = [
  {
    path: 'admin', //*Cambiar en caso de ser necesario
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'adminProducts', component: AdminProductsComponent },
      { path: 'adminServices', component: AdminServicesComponent },
      { path: '**', redirectTo: 'login' },
    ]
  },
  {
    path: 'productos',
    component: ProductsComponent
  },
  {
    path: 'inicio',
    component: HomeComponent
  },
  {
    path: 'contactenos',
    component: ContactUsComponent
  },
  {
    path: 'servicios',
    component: PageServicesComponent
  },
  {
    path: 'detalles',
    component: DetailPageComponent
  },{
    path:'**',
    redirectTo:'inicio'
  }
];
