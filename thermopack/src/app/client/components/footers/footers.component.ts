import { Component } from '@angular/core';
import { MainService } from '../../../services/service';

@Component({
  selector: 'client-component-footers',
  standalone: true,
  imports: [],
  templateUrl: './footers.component.html',
  styleUrl: './footers.component.css'
})
export class FootersComponent {
  public whatsappLink: string = '';
  public facebookLink: string = '';
  public instagramLink: string = '';
  public youtubeLink: string = '';
  mensajeWhatsApp: string = '¿Cómo puedo adquirir productos o servicios de ustedes?';


  constructor(
    private service: MainService,
  ) {}
  ngOnInit() {
    this.getData();
  }
  getData(): void {
    this.service.getContactData().subscribe((contact) => {
      this.whatsappLink =`https://wa.me/${ contact[0].whatsappLink}?text=${encodeURIComponent(this.mensajeWhatsApp)}`;
      this.facebookLink = contact[0].facebookLink;
      this.instagramLink = contact[0].instagramLink;
      this.youtubeLink = contact[0].youtubeLink;
      
    });

  }
}
