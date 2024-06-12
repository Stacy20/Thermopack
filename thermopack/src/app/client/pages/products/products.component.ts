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
  public loading:boolean=true;
  public title:string='Nuestros productos';
  public description:string='';
  public categories: Categories[]=[];
  public brands: Brands[]=[];
  public types: Types[]=[];
  public products: Products[]=[];
  public data!: Data;
  public totalProducts:number=-1;


  ngOnInit(): void {
    this.getData();
    this.getAllTypes();
    this.getAllBrands();
    this.getAllCategories();
    this.service.products$.subscribe(response => {
      // Actualizar los datos del componente con los datos del servicio
      this.products = response.products;
      this.totalProducts = response.totalCount;
      if (this.checkDataLoaded()) {
        this.loading = false;
        // console.log ('this.loading', this.loading)
      }
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
      if (this.checkDataLoaded()) {
        this.loading = false;
      }
    });
  }
  getAllTypes(): void {
    this.service.getAllTypes().subscribe((types) => {
    this.types = types;
    if (this.checkDataLoaded()) {
      this.loading = false;
    }
  });
}
  getAllBrands(): void {
    this.service.getAllBrands().subscribe((brands) => {
    this.brands = brands;
    if (this.checkDataLoaded()) {
      this.loading = false;
    }
  });
  }
  getAllCategories(): void {
    this.service.getAllCategories().subscribe((categories) => {
    this.categories = categories;
    if (this.checkDataLoaded()) {
      this.loading = false;
    }
  });
  }

  loadBrands(index:number):void{

      this.service.filterProducts(this.limitProducts, this.offsetProducts,  this.brands[index]._id )
  }
  loadTypes(index:number):void{

    this.service.filterProducts(this.limitProducts, this.offsetProducts, undefined, undefined, this.types[index]._id )
  }
  formatDescription(description: string): string {

    return description.replace(/\n/g, '<br>');
  }

  checkDataLoaded(): boolean {
    return (
      this.title !== '' &&
      this.description !== '' &&
      this.categories.length > 0 &&
      this.brands.length > 0 &&
      this.types.length > 0 &&
      this.products.length >= 0 &&
      this.data !== undefined &&
      this.totalProducts >= 0
    );
  }

}

