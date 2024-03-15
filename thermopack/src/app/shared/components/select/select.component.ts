import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  public list: string[]=[];

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
  }
}
