import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MainService } from '../../../services/service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './admin-page.component.html',
  styles: ``
})
export class AdminPageComponent {
  constructor(
    private service: MainService,
    private router: Router
  ) {}
  ngOnInit() {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
  }
}
