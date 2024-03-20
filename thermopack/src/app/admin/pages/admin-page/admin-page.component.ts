import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './admin-page.component.html',
  styles: ``
})
export class AdminPageComponent {

}
