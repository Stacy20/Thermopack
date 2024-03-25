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
    const endIndex = Math.min(startIndex + this.limitRows, this.items.length);
    this.renderItems = this.items.slice(startIndex, endIndex);
  }

  editItem(item: ListItem) {
    const element = document.querySelector(`[data-index="${item._id}"]`);
    if (element instanceof HTMLElement) {
      const newItem = element.innerText;

      this.edit.emit({_id: newItem, name: item.name});

      if(this.items.find(item => item.name === newItem) || newItem.trim() === ''){
        element.innerText = item.name;
      }
      else{
        item.name = newItem;
      }
    }
  }

  deleteItem(item: ListItem) {
    this.delete.emit(item);
    this._items = this._items.filter(iterItem => iterItem._id !== item._id);
    this.updateRenderItems(); // Actualizar renderItems después de eliminar un elemento
  }

  generatePagination(): number[] {
    let totalPages = Math.ceil(this.totalRows / this.limitRows);
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
}
