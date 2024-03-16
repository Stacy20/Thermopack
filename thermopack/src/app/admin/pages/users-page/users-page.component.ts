import { Component } from '@angular/core';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { UserTableComponent } from "../../components/user-table/user-table.component";

@Component({
    selector: 'admin-create-user-page',
    standalone: true,
    templateUrl: './users-page.component.html',
    imports: [PaginationComponent, NavbarComponent, FormsModule, UserTableComponent]
})
export class UsersPageComponent {

}
