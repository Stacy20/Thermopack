import { Component } from '@angular/core';
import { SelectComponent } from "../../../shared/components/select/select.component";
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";

@Component({
    selector: 'page-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    imports: [SelectComponent, ListCardComponent, SidebarComponent]
})
export class ProductsComponent {
  search(query: string) {
    // Aquí puedes realizar la lógica de búsqueda con el valor de la consulta "query"
    console.log("Búsqueda:", query);
  }
}
