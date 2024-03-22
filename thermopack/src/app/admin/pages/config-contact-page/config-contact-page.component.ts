import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ConfigGalleryComponent } from "../../components/config-gallery/config-gallery.component";
import { MainService } from '../../../services/service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'admin-config-contact-page',
    standalone: true,
    templateUrl: './config-contact-page.component.html',
    styles: `
    .text-responsive {
      text-align: left;
      padding-top: 0.5rem;
    }

    @media (min-width: 770px) {
      .text-responsive {
        text-align: right;
        padding: 0
      }
    }`,
    imports: [NavbarComponent, ConfigGalleryComponent, FormsModule, CommonModule]
})
export class ConfigContactPageComponent {
  constructor(
    private service: MainService,
  ) {}

  ngOnInit() {
    this.getData();
  }

  public welcomeParagraph: string = '';
  public ubicationText: string = '';
  public ubicationGMLink: string = '';
  public ubicationWazeLink: string = '';
  public telephoneNumbers: string[] = ['','',''];
  public email: string = '';
  public whatsappLink: string = '';
  public facebookLink: string = '';
  public instagramLink: string = '';
  public youtubeLink: string = '';
  public images: string[] = ['','','',''];
  public newNumber: string = '';


  getData(): void {
    this.service.getContactData().subscribe((contact) => {
      this.welcomeParagraph = contact[0].welcomeParagraph;
      this.ubicationText = contact[0].ubicationText;
      this.ubicationGMLink = contact[0].ubicationGMLink;
      this.ubicationWazeLink = contact[0].ubicationWazeLink;
      this.telephoneNumbers  = contact[0].telephoneNumbers;
      this.email = contact[0].email;
      this.whatsappLink = contact[0].whatsappLink;
      this.facebookLink = contact[0].facebookLink;
      this.instagramLink = contact[0].instagramLink;
      this.youtubeLink = contact[0].youtubeLink;
      this.images = contact[0].images;
    });
  }

  addNumber() {
    this.telephoneNumbers[2] = this.telephoneNumbers[1];
    this.telephoneNumbers[1] = this.telephoneNumbers[0];
    this.telephoneNumbers[0] = this.newNumber;
    this.newNumber = '';
  }

  save() {
    this.service.updateContactData(this.welcomeParagraph, this.ubicationText, this.ubicationGMLink, this.ubicationWazeLink,
      this.telephoneNumbers, this.email, this.whatsappLink, this.facebookLink,
      this.instagramLink, this.youtubeLink).subscribe((data) => {
      // console.log(data)
    });
  }

  saveImages() {
    this.service.updateContactImages(this.images).subscribe((data) => {
      // console.log(data)
    });
  }

}
