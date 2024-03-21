import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ConfigGalleryComponent } from "../../components/config-gallery/config-gallery.component";
import { FormsModule } from '@angular/forms';
import { MainService } from '../../../services/service';
import { Data } from '../../../interfaces/data.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'admin-config-home-page',
    standalone: true,
    templateUrl: './config-home-page.component.html',
    styles: `
    .text-responsive {
      text-align: left;
      padding-top: 0.5rem;
    }

    @media (min-width: 770px) {
      .text-responsive {
        text-align: right;
        padding: 0
      }
    }

    .input-group input[type='file'] {
      display: none;
    }

    .input-group label {
      background-color: #00b2cc;
      color: #fff;
      transition: background-color 0.2s ease-in-out;
      border: 1px solid #ccc;
      display: inline-block;
      padding: 6px 12px;
      cursor: pointer;
    }

    .input-group label:hover {
      background-color: #0196ad;
    }
    `,
    imports: [NavbarComponent, ConfigGalleryComponent, FormsModule]
})
export class ConfigHomePageComponent {
  constructor(
    private service: MainService,
    private _sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.getData();
  }
  public data!: Data;
  public eslogan: string = '';
  public description: string = '';
  public mision: string = '';
  public vision: string = '';
  public logo: string = '';
  public visionImages: string[] = ['','','',''];
  public presentationImages: string[] = ['','','',''];


  deleteInputs() {
    this.eslogan = this.description = this.mision = this.vision = this.logo = '';
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.logo = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  getData(): void {
    this.service.getData().subscribe((data) => {
      this.data = data[0];
      this.eslogan = this.data.slogan;
      this.description = this.data.description;
      this.mision = this.data.mision;
      this.vision = this.data.vision;
      this.logo = this.data.logo;
      this.visionImages = this.data.visionImages;
      this.presentationImages = this.data.presentationImages;
    });
  }

  save() {
    this.service.updateMainPage(this.eslogan, this.description, this.mision, this.vision, this.logo).subscribe((data) => {
      // console.log(data)
    });
  }

  saveVisionImages() {
    this.service.updateMisionImages(this.visionImages).subscribe((data) => {
      // console.log(data)
    });
  }

  savePresentationImages() {
    this.service.updatePresentationImages(this.presentationImages).subscribe((data) => {
      console.log(data)
    });
  }


}
