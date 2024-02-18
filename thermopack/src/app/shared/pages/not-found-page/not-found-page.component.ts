import { Component } from '@angular/core';

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

}
