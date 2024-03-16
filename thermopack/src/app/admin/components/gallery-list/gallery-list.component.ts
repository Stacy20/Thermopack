import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-gallery-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-list.component.html',
  styles: ``
})
export class GalleryListComponent {
  @Input() images: string[] = [];

  addImage(imageUrl: string): void {
    this.images.push(imageUrl);
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }
}
