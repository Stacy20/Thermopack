import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UnderConstructionComponent } from "../../../shared/components/under-construction/under-construction.component";

@Component({
    selector: 'app-edit-service-page',
    standalone: true,
    templateUrl: './edit-service-page.component.html',
    styles: ``,
    imports: [NavbarComponent, UnderConstructionComponent]
})
export class EditServicePageComponent {

}
