import { Component, Input } from '@angular/core';
import { GalleryComponent } from "../../components/gallery/gallery.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FootersComponent } from "../../components/footers/footers.component";
import { MainService } from '../../../services/service';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { CurrencyPipePipe } from '../../../shared/pipes/currency-pipe.pipe';

@Component({
    selector: 'client-page-detail',
    standalone: true,
    templateUrl: './detail-page.component.html',
    styleUrl: './detail-page.component.css',
    imports: [GalleryComponent, RouterModule, FootersComponent, CurrencyPipePipe]
})
export class DetailPageComponent {
  public type!:number;
  public title:string='Producto/Servicio';
  public description: string = '';
  public price: number = 0;
  images!: GalleryItem[];
  mensajeWhatsApp: string = 'Estoy interesado en lo siguiente:';
  public whatsappLink: string = '';

  constructor(
    private service: MainService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getData()
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
  openWhatsApp() {
    if (this.whatsappLink) {
      window.open(this.whatsappLink, '_blank');
    }
  }
  getData(): void {
    this.service.getContactData().subscribe((contact) => {
      const currentPageUrl = window.location.href;
      this.whatsappLink = `https://wa.me/${contact[0].whatsappLink}?text=${encodeURIComponent(this.mensajeWhatsApp + '\n\n' + currentPageUrl)}`;

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
