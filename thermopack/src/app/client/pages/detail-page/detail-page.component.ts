import { Component } from '@angular/core';
import { GalleryComponent } from "../../components/gallery/gallery.component";
import { RouterModule } from '@angular/router';
import { FootersComponent } from "../../components/footers/footers.component";
@Component({
    selector: 'client-page-detail',
    standalone: true,
    templateUrl: './detail-page.component.html',
    styleUrl: './detail-page.component.css',
    imports: [GalleryComponent, RouterModule, FootersComponent]
})
export class DetailPageComponent {
  whatsappLink = `https://wa.me/${50688598630}?text=Estoy%20interesado%20en%20este%20producto`;

}
