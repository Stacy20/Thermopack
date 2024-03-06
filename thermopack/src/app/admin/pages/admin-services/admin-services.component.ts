import { Component } from '@angular/core';
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
    selector: 'pages-admin-services',
    standalone: true,
    templateUrl: './admin-services.component.html',
    styleUrl: './admin-services.component.css',
    imports: [ListCardComponent, PaginationComponent]
})
export class AdminServicesComponent {

}
