import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ListCardComponent } from '../../../shared/components/list-card/list-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { Products } from '../../../interfaces/products.interface';
import { Types } from '../../../interfaces/types.interface';
import { MainService } from '../../../services/service';
import { Data } from '../../../interfaces/data.interface';
import { Brands } from '../../../interfaces/brands.interface';
import { Categories } from '../../../interfaces/categories.interface';
import { SelectTypeComponent } from "../../../shared/components/select-type/select-type.component";
import { Router } from '@angular/router';

@Component({
    selector: 'admin-admin-product-page',
    standalone: true,
    templateUrl: './admin-product-page.component.html',
    styleUrl: './admin-product-page.component.css',
    imports: [NavbarComponent, SelectComponent, SearchComponent, ListCardComponent, PaginationComponent, SelectTypeComponent]
})
export class AdminProductPageComponent {

    constructor(
      public  service: MainService,
      private router: Router
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
      if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
      this.getData();
      this.getAllTypes();
      this.getAllBrands();
      this.getAllCategories();
      this.service.products$.subscribe(response => {
        // Actualizar los datos del componente con los datos del servicio
        this.products = response.products;
        this.totalProducts = response.totalCount;
      });
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
    });
  }
    getAllBrands(): void {
      this.service.getAllBrands().subscribe((brands) => {
      this.brands = brands;
    });
    }
    getAllCategories(): void {
      this.service.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
    }

    loadBrands(index:number):void{
        this.service.filterProducts(this.limitProducts, this.offsetProducts,  this.brands[index]._id )
    }
    loadTypes(index:number):void{
      this.service.filterProducts(this.limitProducts, this.offsetProducts, undefined, undefined, this.types[index]._id )
    }

    limpiarFiltros() {
      this.service.cleanfilter()
    }
    addProductosPage() {
      this.router.navigate(['/admin/products/add']);
    }

}
