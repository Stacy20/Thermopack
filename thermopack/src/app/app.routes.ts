import { Routes } from '@angular/router';
import { LoginPageComponent } from './admin/pages/login-page/login-page.component';
import { AddProductPageComponent } from './admin/pages/add-product-page/add-product-page.component';
import { AddServicePageComponent } from './admin/pages/add-service-page/add-service-page.component';
import { AdminProductPageComponent } from './admin/pages/admin-product-page/admin-product-page.component';
import { AdminServicePageComponent } from './admin/pages/admin-service-page/admin-service-page.component';
import { ConfigContactPageComponent } from './admin/pages/config-contact-page/config-contact-page.component';
import { ConfigHomePageComponent } from './admin/pages/config-home-page/config-home-page.component';
import { EditProductPageComponent } from './admin/pages/edit-product-page/edit-product-page.component';
import { EditServicePageComponent } from './admin/pages/edit-service-page/edit-service-page.component';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';
import { ProductsComponent } from './client/pages/products/products.component';
import { HomeComponent } from './client/pages/home/home.component';
import { ContactUsComponent } from './client/pages/contact-us/contact-us.component';
import { DetailPageComponent } from './client/pages/detail-page/detail-page.component';
import { PageServicesComponent } from './client/pages/page-services/page-services.component';
import { UsersPageComponent } from './admin/pages/users-page/users-page.component';
import { ClientComponent } from './client/pages/client/client.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path:"",
    component:ClientComponent,
    children:[
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
      }
    ]
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
      },
      {
        path: 'users',
        component: UsersPageComponent
      }
    ]
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
]
