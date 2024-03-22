import { Component } from '@angular/core';
import { SelectComponent } from "../../../shared/components/select/select.component";
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { SearchComponent } from "../../../shared/components/search/search.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { RouterModule } from '@angular/router';
import { FootersComponent } from "../../components/footers/footers.component";
import { Products } from '../../../interfaces/products.interface';
import { Types } from '../../../interfaces/types.interface';
import { MainService } from '../../../services/service';
import { Data } from '../../../interfaces/data.interface';
import { Brands } from '../../../interfaces/brands.interface';
import { Categories } from '../../../interfaces/categories.interface';
import { SelectTypeComponent } from "../../../shared/components/select-type/select-type.component";
@Component({
    selector: 'client-page-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    imports: [SelectComponent, ListCardComponent, SidebarComponent, SearchComponent, PaginationComponent, RouterModule, FootersComponent, SelectTypeComponent]
})
export class ProductsComponent {
limpiarFiltros() {
  this.service.cleanfilter()
}
  constructor(
    private service: MainService,

  ) {}

  public title:string='Nuestros productos';
  public description:string=' ';
  public categories: Categories[]=[];
  public brands: Brands[]=[];
  public types: Types[]=[];
  public products: Products[]=[];
  public data!: Data;
  public totalProducts:number=0;


  ngOnInit(): void {
    this.loadProducts();
    this.getData();
    this.getAllTypes();
    this.getAllBrands();
    this.getAllCategories();
    this.service.products$.subscribe(response => {
      // Actualizar los datos del componente con los datos del servicio
      this.products = response.products;
      this.totalProducts = response.totalCount;
    });

    // Llamar al método getServices() una vez al inicio
    this.service.filterProducts(this.limitProducts, this.offsetProducts);

  }
  getProducts(): void{
    this.products=this.service.products;
  }
  get offsetProducts():number{
    return this.service.offsetProducts;
  }
  get limitProducts():number{
    return this.service.limitProducts;
  }
  getData(): void {
      this.service.getData().subscribe((data) => {
      this.data = data[0];
      this.title=this.data.productsTitle;
      this.description=this.data.productsParagraph;
    });
  }
  getAllTypes(): void {
    this.service.getAllTypes().subscribe((types) => {
    this.types = types;
    // this.title=this.data.productsTitle;
    // this.description=this.data.productsParagraph;
  });
}
  getAllBrands(): void {
    this.service.getAllBrands().subscribe((brands) => {
    this.brands = brands;
    // this.title=this.data.productsTitle;
    // this.description=this.data.productsParagraph;
  });
  }
  getAllCategories(): void {
    this.service.getAllCategories().subscribe((categories) => {
    this.categories = categories;
    // this.title=this.data.productsTitle;
    // this.description=this.data.productsParagraph;
  });
  }

  loadBrands(index:number):void{
      console.log("alo buenas", this.brands[index]._id)
      this.service.filterProducts(this.limitProducts, this.offsetProducts,  this.brands[index]._id )
  }
  loadTypes(index:number):void{
    console.log("alo buenas", this.types[index]._id)
    this.service.filterProducts(this.limitProducts, this.offsetProducts, undefined, undefined, this.types[index]._id )
  }
  loadProducts() {
    const limit = 10;
    const offset = 0;
    const brandId  = '65e93703875568b1b101d396'; // Puedes pasar estos valores como necesites
    const categorie = '65f65dfaa75f2ad5cb62e9e1';
    const type = '65f6549ca75f2ad5cb62e931';
    const name = 'Pro';

    // // limit y offset obligatorio
    // this.service.filterProducts(limit, offset)
    //     .subscribe(products => {
    //       this.products = products;
    //       console.log(1)
    //       console.log(products)
    //     });


    // this.service.filterProducts(limit, offset, brandId )
    //   .subscribe(products => {
    //     this.products = products;
    //     console.log(2)
    //     console.log(products)
    //   });

    // this.service.filterProducts(limit, offset, undefined, categorie )
    //   .subscribe(products => {
    //     this.products = products;
    //     console.log(3)
    //     console.log(products)
    //   });

    //   this.service.filterProducts(limit, offset, undefined, undefined, type )
    //   .subscribe(products => {
    //     this.products = products;
    //     console.log(4)
    //     console.log(products)
    //   });

    //   this.service.filterProducts(limit, offset, undefined, undefined, undefined, name )
    //   .subscribe(products => {
    //     this.products = products;
    //     console.log(5)
    //     console.log(products)
    //   });

    //   this.service.filterProducts(limit, offset, undefined, undefined, undefined, 'Ra' )
    //   .subscribe(products => {
    //     this.products = products;
    //     console.log(5)
    //     console.log(products)
    //   });
  }

}

