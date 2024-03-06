import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ConfigGalleryComponent } from "../../components/config-gallery/config-gallery.component";

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
    imports: [NavbarComponent, ConfigGalleryComponent]
})
export class ConfigContactPageComponent {

}
