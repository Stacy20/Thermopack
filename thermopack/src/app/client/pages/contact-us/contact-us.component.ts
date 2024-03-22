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
  constructor(
    private service: MainService,
  ) {}

  ngOnInit() {
    this.getData();
  }
  public welcomeParagraph: string = '';
  public ubicationText: string = '';
  public ubicationLink: string = '';
  public telephoneNumbers: string[] = ['','',''];
  public email: string = '';
  // public whatsappLink: string = '';
  public facebookLink: string = '';
  public instagramLink: string = '';
  public youtubeLink: string = '';
  public images: string[] = ['','','',''];
  public newNumber: string = '';

  public srcLogo:string='';
  public description:string='Envíenos sus consultas a través de cualquiera de nuestros medios de comuniación y le atenderemos con todo gusto a la mayor brevedad posible.';
 // Variable para el mensaje de WhatsApp
  mensajeWhatsApp: string = '¿Cómo puedo adquirir productos o servicios de ustedes?';

  // Construcción del enlace de WhatsApp utilizando la variable para el mensaje
  whatsappLink: string = `https://wa.me/${50688598630}?text=${encodeURIComponent(this.mensajeWhatsApp)}`;

  getData(): void {
    this.service.getContactData().subscribe((contact) => {
      this.welcomeParagraph = contact[0].welcomeParagraph;
      this.ubicationText = contact[0].ubicationText;
      this.ubicationLink = contact[0].ubicationLink;
      this.telephoneNumbers  = contact[0].telephoneNumbers;
      this.email = contact[0].email;
      // this.whatsappLink = contact[0].whatsappLink;
      this.facebookLink = contact[0].facebookLink;
      this.instagramLink = contact[0].instagramLink;
      this.youtubeLink = contact[0].youtubeLink;
      this.images = contact[0].images;
    });
    this.service.getData().subscribe((data) => {
      this.srcLogo = data[0].logo;
    });
  }
}
