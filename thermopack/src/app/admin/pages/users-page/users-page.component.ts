import { Component } from '@angular/core';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { UserTableComponent } from "../../components/user-table/user-table.component";
import { MainService } from '../../../services/service';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-create-user-page',
    standalone: true,
    templateUrl: './users-page.component.html',
    imports: [PaginationComponent, NavbarComponent, FormsModule, UserTableComponent]
})
export class UsersPageComponent {
  constructor(
    private service: MainService,
    private router: Router
  ) {}
  async ngOnInit() {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
    if (!(await this.service.userCanCreateUsers())) {
      this.router.navigate(['admin/config/home']);
    }
  }
}
