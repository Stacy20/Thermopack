import { Component } from '@angular/core';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";

@Component({
    selector: 'client-page-services',
    standalone: true,
    templateUrl: './page-services.component.html',
    styleUrl: './page-services.component.css',
    imports: [PaginationComponent, ListCardComponent]
})
export class PageServicesComponent {

}
