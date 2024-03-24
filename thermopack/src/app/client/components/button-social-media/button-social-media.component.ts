import { Component, ElementRef, ViewChild } from '@angular/core';
import { MainService } from '../../../services/service';

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

  mensajeWhatsApp: string = '¿Cómo puedo adquirir productos o servicios de ustedes?';

  // Construcción del enlace de WhatsApp utilizando la variable para el mensaje
  //  whatsappLink: string = `https://wa.me/${50688598630}?text=${encodeURIComponent(this.mensajeWhatsApp)}
  constructor(
    private service: MainService,
  ) {}

  ngOnInit() {
    this.getData();
  }

  public whatsappLink: string = '';
  public facebookLink: string = '';
  public instagramLink: string = '';
  public youtubeLink: string = '';


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

  getData(): void {
    this.service.getContactData().subscribe((contact) => {
      this.whatsappLink =`https://wa.me/${ contact[0].whatsappLink}?text=${encodeURIComponent(this.mensajeWhatsApp)}`;
      console.log(this.whatsappLink, 'hola')
      this.facebookLink = contact[0].facebookLink;
      this.instagramLink = contact[0].instagramLink;
      this.youtubeLink = contact[0].youtubeLink;
    });
  }
}
