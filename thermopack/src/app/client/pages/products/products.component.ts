import { Component } from '@angular/core';
import { SelectComponent } from "../../../shared/components/select/select.component";
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { SearchComponent } from "../../../shared/components/search/search.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { RouterModule } from '@angular/router';
import { FootersComponent } from "../../components/footers/footers.component";
@Component({
    selector: 'client-page-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    imports: [SelectComponent, ListCardComponent, SidebarComponent, SearchComponent, PaginationComponent, RouterModule, FootersComponent]
})
export class ProductsComponent {

}
