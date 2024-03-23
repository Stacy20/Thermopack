import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UnderConstructionComponent } from "../../../shared/components/under-construction/under-construction.component";
import { ConfigGalleryComponent } from '../../components/config-gallery/config-gallery.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainService } from '../../../services/service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'admin-add-service-page',
    standalone: true,
    templateUrl: './add-service-page.component.html',
    styles: ``,
    imports: [ConfigGalleryComponent, NavbarComponent, UnderConstructionComponent, FormsModule, CommonModule]
})
export class AddServicePageComponent {

  public name: string = '';
  public description: string = '';
  public price: number = 0;
  public images: string[] = [];

  constructor(
    private service: MainService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  handleFileInput(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage(index: number) {
    this.images[index] = '';
  }

  insert(){
    this.service.getServiceByName(this.name).subscribe((service) => {
      if (this.name !== service.name && Object.keys(service).length !== 0){
        alert(`Ya existe un servicio llamado ${service.name}`)
        return;
      }
      // TODO implementar alerts
        this.service.createService(this.name, this.description, this.price, this.images)
          .subscribe((response) => {
        //console.log(response)
        alert('Servicio agregado correctamente')
      });
    });
  }

  clear(){
    this.name = ''
    this.description = '';
    this.price = 0;
    this.images = [];
  }
}
