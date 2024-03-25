import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ConfigGalleryComponent } from '../../components/config-gallery/config-gallery.component';
import { MainService } from '../../../services/service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { ImagesNewEvent } from '../../interfaces/images-new-event';

@Component({
  selector: 'admin-config-contact-page',
  standalone: true,
  templateUrl: './config-contact-page.component.html',
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
    }`,
  imports: [NavbarComponent, ConfigGalleryComponent, FormsModule, CommonModule],
})
export class ConfigContactPageComponent {

  public welcomeParagraph: string = '';
  public ubicationText: string = '';
  public ubicationGMLink: string = '';
  public ubicationWazeLink: string = '';
  public telephoneNumbers: string[] = ['', '', ''];
  public email: string = '';
  public whatsappLink: string = '';
  public facebookLink: string = '';
  public instagramLink: string = '';
  public youtubeLink: string = '';
  public images: string[] = ['', '', '', ''];
  public newNumber: string = '';
  public validNumber: boolean = true;
  public validwhatsappLink: boolean = true;
  public emailValid: boolean = true;

  public welcomeParagraphPast: string = '';
  public ubicationTextPast: string = '';
  public ubicationGMLinkPast: string = '';
  public ubicationWazeLinkPast: string = '';
  public telephoneNumbersPast: string[] = [];
  public emailPast: string = '';
  public whatsappLinkPast: string = '';
  public facebookLinkPast: string = '';
  public instagramLinkPast: string = '';
  public youtubeLinkPast: string = '';
  public imagesPast: string[] = [];
  constructor(
    public service: MainService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
    this.getData();
  }


  getData(): void {
    this.service.getContactData().subscribe((contact) => {
      this.welcomeParagraph = contact[0].welcomeParagraph;
      this.ubicationText = contact[0].ubicationText;
      this.ubicationGMLink = contact[0].ubicationGMLink;
      this.ubicationWazeLink = contact[0].ubicationWazeLink;
      this.telephoneNumbers = contact[0].telephoneNumbers;
      this.email = contact[0].email;
      this.whatsappLink = contact[0].whatsappLink;
      this.facebookLink = contact[0].facebookLink;
      this.instagramLink = contact[0].instagramLink;
      this.youtubeLink = contact[0].youtubeLink;
      this.images=contact[0].images;

      this.welcomeParagraphPast = contact[0].welcomeParagraph;
      this.ubicationTextPast = contact[0].ubicationText;
      this.ubicationGMLinkPast = contact[0].ubicationGMLink;
      this.ubicationWazeLinkPast = contact[0].ubicationWazeLink;
      this.telephoneNumbersPast.push(...contact[0].telephoneNumbers);
      this.imagesPast=[...contact[0].images]
      this.emailPast = contact[0].email;
      this.whatsappLinkPast = contact[0].whatsappLink;
      this.facebookLinkPast = contact[0].facebookLink;
      this.instagramLinkPast = contact[0].instagramLink;
      this.youtubeLinkPast = contact[0].youtubeLink;
    });
  }
  validatePhoneNumber(phoneNumber: string): boolean {
    // Check if the number has a length of 11 characters
    if (phoneNumber.length !== 11) {
      return false;
    }

    // Check if the number starts with the first 3 numbers of the country code 506 (Costa Rica)
    const countryCode = '506';
    if (!phoneNumber.startsWith(countryCode)) {
      return false;
    }

    // Check if all remaining characters are digits
    const remainingDigits = phoneNumber.substring(countryCode.length);
    if (!/^\d+$/.test(remainingDigits)) {
      return false;
    }

    // If it passes all the above validations, the number is valid
    return true;
  }

  validateNumber() {
    this.validNumber = this.validatePhoneNumber(this.newNumber);
  }

  deleteNumber(index: number):void {
    this.telephoneNumbers.splice(index, 1);
    console.log(this.telephoneNumbers,this.telephoneNumbersPast)
    }

  validateWhatsApp() {
    this.validwhatsappLink = this.validatePhoneNumber(this.whatsappLink);
  }
  addNumber() {
    this.validNumber = this.validatePhoneNumber(this.newNumber);
    if (this.validNumber) {
      this.telephoneNumbers[2] = this.telephoneNumbers[1];
      this.telephoneNumbers[1] = this.telephoneNumbers[0];
      this.telephoneNumbers[0] = this.newNumber;
      this.newNumber = '';
    }
  }
  validateEmail() {
    // Regular expression to validate the format of an email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailValid = emailRegex.test(this.email);
    console.log(this.emailValid);
  }
  hasChangedHome(): boolean {
    // Verificar si los campos han sido modificados con respecto a los datos cargados del servidor
    if (
      this.welcomeParagraph !== this.welcomeParagraphPast ||
      this.ubicationText !== this.ubicationTextPast ||
      this.ubicationGMLink !== this.ubicationGMLinkPast ||
      this.ubicationWazeLink !== this.ubicationWazeLinkPast ||
      this.telephoneNumbers !== this.telephoneNumbersPast ||
      this.email !== this.emailPast ||
      this.whatsappLink !== this.whatsappLinkPast ||
      this.facebookLink !== this.facebookLinkPast ||
      this.instagramLink !== this.instagramLinkPast ||
      this.youtubeLink !== this.youtubeLinkPast
    ) {
      return true; // Hay cambios
    } else {
      return false; // No hay cambios
    }
  }

  save() {
    if (!this.welcomeParagraph ||this.welcomeParagraph.trim().length<5 || !this.ubicationText ||this.ubicationText.trim().length<5
      || !this.ubicationGMLink ||this.ubicationGMLink.trim().length<5 || !this.telephoneNumbers
      || !this.email || this.email.trim().length<5  || !this.whatsappLink || this.whatsappLink.trim().length<11
      || !this.facebookLink ||this.facebookLink.trim().length<5
      || !this.instagramLink ||this.instagramLink.trim().length<5
      || !this.youtubeLink ||this.youtubeLink.trim().length<5) {
      this.sweetAlertService.showAlert('Error', 'Todos los campos son obligatorios', 'error');
      return; // Detener el proceso si falta algún campo obligatorio
    }
    if (this.hasChangedHome()) {
      this.sweetAlertService.showConfirmationAlert(
        'Confirmación',
        '¿Está seguro que desea realizar cambios?',
        () => {
          this.service
            .updateContactData(
              this.welcomeParagraph,
              this.ubicationText,
              this.ubicationGMLink,
              this.ubicationWazeLink,
              this.telephoneNumbers,
              this.email,
              this.whatsappLink,
              this.facebookLink,
              this.instagramLink,
              this.youtubeLink
            )
            .subscribe(
              (data) => {
                this.sweetAlertService.showAlert(
                  'Éxito',
                  'Los datos se han guardado correctamente',
                  'success'
                );
              },
              (error) => {
                this.sweetAlertService.showAlert(
                  'Error',
                  'Hubo un error al guardar los datos',
                  'error'
                );
              }
            );
        }
      );
    } else {
      this.sweetAlertService.showAlert(
        'Información',
        'No se realizó ningún cambio, no hay nada que guardar',
        'info'
      );
    }
  }
  saveImages() {
    if(this.arraysAreEqual()){
      this.service.updateContactImages(this.images).subscribe((data) => {
        this.sweetAlertService.showAlert('Éxito','Los datos se han guardado correctamente','success');
      },
      (error) => {
        this.sweetAlertService.showAlert(
          'Error',
          'Hubo un error al guardar las imagenes',
          'error'
        );
      });
    }

  }


  arraysAreEqual(): boolean {
    // Verificar si los elementos de los arrays son iguales
    let flag=0;
    for (let i = 0; i < this.imagesPast.length; i++) {
      if(this.imagesPast[i]!=this.images[i]){
        flag=1;
      }
    }
   if(flag==0){
        this.sweetAlertService.showAlert('Información','No se realizó ningún cambio, no hay nada que guardar','info');
        return false;
    }
    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i] =='') {
        this.sweetAlertService.showAlert('Error', 'Todos las imagenes son obligatorias', 'error');
        return false;
      }
    }
    return true;
  }

  updateImages(datos: ImagesNewEvent) {
    console.log(this.images,this.imagesPast)
      this.images = datos.images;
  }
}
