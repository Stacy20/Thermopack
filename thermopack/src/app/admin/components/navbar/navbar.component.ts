import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MainService } from '../../../services/service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'admin-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    public service: MainService,
    private router: Router,
  ) {}

  logout() {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}
