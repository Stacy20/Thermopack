import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ListCardComponent } from '../../../shared/components/list-card/list-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { MainService } from '../../../services/service';
import { Services } from '../../../interfaces/services.interface';
import { Data } from '../../../interfaces/data.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-admin-service-page',
    standalone: true,
    templateUrl: './admin-service-page.component.html',
    styleUrl: '../admin-product-page/admin-product-page.component.css',
    imports: [NavbarComponent, ListCardComponent, PaginationComponent]
})
export class AdminServicePageComponent {
  public title:string='Nuestros servicios';
  public description:string='';
  public data!: Data;
  public totalServices:number=0;
  public services: Services[]=[];

  constructor(
    public service:MainService,
    private router: Router
  ){}

  ngOnInit(): void {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
    this.getData();
    // Suscribirse al observable services$ en el servicio
    this.service.services$.subscribe(response => {
      // Actualizar los datos del componente con los datos del servicio
      this.services = response.services;
      this.totalServices = response.totalCount;
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

    });
  }
  addServicePage() {
    this.router.navigate(['/admin/services/add']);
  }
}
