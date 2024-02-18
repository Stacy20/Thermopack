import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UnderConstructionComponent } from "../../../shared/components/under-construction/under-construction.component";

@Component({
    selector: 'app-admin-product-page',
    standalone: true,
    templateUrl: './admin-product-page.component.html',
    styles: ``,
    imports: [NavbarComponent, UnderConstructionComponent]
})
export class AdminProductPageComponent {

}
