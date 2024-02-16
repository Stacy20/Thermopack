import { Routes } from '@angular/router';
import { LoginPageComponent } from './admin/pages/login-page/login-page.component';
import { HomePageComponent } from './client/pages/home/home-page.component';
import { AddProductPageComponent } from './admin/pages/add-product-page/add-product-page.component';
import { AddServicePageComponent } from './admin/pages/add-service-page/add-service-page.component';
import { AdminProductPageComponent } from './admin/pages/admin-product-page/admin-product-page.component';
import { AdminServicePageComponent } from './admin/pages/admin-service-page/admin-service-page.component';
import { ConfigContactPageComponent } from './admin/pages/config-contact-page/config-contact-page.component';
import { ConfigHomePageComponent } from './admin/pages/config-home-page/config-home-page.component';
import { EditProductPageComponent } from './admin/pages/edit-product-page/edit-product-page.component';
import { EditServicePageComponent } from './admin/pages/edit-service-page/edit-service-page.component';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      {
        path: 'config',
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: ConfigHomePageComponent },
          { path: 'contact', component: ConfigContactPageComponent }
        ]
      },
      {
        path: 'products',
        children: [
          { path: '', component: AdminProductPageComponent },
          { path: 'add', component: AddProductPageComponent },
          { path: 'edit/:id', component: EditProductPageComponent }
        ]
      },
      {
        path: 'services',
        children: [
          { path: '', component: AdminServicePageComponent },
          { path: 'add', component: AddServicePageComponent },
          { path: 'edit/:id', component: EditServicePageComponent }
        ]
      }
    ]
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }

];
