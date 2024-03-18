import { Component } from '@angular/core';
import { SelectComponent } from "../../../shared/components/select/select.component";
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { SearchComponent } from "../../../shared/components/search/search.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { RouterModule } from '@angular/router';
import { FootersComponent } from "../../components/footers/footers.component";
import { Products } from '../../../interfaces/products.interface';
import { MainService } from '../../../services/service';
@Component({
    selector: 'client-page-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    imports: [SelectComponent, ListCardComponent, SidebarComponent, SearchComponent, PaginationComponent, RouterModule, FootersComponent]
})
export class ProductsComponent {
  constructor(
    private service: MainService,

  ) {}
  ngOnInit() {
    this.loadProducts();
  }
  public title:string='Nuestros productos';
  public description:string='  Cotice con nosotros la distribución de los productos hasta sus puntos de interés. Ofecemos una amplia cobertura del mercado con varias marcas y categorías. Insertar más texto convincente para el cliente. En esta página se muestran las categorías de los productos que se ofrecen.';
  public categories: string[]=['Insecticidas', 'Repelentes','Aromatizantes'];
  public brands: string[]=['Insecticidas', 'Repelentes','Aromatizantes'];
  public types: string[]=['Insecticidas', 'Repelentes','Aromatizantes'];
  public products: Products[]=[];

  loadProducts() {
    const limit = 10;
    const offset = 0;
    const brandId  = '65e93703875568b1b101d396'; // Puedes pasar estos valores como necesites
    const categorie = '65f65dfaa75f2ad5cb62e9e1';
    const type = '65f6549ca75f2ad5cb62e931';
    const name = 'Pro';

    // limit y offset obligatorio
    this.service.filterProducts(limit, offset)
        .subscribe(products => {
          this.products = products;
          console.log(1)
          console.log(products)
        });


    this.service.filterProducts(limit, offset, brandId )
      .subscribe(products => {
        this.products = products;
        console.log(2)
        console.log(products)
      });

    this.service.filterProducts(limit, offset, undefined, categorie )
      .subscribe(products => {
        this.products = products;
        console.log(3)
        console.log(products)
      });

      this.service.filterProducts(limit, offset, undefined, undefined, type )
      .subscribe(products => {
        this.products = products;
        console.log(4)
        console.log(products)
      });

      this.service.filterProducts(limit, offset, undefined, undefined, undefined, name )
      .subscribe(products => {
        this.products = products;
        console.log(5)
        console.log(products)
      });

      this.service.filterProducts(limit, offset, undefined, undefined, undefined, 'Ra' )
      .subscribe(products => {
        this.products = products;
        console.log(5)
        console.log(products)
      });
  }

}

