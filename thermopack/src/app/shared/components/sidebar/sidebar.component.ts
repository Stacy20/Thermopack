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
  constructor(
    private service:MainService,
    ){}

  @Input()
  public Categories: Categories[]=[];


  public getProductsByCategoryId(id:string) {
    console.log('voy a ir a llamar')
    this.service.getProductsByCategoryId(id)
  }
  // searchTag(tag: string): void{
  //   this.spotiService.organizeHistory(tag);
  //   this.router.navigateByUrl(tag);
  // }
}
