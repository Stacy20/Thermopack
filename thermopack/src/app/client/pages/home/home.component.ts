import { Component } from '@angular/core';
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { FootersComponent } from "../../components/footers/footers.component";

@Component({
    selector: 'client-page-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CarouselComponent, FootersComponent]
})
export class HomeComponent {

}
