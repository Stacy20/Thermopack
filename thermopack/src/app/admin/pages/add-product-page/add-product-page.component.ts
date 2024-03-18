import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UnderConstructionComponent } from "../../../shared/components/under-construction/under-construction.component";
import { ConfigGalleryComponent } from '../../components/config-gallery/config-gallery.component';
import { MainService } from '../../../services/service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'admin-add-product-page',
    standalone: true,
    templateUrl: './add-product-page.component.html',
    styles: ``,
    imports: [ConfigGalleryComponent, NavbarComponent, UnderConstructionComponent, FormsModule]
})
export class AddProductPageComponent {
  constructor(
    private service: MainService,
  ) {}

  public name:string='';
  public decription:string='';
  public price:number=0;

  save() {
    this.service.createProduct(this.name, this.decription, '65e93703875568b1b101d396', '65f6549ca75f2ad5cb62e938' , this.price, '65f65dfaa75f2ad5cb62e9e5', '65f65dfaa75f2ad5cb62e9e5', []).subscribe((data) => {
      console.log(data)
    });
  }

}
