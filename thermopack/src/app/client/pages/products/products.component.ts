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
@Component({
    selector: 'client-page-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    imports: [SelectComponent, ListCardComponent, SidebarComponent, SearchComponent, PaginationComponent, RouterModule, FootersComponent]
})
export class ProductsComponent {
  public title:string='Nuestros productos';
  public description:string=' ';
  public categories: string[]=['Insecticidas', 'Repelentes','Aromatizantes'];
  public brands: Brands[]=[];
  public types: Types[]=[];
  public products: Products[]=[];
  public data!: Data;
  public totalProducts:number=0;
  constructor(
    private service:MainService,
  ){}

  ngOnInit(): void {
    this.getData();
    this.getAllTypes();
    this.getAllBrands();
    this.service.products$.subscribe(response => {
      // Actualizar los datos del componente con los datos del servicio
      this.products = response.products;
      this.totalProducts = response.totalCount;
    });

    // Llamar al método getServices() una vez al inicio
    this.service.getProducts();

  }
  getProducts(): void{
    this.products=this.service.products;
    console.log(this.products)
  }

  getData(): void {
      this.service.getData().subscribe((data) => {
      this.data = data[0];
      console.log('this.data' , this.data )
      this.title=this.data.productsTitle;
      this.description=this.data.productsParagraph;
    });
  }
  getAllTypes(): void {
    this.service.getAllTypes().subscribe((types) => {
    this.types = types;
    console.log('this.types' , this.types )
    // this.title=this.data.productsTitle;
    // this.description=this.data.productsParagraph;
  });
}

  getAllBrands(): void {
    this.service.getAllBrands().subscribe((brands) => {
    this.brands = brands;
    console.log('this.brands' , this.brands )
    // this.title=this.data.productsTitle;
    // this.description=this.data.productsParagraph;
  });
  }



  crearProducts(): void {
    // name: string, description: string,
    //               brandId: string, typeId: string , price: number, categoryId: string,
    //               subcategoryId: string , images: string[]
    const name = "Product 9";
    const description = "Descripción del servicio";
    const brandId='65e93703875568b1b101d396'
    const typeId='65f65506a75f2ad5cb62e944'
    const price = 99.99;
    const categoryId='65f65dfaa75f2ad5cb62e9e5'
    const subcategoryId='';
    const serviceImages = ["imagen1.jpg", "imagen2.jpg"];
    this.service.createProduct(name,description,brandId,typeId,price,categoryId,subcategoryId,serviceImages)
      .subscribe(
        (result) => {
          console.log("Servicio creado exitosamente:", result);
          // Aquí puedes manejar cualquier lógica adicional después de crear el servicio
        },
        (error) => {
          console.error("Error al crear el servicio:", error);
          // Aquí puedes manejar cualquier error que ocurra durante la creación del servicio
        }
      );
  }

  crearCategory(): void {
    const serviceName = "Categoria 1";
    this.service.createCategory(serviceName)
      .subscribe(
        (result) => {
          console.log("Servicio creado exitosamente:", result);
          // Aquí puedes manejar cualquier lógica adicional después de crear el servicio
        },
        (error) => {
          console.error("Error al crear el servicio:", error);
          // Aquí puedes manejar cualquier error que ocurra durante la creación del servicio
        }
      );
  }
// crearType(): void {
//   const serviceName = "Tipo 1";
//   this.service.createType(serviceName)
//     .subscribe(
//       (result) => {
//         console.log("Servicio creado exitosamente:", result);
//         // Aquí puedes manejar cualquier lógica adicional después de crear el servicio
//       },
//       (error) => {
//         console.error("Error al crear el servicio:", error);
//         // Aquí puedes manejar cualquier error que ocurra durante la creación del servicio
//       }
//     );
// }
// crearBrands(): void {
//   const serviceName = "Marca 2";
//   this.service.createBrand(serviceName)
//     .subscribe(
//       (result) => {
//         console.log("Servicio creado exitosamente:", result);
//         // Aquí puedes manejar cualquier lógica adicional después de crear el servicio
//       },
//       (error) => {
//         console.error("Error al crear el servicio:", error);
//         // Aquí puedes manejar cualquier error que ocurra durante la creación del servicio
//       }
//     );
// }
}
