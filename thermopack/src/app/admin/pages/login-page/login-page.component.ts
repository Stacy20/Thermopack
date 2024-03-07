import { Component } from '@angular/core';
import { MainService } from './../../../services/service';
import { Brands } from '../../../interfaces/brands.interface';
import { Categories } from '../../../interfaces/categories.interface';
import { Users } from '../../../interfaces/users.interface';
import { Types } from '../../../interfaces/types.interface';
import { Services } from '../../../interfaces/services.interface';
import { Products } from '../../../interfaces/products.interface';
import { Privileges } from '../../../interfaces/privileges.interface';
import { Data } from '../../../interfaces/data.interface';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {
  public brand!: Data;
  constructor(
    private service: MainService
  ) {}

  test() {
    console.log('Button clicked!');
    this.getAllBrands();
  }

  getAllBrands(): void {
    console.log("hello")
    this.service.getData().subscribe((brand) => {
      this.brand = brand;
      console.log('this.brand' , this.brand )
    });
  }
}
