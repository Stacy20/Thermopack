import { Component } from '@angular/core';
import { FootersComponent } from "../../components/footers/footers.component";

@Component({
    selector: 'client-page-contact-us',
    standalone: true,
    templateUrl: './contact-us.component.html',
    styleUrl: './contact-us.component.css',
    imports: [FootersComponent]
})
export class ContactUsComponent {

}
