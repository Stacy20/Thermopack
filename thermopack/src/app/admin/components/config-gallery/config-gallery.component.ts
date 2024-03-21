import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MainService } from '../../../services/service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-config-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config-gallery.component.html',
  styles: ``
})
export class ConfigGalleryComponent {
  @Input() images: string[] = ['', '', '', ''];
  @Input() identifier: string = '';

  handleFileInput(event: any, index:number) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.images[index] = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  deleteImage(index: number) {
    this.images[index] = '';
  }

}
