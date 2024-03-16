import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { GalleryListComponent } from '../../components/gallery-list/gallery-list.component';

@Component({
    selector: 'admin-add-product-page',
    standalone: true,
    templateUrl: './add-product-page.component.html',
    styles: ``,
    imports: [GalleryListComponent, NavbarComponent]
})
export class AddProductPageComponent {
    @ViewChild(GalleryListComponent) galleryListComponent!: GalleryListComponent;

    addImage(): void {
      const fileInput = document.getElementById('inputFile') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          this.galleryListComponent.addImage(imageUrl);
        };
        reader.readAsDataURL(file);
      }
    }
}
