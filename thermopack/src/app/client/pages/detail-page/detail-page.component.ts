import { Component, Input } from '@angular/core';
import { GalleryComponent } from "../../components/gallery/gallery.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FootersComponent } from "../../components/footers/footers.component";
import { MainService } from '../../../services/service';
import { GalleryItem, ImageItem } from 'ng-gallery';
@Component({
    selector: 'client-page-detail',
    standalone: true,
    templateUrl: './detail-page.component.html',
    styleUrl: './detail-page.component.css',
    imports: [GalleryComponent, RouterModule, FootersComponent]
})
export class DetailPageComponent {
  public type!:number;
  public title:string='Producto/Servicio';
  public description: string = '';
  public price: number = 0;
  images!: GalleryItem[];

  //todo hay que hacer que el link recoja el link de la pagina que se encuentra para poder enviarla tambien
  whatsappLink = `https://wa.me/${50688598630}?text=Estoy%20interesado%20en%20este%20producto`;


  // public description:string='con nosotros la distribución de los productos hasta sus puntos de interés.  <br> Ofecemos una amplia cobertura del mercado con varias marcas y categorías. <br> <br> Insertar más texto convincente para el cliente. \n En esta página se muestran las categorías de los productos que se ofrecen. <br> <br> Por aquí puede ir información de precios si es necesario, y la forma de adquirirlo o solicitarlo.';

  constructor(
    private service: MainService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const typeParam = params.get('type');
      if (typeParam !== null) {
        this.type = parseInt(typeParam, 10);
      }
      const id = params.get('id');
      if(this.type==1){
        this.getProduct(id)
      }
      else{
        this.getServiceByName(id)
      }
      // Luego puedes usar type e id como necesites
      // this.getData(type, id);
    });
  }


  formatDescription(description: string): string {
    return description.replace(/\n/g, '<br>');
  }
  getServiceByName(name: string | null){
    if (name == null){
      return;
    }
    this.service.getServiceByName(name).subscribe((service) => {
      this.title= service.name;
      this.description = service.description;
      this.price = service.price;
      this.images = [];
      service.images.forEach((imageString) => {
        if (imageString != ''){
          this.images.push(new ImageItem(
            { src: imageString,
            thumb: imageString},
          ));
        }
      });
    });
  }

  getProduct(title: string | null): void {
    if (title == null){
      return;
    }
    this.service.getProductByName(title).subscribe((product) => {
      this.title= product.name;
      this.description = product.description;
      this.price = product.price;
      this.images = [];
      product.images.forEach((imageString) => {
        if (imageString != ''){
          this.images.push(new ImageItem(
            { src: imageString,
            thumb: imageString},
          ));
        }
      });
    });
  }
}
