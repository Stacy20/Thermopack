import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ConfigGalleryComponent } from "../../components/config-gallery/config-gallery.component";

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
    imports: [NavbarComponent, ConfigGalleryComponent]
})
export class ConfigHomePageComponent {

}
