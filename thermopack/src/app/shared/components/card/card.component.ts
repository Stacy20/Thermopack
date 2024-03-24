import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MainService } from '../../../services/service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'shared-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input()
  public title:string='Card title';

  @Input()
  public id:string='Card title';

  @Input()
  public src:string='https://d2o812a6k13pkp.cloudfront.net/fit-in/1080x1080/Productos/40410564_0120220801162411.jpg';

  @Input()
  public text:string='Some quick example text to build on the card title and make up the bulk of the cards content.';

  @Input()
  public type!:number;

  @Input()
  public permissions!:number;
  constructor(
    private router: Router,
    public service: MainService,
    ) {}

  // id: string;
  // name: string;
  // description: string;
  // price: number;
  // images: Buffer[];
  public gotoEditProduct(){
    if(this.type === 1){
      this.router.navigate(['/admin/products/edit/'+this.title]);
    }
    if(this.type === 2){
      this.router.navigate(['/admin/services/edit/'+this.title]);
    }
  }

  public deleteProduct(){
    if(this.type === 1){
      this.service.deleteProductByName(this.title).subscribe((product) => {
        console.log(product);
        location.reload();
      });
    }
    if(this.type === 2){
      this.service.deleteServiceByName(this.title).subscribe((service) => {
        //console.log(service);
        location.reload();
      });
    }
  }
}
