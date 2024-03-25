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
    console.log(description)
    return description.replace(/\n/g, '<br>');
  }
  getData(): void {
    this.service.getData().subscribe((data) => {
      this.srcLogo = data[0].logo;
      this.slogan = data[0].slogan;
      this.companyDescription = data[0].description;
      this.descriptionMission = data[0].mision;
      this.descriptionVision = data[0].vision;
      this.srcMission1 = data[0].visionImages[0];
      this.srcMission2 =data[0].visionImages[1];
      this.srcVision1 = data[0].visionImages[2];
      this.srcVision2 = data[0].visionImages[3];
      this.images = [];
      data[0].presentationImages.forEach((imageString) => {
        if (imageString != ''){
          this.images.push(new ImageItem(
            { src: imageString,
            thumb: imageString},
          ));
        }
      });
    });
  }
}
