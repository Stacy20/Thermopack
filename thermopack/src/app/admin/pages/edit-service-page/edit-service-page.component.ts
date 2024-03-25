import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UnderConstructionComponent } from "../../../shared/components/under-construction/under-construction.component";
import { ConfigGalleryComponent } from '../../components/config-gallery/config-gallery.component';
import { MainService } from '../../../services/service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';

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
    private router: Router,
    private sweetAlertService: SweetAlertService
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

  public descriptionPast: string = '';
  public pricePast: number = 0;
  public imagesPast: string[] = [];

  getData(title: string | null): void {
    if (title == null){
      return;
    }

    this.service.getServiceByName(title).subscribe((service) => {
      this.name = this.originalName = service.name;
      this.description = service.description;
      this.price = service.price;
      this.images = service.images;

      this.descriptionPast = service.description;
      this.pricePast = service.price;
      this.imagesPast.push(...service.images)
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
    // this.images=this.images.splice(index, 1);
    console.log(this.images)
  }

  update(){
    if (!this.name ||this.name.trim().length<3 || !this.description||this.description.trim().length<5 ) {
      this.sweetAlertService.showAlert('Error', 'Todos los campos son obligatorios', 'error');
      return; // Detener el proceso si falta algún campo obligatorio
    }
    if (this.images.length<1 ) {
      this.sweetAlertService.showAlert('Error', 'Debe seleccionar una o más imagenes', 'error');
      return; // Detener el proceso si falta algún campo obligatorio
    }
    if (this.hasChanged()) {
      this.sweetAlertService.showConfirmationAlert(
        'Confirmación',
        '¿Está seguro que desea realizar cambios?',
        () => {
          this.service.getServiceByName(this.name).subscribe((service) => {
            if (this.name !== this.originalName && Object.keys(service).length !== 0){
              this.sweetAlertService.showAlert('Error', 'Ya existe un servicio llamado' + service.name, 'error');
              return;
            }
            this.service.updateServiceByName(this.originalName, this.name, this.description, this.price, this.images)
              .subscribe((response) => {
            this.sweetAlertService.showAlert('Éxito', 'Los datos se han guardado correctamente', 'success');
          });
          });
        }
        );
      }else{
        this.sweetAlertService.showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info');
      }


  }

hasChanged(): boolean {
    // Verificar si los campos han sido modificados con respecto a los datos cargados del servidor
    if (
      this.originalName !== this.name ||
      this.description !== this.descriptionPast||
      this.price!==this.pricePast||
      this.arraysAreEqual()
    ) {
      return true; // Hay cambios
    } else {
      return false; // No hay cambios
    }
  }
  arraysAreEqual(): boolean {
    // Verificar si los elementos de los arrays son iguales
    for (let i = 0; i < this.imagesPast.length; i++) {
      if(this.imagesPast[i]!==this.images[i]){
        break;
      }
      else {
        return false;
      }
    }
    return true;
  }

  goBack(){
    this.router.navigate(['/admin/services']);
  }
  validateInput(event: KeyboardEvent) {
    const inputValue = event.key;

    // Verificar si el valor ingresado es un guión o un signo negativo
    if (inputValue === '-' || inputValue === '-') {
      event.preventDefault(); // Bloquear la entrada del usuario
    }
  }

}
