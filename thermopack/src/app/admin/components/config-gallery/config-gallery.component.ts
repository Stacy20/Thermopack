import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MainService } from '../../../services/service';
import { CommonModule } from '@angular/common';
import { ImagesNewEvent } from '../../interfaces/images-new-event';
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

  @Output() imagesNew: EventEmitter<ImagesNewEvent> = new EventEmitter<ImagesNewEvent>();


  handleFileInput(event: any, index:number) {
    console.log(this.images,'al inicio')
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.images[index] = e.target.result;
      const data: ImagesNewEvent = {
        images: this.images,
        identifier: this.identifier
      };
      this.imagesNew.emit(data)
      console.log(this.images,'despues')
    };
    reader.readAsDataURL(file);

  }

  deleteImage(index: number) {
    this.images[index] = '';
    // const data = { images: this.images, identifier: this.identifier };
    const data: ImagesNewEvent = {
      images: this.images,
      identifier: this.identifier
    };
    this.imagesNew.emit(data); // Emitir el objeto que contiene imágenes y el identificador
  }

}
