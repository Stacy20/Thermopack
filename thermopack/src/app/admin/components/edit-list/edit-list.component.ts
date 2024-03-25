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

  @Input() items: ListItem[] = [];
  @Output() edit = new EventEmitter<ListItem>();
  @Output() delete = new EventEmitter<ListItem>();

  editItem(item: ListItem) {
    const element = document.querySelector(`[data-index="${item._id}"]`);
    if (element instanceof HTMLElement) {
      this.edit.emit({_id: element.innerText, name: item.name});
    }
  }

  deleteItem(item: ListItem) {
    this.items = this.items.filter(iterItem => iterItem._id !== item._id);
    this.delete.emit(item);
  }
}
