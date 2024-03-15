import { Component, Input } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
@Component({
  selector: 'client-components-carousel',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  @Input()
  images: any[] = [];
  
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
