import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UnderConstructionComponent } from "../../../shared/components/under-construction/under-construction.component";
import { ConfigGalleryComponent } from '../../components/config-gallery/config-gallery.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainService } from '../../../services/service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';

@Component({
    selector: 'admin-add-service-page',
    standalone: true,
    templateUrl: './add-service-page.component.html',
    styles: `
    .input-group input[type='file'] {
      display: none;
    }

    .input-group label {
      background-color: #00b2cc;
      color: #fff;
      transition: background-color 0.2s ease-in-out;
      border: 1px solid #ccc;
      display: inline-block;
      padding: 6px 12px;
      cursor: pointer;
    }

    .input-group label:hover {
      background-color: #0196ad;
    }
    `,
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
    private router: Router,
    private sweetAlertService: SweetAlertService
  ) {}

  async ngOnInit() {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
    if (!(await this.service.userCanAdd())) {
      this.router.navigate(['admin/config/home']);
    }
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
    // this.images.splice(index, 1);
  }

  insert(){
    if (!this.name ||this.name.trim().length<3 || !this.description||this.description.trim().length<5 ) {
      this.sweetAlertService.showAlert('Error', 'Todos los campos son obligatorios', 'error');
      return; // Detener el proceso si falta algún campo obligatorio
    }
    if (this.images.length<1 ) {
      this.sweetAlertService.showAlert('Error', 'Debe seleccionar una o más imagenes', 'error');
      return; // Detener el proceso si falta algún campo obligatorio
    }
    else{
      this.service.getServiceByName(this.name).subscribe((service) => {
        if (this.name !== service.name && Object.keys(service).length !== 0){
          this.sweetAlertService.showAlert('Error', 'Ya existe un servicio llamado' + service.name, 'error');
          return;
        }
          this.service.createService(this.name, this.description, this.price, this.images)
            .subscribe((response) => {
          //console.log(response)
          this.sweetAlertService.showAlert('Éxito', 'Los datos se han guardado correctamente', 'success');
        });
      });
    }

  }

  clear(){
    this.name = ''
    this.description = '';
    this.price = 0;
    this.images = [];
  }
  validateInput(event: KeyboardEvent) {
    const inputValue = event.key;

    // Verificar si el valor ingresado es un guión o un signo negativo
    if (inputValue === '-' || inputValue === '-') {
      event.preventDefault(); // Bloquear la entrada del usuario
    }
  }
}
