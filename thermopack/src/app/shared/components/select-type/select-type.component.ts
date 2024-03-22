import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Types } from '../../../interfaces/types.interface';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'shared-select-type',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select-type.component.html',
  styleUrl: './select-type.component.css'
})
export class SelectTypeComponent {
  @Input()
  public listTypes!: Types[];
  @Output()
  public option:EventEmitter<number>= new EventEmitter();
  @Input()
  public value!: number;
  onSelectChange(event: any) {
    const idOption = event.target.value;
    // Haz algo con el índice seleccionado, por ejemplo, llamar a una función
      this.option.emit(idOption);
      console.log(event.target.value)
  }
}
