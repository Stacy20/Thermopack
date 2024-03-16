import { Component, Input } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
@Component({
  selector: 'client-components-carousel',
  standalone: true,
  imports: [GalleriaModule, GalleryModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  @Input()
  // images: any[] = [];
  images!: GalleryItem[];
  ngOnInit() {
    // Set items array
    this.images = [
      new ImageItem(
        { src: 'https://d2o812a6k13pkp.cloudfront.net/fit-in/1080x1080/Productos/40410564_0120220801162411.jpg',
        thumb: 'https://d2o812a6k13pkp.cloudfront.net/fit-in/1080x1080/Productos/40410564_0120220801162411.jpg' },
        ),
        new ImageItem(
          { src: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg',
          thumb: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg' },
          )
      // ... more items
    ];
  }
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
