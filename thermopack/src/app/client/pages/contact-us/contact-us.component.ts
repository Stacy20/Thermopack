import { Component } from '@angular/core';
import { FootersComponent } from "../../components/footers/footers.component";

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
  whatsappLink: string = `https://wa.me/${50688598630}?text=${encodeURIComponent(this.mensajeWhatsApp)}`;

}
