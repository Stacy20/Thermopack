import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input()
  public Categories: string[]=['Insecticidas', 'Repelentes','Aromatizantes']

  // searchTag(tag: string): void{
  //   this.spotiService.organizeHistory(tag);
  //   this.router.navigateByUrl(tag);
  // }
}
