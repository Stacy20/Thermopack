import { Component, Input } from '@angular/core';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
@Component({
  selector: 'client-components-carousel',
  standalone: true,
  imports: [GalleryModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  @Input() images!: GalleryItem[];

  responsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

}
