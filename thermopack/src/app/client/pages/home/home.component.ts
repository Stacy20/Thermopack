import { Component } from '@angular/core';
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { FootersComponent } from "../../components/footers/footers.component";

@Component({
    selector: 'client-page-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CarouselComponent, FootersComponent]
})
export class HomeComponent {
  public srcLogo:string='assets/LogoThermoPack.jpg';
  public slogan:string='Un eslogan o frase llamativa de la empresa';
  public companyDescription:string='Un párrafo donde se explique quiénes son, qué hacen y qué ofrecen. Lorem';
  //TODO: El siguiente atributo es un array de imagenes pero debe seguir esta estructura
  images: any[] = [
    {
      itemImageSrc: 'https://d2o812a6k13pkp.cloudfront.net/fit-in/1080x1080/Productos/40410564_0120220801162411.jpg'
    },
    {
      itemImageSrc: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg'
    },
    {
      itemImageSrc: 'https://humanidades.com/wp-content/uploads/2019/02/comercio-1-e1585873887582.jpg'
    },
  ];

  public titleMission:string='Misión de la empresa';
  public descriptionMission:string='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.';
  public srcMission1:string='https://hips.hearstapps.com/hmg-prod/images/types-of-flowers-for-garden-black-eyed-susans-1674848363.jpeg';
  public srcMission2:string='https://hips.hearstapps.com/hmg-prod/images/types-of-flowers-for-garden-black-eyed-susans-1674848363.jpeg';


  public titleVision:string='Visión de la empresa';
  public descriptionVision:string='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.';
  public srcVision1:string='https://hips.hearstapps.com/hmg-prod/images/types-of-flowers-for-garden-black-eyed-susans-1674848363.jpeg';
  public srcVision2:string='https://hips.hearstapps.com/hmg-prod/images/types-of-flowers-for-garden-black-eyed-susans-1674848363.jpeg';
}
