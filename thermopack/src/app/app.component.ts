import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from "./shared/components/card/card.component";
import { ListCardComponent } from "./shared/components/list-card/list-card.component";
import { NavbarComponent } from "./client/components/navbar/navbar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, CardComponent, ListCardComponent, NavbarComponent]
})
export class AppComponent {
  title = 'thermopack';
}
