import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ButtonSocialMediaComponent } from '../../components/button-social-media/button-social-media.component';
import { FootersComponent } from "../../components/footers/footers.component";

@Component({
    selector: 'app-client',
    standalone: true,
    templateUrl: './client.component.html',
    styleUrl: './client.component.css',
    imports: [CommonModule, RouterOutlet, NavbarComponent, ButtonSocialMediaComponent, FootersComponent]
})
export class ClientComponent {

}
