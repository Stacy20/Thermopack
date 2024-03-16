import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  //TODO: Debe contener Nombre y link a donde va redirigir
  @Input()
  public Categories: string[]=[];

  // searchTag(tag: string): void{
  //   this.spotiService.organizeHistory(tag);
  //   this.router.navigateByUrl(tag);
  // }
}
