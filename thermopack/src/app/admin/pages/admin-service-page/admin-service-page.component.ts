import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ListCardComponent } from '../../../shared/components/list-card/list-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
    selector: 'admin-admin-service-page',
    standalone: true,
    templateUrl: './admin-service-page.component.html',
    styles: ``,
    imports: [NavbarComponent, ListCardComponent, PaginationComponent]
})
export class AdminServicePageComponent {

}
