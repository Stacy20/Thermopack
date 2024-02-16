import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-card',
  standalone: true,
  imports: [],
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

  

}
