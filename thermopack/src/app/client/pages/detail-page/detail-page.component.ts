import { Component, Input } from '@angular/core';
import { GalleryComponent } from "../../components/gallery/gallery.component";
import { RouterModule } from '@angular/router';
import { FootersComponent } from "../../components/footers/footers.component";
@Component({
    selector: 'client-page-detail',
    standalone: true,
    templateUrl: './detail-page.component.html',
    styleUrl: './detail-page.component.css',
    imports: [GalleryComponent, RouterModule, FootersComponent]
})
export class DetailPageComponent {
  //todo hay que hacer que el link recoja el link de la pagina que se encuentra para poder enviarla tambien
  whatsappLink = `https://wa.me/${50688598630}?text=Estoy%20interesado%20en%20este%20producto`;

  public type!:number;
  public description:string='con nosotros la distribución de los productos hasta sus puntos de interés.  <br> Ofecemos una amplia cobertura del mercado con varias marcas y categorías. <br> <br> Insertar más texto convincente para el cliente. \n En esta página se muestran las categorías de los productos que se ofrecen. <br> <br> Por aquí puede ir información de precios si es necesario, y la forma de adquirirlo o solicitarlo.';
  public title:string='Producto/Servicio';
  public images: any[] = [
    {
      itemImageSrc: 'https://d2o812a6k13pkp.cloudfront.net/fit-in/1080x1080/Productos/40410564_0120220801162411.jpg',
      thumbnailImageSrc: 'https://d2o812a6k13pkp.cloudfront.net/fit-in/1080x1080/Productos/40410564_0120220801162411.jpg'
    },
    {
      itemImageSrc: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg',
      thumbnailImageSrc: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg'
    },
    {
      itemImageSrc: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg',
      // thumbnailImageSrc: 'assets/images/image2_thumb.jpg'
    },
    // ... más imágenes
  ];
}
