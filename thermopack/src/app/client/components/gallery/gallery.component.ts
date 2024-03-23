import { Component, Input } from '@angular/core';

import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
@Component({
  selector: 'client-components-gallery',
  standalone: true,
  imports: [GalleryModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  // @Input()
  // images: any[] = [];
  @Input() images!: GalleryItem[];
//   responsiveOptions: any[] = [
//     {
//         breakpoint: '1024px',
//         numVisible: 5
//     },
//     {
//         breakpoint: '768px',
//         numVisible: 3
//     },
//     {
//         breakpoint: '560px',
//         numVisible: 1
//     }
// ];

}
