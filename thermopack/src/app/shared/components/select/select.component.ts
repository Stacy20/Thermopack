import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-select',
  standalone: true,
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
  @Input()
  public text:string=''

  //TODO: Cambiar el tipo por el array del tipo que contengan el nombre y el id
  @Input()
  public value: number[]=[];

  @Output()
  public option: number=0;

}
