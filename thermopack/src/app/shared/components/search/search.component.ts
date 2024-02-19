import { Component } from '@angular/core';

@Component({
  selector: 'shared-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  search(query: string) {
    // Aquí puedes realizar la lógica de búsqueda con el valor de la consulta "query"
    console.log("Búsqueda:", query);
  }
}
