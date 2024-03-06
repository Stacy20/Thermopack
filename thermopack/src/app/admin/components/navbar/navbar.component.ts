import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'admin-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  hasPrivileges : boolean = true; //TODO Este atributo indica si el usuario actual puede crear usuarios y dar permisos
  //No debería ser un Input, porque cualquiera llega y le pone true en el navegador, así que de seguro viene de un servicio
}
