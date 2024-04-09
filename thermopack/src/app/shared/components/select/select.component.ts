import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Types } from '../../../interfaces/types.interface';
import { Brands } from '../../../interfaces/brands.interface';

@Component({
  selector: 'shared-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {


  @Input()
  public listBrands: Brands[]=[];
  @Input()
  public value!: number;
  // @Output()
  // public option: number=0;
  @Output()
  public option:EventEmitter<number>= new EventEmitter();

  onSelectChange(event: any) {
    const idOption = event.target.value;
    // Haz algo con el índice seleccionado, por ejemplo, llamar a una función
      this.option.emit(idOption);
   
  }
}
