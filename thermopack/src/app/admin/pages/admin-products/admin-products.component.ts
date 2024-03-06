import { Component } from '@angular/core';
import { SelectComponent } from "../../../shared/components/select/select.component";
import { SearchComponent } from "../../../shared/components/search/search.component";
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
    selector: 'admin-admin-products',
    standalone: true,
    templateUrl: './admin-products.component.html',
    styleUrl: './admin-products.component.css',
    imports: [SelectComponent, SearchComponent, ListCardComponent, PaginationComponent]
})
export class AdminProductsComponent {

}
