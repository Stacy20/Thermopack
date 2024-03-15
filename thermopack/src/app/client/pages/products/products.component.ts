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
  public title:string='Nuestros productos';
  public description:string='  Cotice con nosotros la distribución de los productos hasta sus puntos de interés. Ofecemos una amplia cobertura del mercado con varias marcas y categorías. Insertar más texto convincente para el cliente. En esta página se muestran las categorías de los productos que se ofrecen.';
  public categories: string[]=['Insecticidas', 'Repelentes','Aromatizantes'];
  public brands: string[]=['Insecticidas', 'Repelentes','Aromatizantes'];
  public types: string[]=['Insecticidas', 'Repelentes','Aromatizantes'];
  public products: string[]=['Insecticidas', 'Repelentes','Aromatizantes'];
}
