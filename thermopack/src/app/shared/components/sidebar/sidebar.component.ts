import { Component, Input } from '@angular/core';
import { Categories } from '../../../interfaces/categories.interface';
import { MainService } from '../../../services/service';

@Component({
  selector: 'shared-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public selectedCategory: number | null = null;
  constructor(
    private service:MainService,
    ){}

  @Input()
  public categories: Categories[]=[];


  public getProductsByCategoryId(index:number) {
    this.service.filterProducts(this.limitProducts, this.offsetProducts, undefined, this.categories[index]._id )
    this.selectedCategory = index;
  }

  get offsetProducts():number{
    return this.service.offsetProducts;
  }
  get limitProducts():number{
    return this.service.limitProducts;
  }
  // searchTag(tag: string): void{
  //   this.spotiService.organizeHistory(tag);
  //   this.router.navigateByUrl(tag);
  // }
}
