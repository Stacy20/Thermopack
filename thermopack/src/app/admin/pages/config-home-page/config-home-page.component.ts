import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ConfigGalleryComponent } from "../../components/config-gallery/config-gallery.component";

@Component({
    selector: 'admin-config-home-page',
    standalone: true,
    templateUrl: './config-home-page.component.html',
    styles: ``,
    imports: [NavbarComponent, ConfigGalleryComponent]
})
export class ConfigHomePageComponent {

}
