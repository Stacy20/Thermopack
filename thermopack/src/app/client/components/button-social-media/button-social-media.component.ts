import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'client-button-social-media',
  standalone: true,
  imports: [],
  templateUrl: './button-social-media.component.html',
  styleUrls: ['./button-social-media.component.css']
})
export class ButtonSocialMediaComponent {
  @ViewChild('add') addButton!: ElementRef;
  @ViewChild('remove') removeButton!: ElementRef;
  @ViewChild('btns') buttonsDiv!: ElementRef;

  toggleBtn(): void {
    const btnsDiv = this.buttonsDiv.nativeElement;
    const addBtn = this.addButton.nativeElement;
    const removeBtn = this.removeButton.nativeElement;

    btnsDiv.classList.toggle('open');

    if (btnsDiv.classList.contains('open')) {
      removeBtn.style.display = 'block';
      addBtn.style.display = 'none';

      btnsDiv.querySelectorAll('.btn').forEach((btn: HTMLElement, i: number) => {
        setTimeout(() => {
          const bottom = 40 * i;
          btn.style.bottom = bottom + 'px';
        }, 100 * i);
      });
    } else {
      addBtn.style.display = 'block';
      removeBtn.style.display = 'none';

      btnsDiv.querySelectorAll('.btn').forEach((btn: HTMLElement) => {
        btn.style.bottom = '0px';
      });
    }
  }
}
