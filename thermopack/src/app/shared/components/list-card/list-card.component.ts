import { Component } from '@angular/core';
import { CardComponent } from "../card/card.component";

@Component({
    selector: 'shared-list-card',
    standalone: true,
    templateUrl: './list-card.component.html',
    styleUrl: './list-card.component.css',
    imports: [CardComponent]
})
export class ListCardComponent {

  public data: string[] = ['1','2','3','4'];
}
