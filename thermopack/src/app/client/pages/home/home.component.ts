import { Component } from '@angular/core';
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { FootersComponent } from "../../components/footers/footers.component";
import { MainService } from '../../../services/service';
import { Data } from '../../../interfaces/data.interface';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
@Component({
    selector: 'client-page-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CarouselComponent, FootersComponent]
})
export class HomeComponent {
  constructor(
    private service: MainService,
  ) {}

  ngOnInit() {
    this.getData();
  }
  public loading:boolean=true;
  public srcLogo:string='';
  public slogan:string='';
  public companyDescription:string='';
  images!: GalleryItem[];
  public titleMission:string='Misión de la empresa';
  public descriptionMission:string='';
  public srcMission1:string='';
  public srcMission2:string='';

  public titleVision:string='Visión de la empresa';
  public descriptionVision:string='';
  public srcVision1:string='';
  public srcVision2:string='';
  formatDescription(description: string): string {
    return description.replace(/\n/g, '<br>');
  }
  // getData(): void {
  //   this.service.getData().subscribe((data) => {
  //     this.srcLogo = data[0].logo;
  //     this.slogan = data[0].slogan;
  //     this.companyDescription = data[0].description;
  //     this.descriptionMission = data[0].mision;
  //     this.descriptionVision = data[0].vision;
  //     this.srcMission1 = data[0].visionImages[0];
  //     this.srcMission2 =data[0].visionImages[1];
  //     this.srcVision1 = data[0].visionImages[2];
  //     this.srcVision2 = data[0].visionImages[3];
  //     this.images = [];
  //     data[0].presentationImages.forEach((imageString) => {
  //       if (imageString != ''){
  //         this.images.push(new ImageItem(
  //           { src: imageString,
  //           thumb: imageString},
  //         ));
  //       }
  //     });
  //     if (this.checkDataLoaded()) {
  //       this.loading = false;
  //     }
  //   });
  // }
  async getData(): Promise<void> {
    try {
      const data = await this.service.getTextData();
      console.log(data);

      if (data) {
        this.slogan = data.slogan;
        this.companyDescription = data.description;
        this.descriptionMission = data.mision;
        this.descriptionVision = data.vision;

      }
      const logo = await this.service.getLogo();
      if (logo) {
        this.srcLogo = logo.logo;
      }
      const visionImages = await this.service.getVisionImages();
      if (visionImages) {
        this.srcMission1 = visionImages.visionImages[0];
        this.srcMission2 = visionImages.visionImages[1];
        this.srcVision1 = visionImages.visionImages[2];
        this.srcVision2 = visionImages.visionImages[3];
      }

      const presentationImages = await this.service.getPresentationImages();
      if (presentationImages) {
        this.images = presentationImages.presentationImages
          .filter((imageString: string) => imageString !== '')
          .map((imageString: string) => new ImageItem({ src: imageString, thumb: imageString }));
      }

      if (this.checkDataLoaded()) {
        this.loading = false;
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }


  checkDataLoaded(): boolean {
    return (
      this.srcLogo !== '' &&
      this.slogan !== '' &&
      this.companyDescription !== '' &&
      this.descriptionMission !== '' &&
      this.descriptionVision !== '' &&
      this.srcMission1 !== '' &&
      this.srcMission2 !== '' &&
      this.srcVision1 !== '' &&
      this.srcVision2 !== '' &&
      this.images.length > 0
    );
  }
}
