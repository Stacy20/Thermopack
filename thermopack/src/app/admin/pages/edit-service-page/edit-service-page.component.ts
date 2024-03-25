import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UnderConstructionComponent } from "../../../shared/components/under-construction/under-construction.component";
import { ConfigGalleryComponent } from '../../components/config-gallery/config-gallery.component';
import { MainService } from '../../../services/service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-edit-service-page',
    standalone: true,
    templateUrl: './edit-service-page.component.html',
    styles: ``,
    imports: [ConfigGalleryComponent, NavbarComponent, UnderConstructionComponent, FormsModule, CommonModule]
})
export class EditServicePageComponent {

  constructor(
    private service: MainService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
    if (!(await this.service.userCanEdit())) {
      this.router.navigate(['admin/config/home']);
    }
    this.route.paramMap.subscribe(params => {
      this.getData(params.get('id'));;
    });
  }

  public originalName: string = '';
  public name: string = '';
  public description: string = '';
  public price: number = 0;
  public images: string[] = [];

  getData(title: string | null): void {
    if (title == null){
      return;
    }

    this.service.getServiceByName(title).subscribe((service) => {
      this.name = this.originalName = service.name;
      this.description = service.description;
      this.price = service.price;
      this.images = service.images;
    });
  }

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

  update(){
    this.service.getServiceByName(this.name).subscribe((service) => {
      if (this.name !== this.originalName && Object.keys(service).length !== 0){
        return;
      }
      // TODO implementar alerts
      this.service.updateServiceByName(this.originalName, this.name, this.description, this.price, this.images)
        .subscribe((response) => {
      //console.log(response)
      alert('Servicio actualizado correctamente')
    });
    });
  }

  goBack(){
    this.router.navigate(['/admin/services']);
  }
}
