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
  public data!: Data;

  public srcLogo:string='assets/LogoThermoPack.jpg';
  public slogan:string='';
  public companyDescription:string='Un párrafo donde se explique quiénes son, qué hacen y qué ofrecen. Lorem';
  images!: GalleryItem[];
  // ngOnInit() {
  //   // Set items array
  //   this.images = [
  //     new ImageItem(
  //       { src: 'https://d2o812a6k13pkp.cloudfront.net/fit-in/1080x1080/Productos/40410564_0120220801162411.jpg',
  //       thumb: 'https://d2o812a6k13pkp.cloudfront.net/fit-in/1080x1080/Productos/40410564_0120220801162411.jpg' },
  //       ),
  //       new ImageItem(
  //         { src: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg',
  //         thumb: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg' },
  //         )
  //     // ... more items
  //   ];
  // }
  public titleMission:string='Misión de la empresa';
  public descriptionMission:string='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.';
  public srcMission1:string='https://hips.hearstapps.com/hmg-prod/images/types-of-flowers-for-garden-black-eyed-susans-1674848363.jpeg';
  public srcMission2:string='https://hips.hearstapps.com/hmg-prod/images/types-of-flowers-for-garden-black-eyed-susans-1674848363.jpeg';

  public titleVision:string='Visión de la empresa';
  public descriptionVision:string='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.';
  public srcVision1:string='https://hips.hearstapps.com/hmg-prod/images/types-of-flowers-for-garden-black-eyed-susans-1674848363.jpeg';
  public srcVision2:string='https://hips.hearstapps.com/hmg-prod/images/types-of-flowers-for-garden-black-eyed-susans-1674848363.jpeg';

  getData(): void {
    this.service.getData().subscribe((data) => {
      this.data = data[0];
      console.log('this.data' , this.data )
      // this.srcLogo = this.data.slogan;
      this.srcLogo = 'assets/LogoThermoPack.jpg'
      this.slogan = this.data.slogan;
      this.companyDescription = this.data.slogan;
      // this.images = this.data.mainImages;
      // this.titleMission = this.data.slogan;
      this.descriptionMission = this.data.mision;
      // this.srcMission1 = this.data.presentationImages[0];
      // this.srcMission2 = this.data.presentationImages[0];
      // this.titleVision = this.data.slogan;
      this.descriptionVision = this.data.vision;
      // this.srcVision1 = this.data.visionImages[0];
      // this.srcVision2 = this.data.visionImages[0];
      this.srcMission1 = this.srcMission2 = this.srcVision1 = this.srcVision2 = 'https://hips.hearstapps.com/hmg-prod/images/types-of-flowers-for-garden-black-eyed-susans-1674848363.jpeg'

    });
  }
}
