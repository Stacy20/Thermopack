import { Component } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
@Component({
  selector: 'client-components-carousel',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  images: any[] = [
    {
      itemImageSrc: 'https://d2o812a6k13pkp.cloudfront.net/fit-in/1080x1080/Productos/40410564_0120220801162411.jpg',
      // thumbnailImageSrc: 'assets/images/image1_thumb.jpg'
    },
    {
      itemImageSrc: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg',
      // thumbnailImageSrc: 'assets/images/image2_thumb.jpg'
    },
    {
      itemImageSrc: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg',
      // thumbnailImageSrc: 'assets/images/image2_thumb.jpg'
    },
    // ... más imágenes
  ];
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
