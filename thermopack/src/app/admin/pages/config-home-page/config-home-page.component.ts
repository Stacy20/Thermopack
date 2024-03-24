import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ConfigGalleryComponent } from "../../components/config-gallery/config-gallery.component";
import { FormsModule } from '@angular/forms';
import { MainService } from '../../../services/service';
import { Data } from '../../../interfaces/data.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { ImagesNewEvent } from '../../interfaces/images-new-event';

@Component({
    selector: 'admin-config-home-page',
    standalone: true,
    templateUrl: './config-home-page.component.html',
    styles: `
    .text-responsive {
      text-align: left;
      padding-top: 0.5rem;
    }

    @media (min-width: 770px) {
      .text-responsive {
        text-align: right;
        padding: 0
      }
    }

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
    imports: [NavbarComponent, ConfigGalleryComponent, FormsModule]
})
export class ConfigHomePageComponent {


  constructor(
    private service: MainService,
    private _sanitizer: DomSanitizer,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit() {
    this.getData();
  }

  public data!: Data;
  public eslogan: string = '';
  public description: string = '';
  public mision: string = '';
  public vision: string = '';
  public logo: string = '';
  public visionImages: string[] = ['','','',''];
  public presentationImages: string[] = ['','','',''];
  public productosTitle: string = '';
  public productosText: string = '';
  public servicesTitle: string = '';
  public servicesText: string = '';

  public dataPast!: Data;
  public esloganPast: string = '';
  public descriptionPast: string = '';
  public misionPast: string = '';
  public visionPast: string = '';
  public logoPast: string = '';
  public productosTitlePast: string = '';
  public productosTextPast: string = '';
  public servicesTitlePast: string = '';
  public servicesTextPast: string = '';

  deleteInputs() {
    this.eslogan = this.description = this.mision = this.vision = this.logo = '';
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      this.sweetAlertService.showAlert('Error', 'Debe seleccionar un archivo', 'error');
      return; // Detener el proceso si no se ha seleccionado un archivo
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.logo = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  getData(): void {
    this.service.getData().subscribe((data) => {
      this.data =data[0];
      this.dataPast =data[0];
      this.eslogan = this.data.slogan;
      this.esloganPast =this.data.slogan;
      this.description = this.data.description;
      this.descriptionPast =this.data.description;
      this.mision =this.data.mision;
      this.misionPast =this.data.mision;
      this.vision =  this.data.vision;
      this.visionPast =this.data.vision;
      this.logo  = this.data.logo;
      this.logoPast = this.data.logo;
      this.visionImages  = this.data.visionImages;
      this.presentationImages = this.data.presentationImages;
      this.productosTitle = this.productosTitlePast =this.data.productsTitle;
      this.productosText =this.productosTextPast = this.data.productsParagraph;
      this.servicesTitle =this.servicesTitlePast = this.data.servicesTitle;
      this.servicesText = this.servicesTextPast =this.data.servicesParagraph;
    });
  }

  hasChangedHome(): boolean {
    // Verificar si los campos han sido modificados con respecto a los datos cargados del servidor
    if (
      this.eslogan !== this.esloganPast ||
      this.description !== this.descriptionPast ||
      this.mision !== this.misionPast||
      this.vision !== this.vision||
      this.logo !== this.logoPast
    ) {
      return true; // Hay cambios
    } else {
      return false; // No hay cambios
    }
  }

  save() {
    if (!this.eslogan || this.eslogan.trim().length<5 || !this.description  || this.description.trim().length<5 ||
     !this.mision || this.mision.trim().length<5  || !this.vision || this.vision.trim().length<5  || !this.logo) {
      this.sweetAlertService.showAlert('Error', 'Todos los campos son obligatorios', 'error');
      return; // Detener el proceso si falta algún campo obligatorio
    }
    if (this.hasChangedHome()) {
      this.sweetAlertService.showConfirmationAlert(
        'Confirmación',
        '¿Está seguro que desea realizar cambios?',
        () => {
          // Si el usuario confirma, proceder a guardar los datos
          this.service.updateMainPage(this.eslogan, this.description, this.mision, this.vision, this.logo).subscribe(
            (data) => {
              this.sweetAlertService.showAlert('Éxito', 'Los datos se han guardado correctamente', 'success');
            },
            (error) => {
              this.sweetAlertService.showAlert('Error', 'Hubo un error al guardar los datos', 'error');
            }
          );


        }
      );
    }else{
      this.sweetAlertService.showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info');
    }


  }

  saveVisionImages() {
    console.log(this.visionImages.length)
    if(this.arraysAreEqual(this.visionImages)){
        this.sweetAlertService.showConfirmationAlert(
          'Confirmación',
          '¿Está seguro que desea realizar cambios?',
          () => {
            this.service.updateMisionImages(this.visionImages).subscribe(
              (data) => {
                this.sweetAlertService.showAlert('Éxito', 'Las imágenes se han guardado correctamente', 'success');
              },
              (error) => {
                this.sweetAlertService.showAlert('Error', 'Hubo un error al guardar las imágenes', 'error');
                console.error('Error al actualizar las imágenes:', error);
              }
            );
    })
  }

  }

  updateImages(datos: ImagesNewEvent) { //! RAQUE SE CAE
    if(datos.identifier=='1'){
      this.visionImages = datos.images;
    }
    if(datos.identifier=='2'){
      this.presentationImages=datos.images
    }
  }
  arraysAreEqual(array1: string[]): boolean {
    // Verificar si los elementos de los arrays son iguales
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] =='') {
        this.sweetAlertService.showAlert('Error', 'Todos las imagenes son obligatorias', 'error');
        return false;
      }
    }

    return true;
  }

  savePresentationImages() {
    // if(this.arraysAreEqual(this.presentationImages)){
    // this.sweetAlertService.showConfirmationAlert(
    //   'Confirmación',
    //   '¿Está seguro que desea realizar cambios?',
    //   () => {
    //     this.service.updatePresentationImages(this.presentationImages).subscribe(
    //       (data) => {
    //         this.sweetAlertService.showAlert('Éxito', 'Las imágenes se han guardado correctamente', 'success');
    //       },
    //       (error) => {
    //         this.sweetAlertService.showAlert('Error', 'Hubo un error al guardar las imágenes', 'error');
    //         console.error('Error al actualizar las imágenes:', error);
    //       }
    //     );
    //   });
    // }
    this.service.updatePresentationImages(this.presentationImages).subscribe((data) => {
      // console.log(data)
    }
    );
  }

  saveProductsServices() {
    if (!this.productosTitle || this.productosTitle.trim().length<5 || !this.productosText || this.productosText.trim().length<5
     || !this.servicesTitle || this.servicesTitle.trim().length<5 || !this.servicesText || this.servicesText.trim().length<5) {
      this.sweetAlertService.showAlert('Error', 'Todos los campos son obligatorios', 'error');
      return; // Detener el proceso si falta algún campo obligatorio
    }
    if(this.hasChangedProductsServices()){
        this.sweetAlertService.showConfirmationAlert(
          'Confirmación',
          '¿Está seguro que desea realizar cambios?',
          () => {
            // Si el usuario confirma, proceder a guardar los datos
            this.service.updateProductsServices(this.productosTitle, this.productosText, this.servicesTitle, this.servicesText).subscribe(
              (data) =>  {
                this.sweetAlertService.showAlert('Éxito', 'Los datos se han guardado correctamente', 'success');
              },
              (error) => {
                this.sweetAlertService.showAlert('Error', 'Hubo un error al guardar los datos', 'error');
              }
            );


          }
        );
      }else{
        this.sweetAlertService.showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info');
      }

  }

  hasChangedProductsServices(): boolean {
    // Verificar si los campos han sido modificados con respecto a los datos cargados del servidor
    if (
      this.productosTitle !== this.productosTitlePast ||
      this.productosText !== this.productosTextPast||
      this.servicesTitle !== this.servicesTitlePast||
      this.servicesText !== this.servicesTextPast
    ) {
      return true; // Hay cambios
    } else {
      return false; // No hay cambios
    }
  }

}
