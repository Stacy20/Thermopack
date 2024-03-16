import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ButtonSocialMediaComponent } from '../../components/button-social-media/button-social-media.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ButtonSocialMediaComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

}
