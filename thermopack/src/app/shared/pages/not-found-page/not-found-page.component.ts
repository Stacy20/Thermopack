import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [],
  templateUrl: './not-found-page.component.html',
  styles: `
    .error-image {
      display: block;
      margin: 0 auto;
      width: 50%;
      max-width: 400px;
    }
    `
})
export class NotFoundPageComponent {
  constructor(private titleService:Title) {
    this.titleService.setTitle("Thermopack - Error 404");
  }
}
