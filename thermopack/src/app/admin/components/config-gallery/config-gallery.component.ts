import { Component } from '@angular/core';

@Component({
  selector: 'admin-config-gallery',
  standalone: true,
  imports: [],
  templateUrl: './config-gallery.component.html',
  styles: ``
})
export class ConfigGalleryComponent {

  onFileSelected(event: any, imgId: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgElement = document.getElementById(imgId) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

}
