import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
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

  constructor(private router: Router) {}

  public gotoEdit(){
    if(this.type === 1){
      this.router.navigate(['/admin/products/edit/AnyID']);
    }
    if(this.type === 2){
      this.router.navigate(['/admin/services/edit/AnyID']);
    }
  }

}
