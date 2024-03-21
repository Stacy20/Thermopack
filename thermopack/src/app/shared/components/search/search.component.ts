import { Component } from '@angular/core';
import { MainService } from '../../../services/service';

@Component({
  selector: 'shared-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  constructor(
    private service:MainService,
    ){}
  search(query: string) {
    // Aquí puedes realizar la lógica de búsqueda con el valor de la consulta "query"
    console.log("Búsqueda:", query);

    this.service.filterProducts(this.limitProducts, this.offsetProducts, undefined, undefined, undefined, query );

  }

  get offsetProducts():number{
    return this.service.offsetProducts;
  }
  get limitProducts():number{
    return this.service.limitProducts;
  }
}
