import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from '../../../services/service';

interface ListItem {
  _id: string;
  name: string;
}

@Component({
  selector: 'admin-edit-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-list.component.html'
})
export class EditListComponent {
  constructor(
    public service: MainService,
  ) {}

  public limitRows: number = 5;
  public offset: number = 0;
  public currentPage: number = 1;

  private _items: ListItem[] = [];
  public query:string='';
  public queryRow:number=0;
  @Input()
  set items(value: ListItem[]) {
    this._items = value;
    this.updateRenderItems();
  }
  get items(): ListItem[] {
    return this._items;
  }

  @Output() edit = new EventEmitter<ListItem>();
  @Output() delete = new EventEmitter<ListItem>();

  public renderItems: ListItem[] = [];

  get totalRows(): number {
    return this.items.length;
  }

  ngOnInit(): void {
    this.updateRenderItems();
  }

  updateRenderItems(): void {
    const startIndex = this.offset;
    let endIndex;
    if(this.query.trim().length==0){
      endIndex= Math.min(startIndex + this.limitRows, this.items.length);
    }else{
      endIndex= Math.min(startIndex + this.limitRows, this.queryRow);
    }if(this.query.trim().length==0){
      this.renderItems = this.items.slice(startIndex, endIndex);
    }else{
      this.renderItems = this.items.filter(item => item.name.toLowerCase().startsWith(this.query.toLowerCase())).slice(startIndex,endIndex);
    }
  }

  editItem(item: ListItem) {
    const element = document.querySelector(`[data-index="${item._id}"]`);
    if (element instanceof HTMLElement) {
      this.edit.emit({_id: element.innerText, name: item.name});
    }
  }

  deleteItem(item: ListItem) {
    this._items = this._items.filter(iterItem => iterItem._id !== item._id);
    this.delete.emit(item);
    this.updateRenderItems(); // Actualizar renderItems después de eliminar un elemento
  }

  generatePagination(): number[] {
    let totalPages=0
    if(this.query.trim().length==0){
      totalPages = Math.ceil(this.totalRows / this.limitRows);
    }else{
      totalPages = Math.ceil(this.queryRow / this.limitRows);
    }

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

  updateCurrentPage(change: number): void {
    this.currentPage += change;
    this.offset = (this.currentPage - 1) * this.limitRows;
  // Asegurarse de que offset se actualice antes de llamar a updateRenderItems
    setTimeout(() => this.updateRenderItems());
  }

  search(query: string) {
    // Aquí puedes realizar la lógica de búsqueda con el valor de la consulta "query"
    this.query=query
    if (this.query.trim().length==0) {
      this.renderItems = this.items.slice(0, this.limitRows);
      this.currentPage = 1;
      this.updateRenderItems();
    } else {
      this.renderItems = this.items.filter(item => item.name.toLowerCase().startsWith(query.toLowerCase()));
      this.queryRow=this.renderItems.length;
      this.updateRenderItems();
    }
  }
}
