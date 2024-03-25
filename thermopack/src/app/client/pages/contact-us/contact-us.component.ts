import { Component } from '@angular/core';
import { FootersComponent } from "../../components/footers/footers.component";
import { MainService } from '../../../services/service';

@Component({
    selector: 'client-page-contact-us',
    standalone: true,
    templateUrl: './contact-us.component.html',
    styleUrl: './contact-us.component.css',
    imports: [FootersComponent]
})
export class ContactUsComponent {
  public srcLogo:string='assets/LogoThermoPack.jpg';
  public description:string='Envíenos sus consultas a través de cualquiera de nuestros medios de comuniación y le atenderemos con todo gusto a la mayor brevedad posible.';
 // Variable para el mensaje de WhatsApp
  mensajeWhatsApp: string = '¿Cómo puedo adquirir productos o servicios de ustedes?';

  // Construcción del enlace de WhatsApp utilizando la variable para el mensaje
  //  whatsappLink: string = `https://wa.me/${50688598630}?text=${encodeURIComponent(this.mensajeWhatsApp)}
  constructor(
    private service: MainService,
  ) {}

  ngOnInit() {
    this.getData();
  }

  public welcomeParagraph: string = '';
  public ubicationText: string = '';
  public ubicacionMaps: string = '';
  public ubicacionWaze: string = '';
  public telephoneNumbers: string[] = ['','',''];
  public email: string = '';
  public whatsappLink: string = '';
  public facebookLink: string = '';
  public instagramLink: string = '';
  public youtubeLink: string = '';
  public images: string[] = ['','','',''];
  public newNumber: string = '';


  getData(): void {
    this.service.getContactData().subscribe((contact) => {
      this.welcomeParagraph = contact[0].welcomeParagraph;
      this.ubicationText = contact[0].ubicationText;
      this.ubicacionMaps = contact[0].ubicationGMLink;
      this.ubicacionWaze = contact[0].ubicationWazeLink;
      this.telephoneNumbers  = contact[0].telephoneNumbers;
      console.log(this.telephoneNumbers, 'hola')
      this.email = contact[0].email;
      this.whatsappLink =`https://wa.me/${ contact[0].whatsappLink}?text=${encodeURIComponent(this.mensajeWhatsApp)}`;
      console.log(this.whatsappLink, 'hola')
      this.facebookLink = contact[0].facebookLink;
      this.instagramLink = contact[0].instagramLink;
      this.youtubeLink = contact[0].youtubeLink;
      console.log(this.youtubeLink, 'hola')
      this.images = contact[0].images;
      console.log(this.images)
    });
  }
  formatDescription(description: string): string {
    console.log(description)
    return description.replace(/\n/g, '<br>');
  }
}
