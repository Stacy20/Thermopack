import { Component, Input } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { Services } from '../../../interfaces/services.interface';
import { Products } from '../../../interfaces/products.interface';

@Component({
    selector: 'shared-list-card',
    standalone: true,
    templateUrl: './list-card.component.html',
    styleUrl: './list-card.component.css',
    imports: [CardComponent]
})
export class ListCardComponent {

  @Input()
  public services: Services[] = [];
  @Input()
  public products: Products[] = [];

  @Input()
  public type!: number;
}
