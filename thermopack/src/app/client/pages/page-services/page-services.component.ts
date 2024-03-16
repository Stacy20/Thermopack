import { Component } from '@angular/core';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";
import { FootersComponent } from "../../components/footers/footers.component";
import { MainService } from '../../../services/service';
import { Services } from '../../../interfaces/services.interface';

@Component({
    selector: 'client-page-services',
    standalone: true,
    templateUrl: './page-services.component.html',
    styleUrl: './page-services.component.css',
    imports: [PaginationComponent, ListCardComponent, FootersComponent]
})
export class PageServicesComponent {
  public title:string='Nuestros servicios';
  public description:string='Cotice con nosotros los servicios que le ofrecemos a usted y su empresa. Esto es un texto general, la descripción de cada servicio puede ir en la página individual de cada uno.';
  public services: Services[]=[];

  constructor(
    private service:MainService,
  ){}
  getAllServices(): void{
    this.service.getAllServices().subscribe((services) => {
      this.services = services;
      console.log('this.brand' , this.services )
    });
}
}
