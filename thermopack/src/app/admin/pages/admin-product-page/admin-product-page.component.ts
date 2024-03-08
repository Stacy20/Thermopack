import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ListCardComponent } from '../../../shared/components/list-card/list-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { SelectComponent } from '../../../shared/components/select/select.component';

@Component({
    selector: 'admin-admin-product-page',
    standalone: true,
    templateUrl: './admin-product-page.component.html',
    styles: ``,
    imports: [NavbarComponent, SelectComponent, SearchComponent, ListCardComponent, PaginationComponent]
})
export class AdminProductPageComponent {

}
