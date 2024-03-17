import { Component, Input } from '@angular/core';
import { MainService } from '../../../services/service';

@Component({
  selector: 'shared-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  currentPage: number = 0;

  @Input()
  public type!:string

  constructor(
    private service:MainService,
  ){}
  OnNextPage():void{
    this.service.nextPage(this.type);
    // this.updateCurrentPage(1);
  }
  updateCurrentPage(change: number): void {
    console.log(this.currentPage);
    this.currentPage += change;

    if (change > 0) {
      this.OnNextPage();
    } else if (change < 0) {
      this.onPastPage();
    }
  }
  onPastPage():void{
    this.service.pastPage(this.type);
    // this.updateCurrentPage(-1);
  }
  get offsetService():number{
    return this.service.offset;
  }
  get limitService():number{
    return this.service.limit;
  }
  get totalServices():number{
    return this.service.totalServices;
  }
  get offsetProducts():number{
    return this.service.offsetProducts;
  }
  get limitProducts():number{
    return this.service.limitProducts;
  }
  get totalProducts():number{

    return this.service.totalProducts;
  }
  generatePagination(): number[] {
    let totalPages =0
    if (this.type=="0") {
       totalPages = Math.ceil(this.totalServices / this.limitService);
    }else{
      console.log(this.totalProducts, 'hola', this.totalProducts / this.limitProducts, this.totalProducts, this.limitProducts )
       totalPages = Math.ceil(this.totalProducts / this.limitProducts);
    }
console.log(totalPages,'soy total')
    let startPage = 1;
    const paginationItems: number[] = [];

    if (totalPages > 3) {
      if (this.currentPage > 1 && this.currentPage < totalPages) {
        startPage = this.currentPage - 1;
      } else if (this.currentPage === totalPages) {
        startPage = totalPages - 2;
      }
    }

    for (let i = 0; i < 3 && startPage <= totalPages; i++, startPage++) {
      paginationItems.push(startPage);
    }

    return paginationItems;
  }


}
