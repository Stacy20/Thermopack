import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'shared-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input()
  public title:string='';

  @Input()
  public src:string='';

  @Input()
  public text:string='';

  @Input()
  public type!:number;

}
