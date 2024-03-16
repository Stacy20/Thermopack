import { Component } from '@angular/core';
import { ListCardComponent } from "../../../shared/components/list-card/list-card.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home-page.component.html',
    styles: ``,
    imports: [ListCardComponent]
})
export class HomePageComponent {

}
