import { Component } from '@angular/core';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";
import { FootersComponent } from "../../components/footers/footers.component";
import { MainService } from '../../../services/service';
import { Services } from '../../../interfaces/services.interface';
import { Data } from '../../../interfaces/data.interface';

@Component({
    selector: 'client-page-services',
    standalone: true,
    templateUrl: './page-services.component.html',
    styleUrl: './page-services.component.css',
    imports: [PaginationComponent, ListCardComponent, FootersComponent]
})
export class PageServicesComponent {
  public loading: boolean = true;
  public title:string='Nuestros servicios';
  public description:string='';
  public data!: Data;
  public totalServices:number=0;
  public services: Services[]=[];
  constructor(
    private service:MainService,
  ){}

  ngOnInit(): void {
    this.getData();
    // Suscribirse al observable services$ en el servicio
    this.service.services$.subscribe(response => {
      // Actualizar los datos del componente con los datos del servicio
      this.services = response.services;
      this.totalServices = response.totalCount;
      if (this.checkDataLoaded()) {
        this.loading = false;
      }
    });

    // Llamar al método getServices() una vez al inicio
    this.service.getServices();
  }

  getservices(): void{
    this.services=this.service.services;
  }

  getData(): void {
    this.service.getData().subscribe((data) => {
      this.data = data[0];
      this.title=this.data.servicesTitle;
      this.description=this.data.servicesParagraph;
      if (this.checkDataLoaded()) {
        this.loading = false;
      }
    });
  }
  crearServicio(): void {
    const serviceName = "Nombre del servicio";
    const serviceDescription = "Descripción del servicio";
    const servicePrice = 99.99;
    const serviceImages = ["imagen1.jpg", "imagen2.jpg"]; // Ejemplo de array de imágenes

    this.service.createService(serviceName, serviceDescription, servicePrice, serviceImages)
      .subscribe(
        (result) => {

          // Aquí puedes manejar cualquier lógica adicional después de crear el servicio
        },
        (error) => {

          // Aquí puedes manejar cualquier error que ocurra durante la creación del servicio
        }
      );
  }
  formatDescription(description: string): string {
    return description.replace(/\n/g, '<br>');
  }
  checkDataLoaded(): boolean {
    return (
      this.title !== '' &&
      this.description !== '' &&
      this.services.length >= 0 &&
      this.data !== undefined &&
      this.totalServices >= 0
    );
  }
}
