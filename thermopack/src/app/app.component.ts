import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./client/components/navbar/navbar.component";
import { ButtonSocialMediaComponent } from "./client/components/button-social-media/button-social-media.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, NavbarComponent, ButtonSocialMediaComponent]
})
export class AppComponent {
  title = 'thermopack';
}
