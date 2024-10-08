import { Component } from '@angular/core';
import { SelectComponent } from "../../../shared/components/select/select.component";
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
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

  public title: string = 'Nuestros productos';
  public description: string = '';
  public categories: Categories[] = [];
  public brands: Brands[] = [];
  public types: Types[] = [];
  public products: Products[] = [];
  public data!: Data;
  public totalProducts: number = -1;

  async ngOnInit(): Promise<void> {
    this.getData();
    this.getAllTypes();
    this.getAllBrands();
    this.getAllCategories();
    this.service.products$.subscribe(async response => {
      this.products = response.products;
      this.totalProducts = response.totalCount;
    });
    this.service.filterProducts(this.limitProducts, this.offsetProducts);
  }

  getProducts(): void {
    this.products = this.service.products;
  }

  get offsetProducts(): number {
    return this.service.offsetProducts;
  }

  get limitProducts(): number {
    return this.service.limitProducts;
  }

  async getData(): Promise<void> {
    this.service.getData().subscribe(async (data) => {
      this.data = data[0];
      this.title = this.data.productsTitle;
      this.description = this.data.productsParagraph;
    });
  }

  async getAllTypes(): Promise<void> {
    this.service.getAllTypes().subscribe(async (types) => {
      this.types = types;
    });
  }

  async getAllBrands(): Promise<void> {
    this.service.getAllBrands().subscribe(async (brands) => {
      this.brands = brands;
    });
  }

  async getAllCategories(): Promise<void> {
    this.service.getAllCategories().subscribe(async (categories) => {
      this.categories = categories;
    });
  }

  loadBrands(index: number): void {
    this.service.filterProducts(this.limitProducts, this.offsetProducts, this.brands[index]._id);
  }

  loadTypes(index: number): void {
    this.service.filterProducts(this.limitProducts, this.offsetProducts, undefined, undefined, this.types[index]._id);
  }

  formatDescription(description: string): string {
    return description.replace(/\n/g, '<br>');
  }

}
