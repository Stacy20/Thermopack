import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Types } from '../../../interfaces/types.interface';

@Component({
  selector: 'shared-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {

  //TODO: Cambiar el tipo por el array del tipo que contengan el nombre y el id
  @Input()
  public listTypes: Types[]=[];
  @Input()
  public listBrands: Types[]=[];
  @Input()
  public value!: number;
  // @Output()
  // public option: number=0;
  @Output()
  public option:EventEmitter<number>= new EventEmitter();

  onSelectChange(event: any) {
    const selectedIndex = event.target.value;
    console.log('a ver a ver', selectedIndex);
    // Haz algo con el índice seleccionado, por ejemplo, llamar a una función
      this.option.emit(selectedIndex);
      console.log(event.target.value)
  }
}
