import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UnderConstructionComponent } from "../../../shared/components/under-construction/under-construction.component";
import { ConfigGalleryComponent } from '../../components/config-gallery/config-gallery.component';
import { FormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MainService } from '../../../services/service';
import { ActivatedRoute, Router } from '@angular/router';
import { Types } from '../../../interfaces/types.interface';
import { SelectTypeComponent } from '../../../shared/components/select-type/select-type.component';
import { CommonModule } from '@angular/common';

import { Select2Data, Select2Module, Select2UpdateEvent } from 'ng-select2-component';

@Component({
    selector: 'admin-add-product-page',
    standalone: true,
    templateUrl: './add-product-page.component.html',
    styles: ``,
    imports: [ConfigGalleryComponent, NavbarComponent, UnderConstructionComponent, FormsModule, SelectTypeComponent, CommonModule, Select2Module]
})
export class AddProductPageComponent {
  constructor(
    private service: MainService,
    private router: Router,
  ) {}

  async ngOnInit() {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
    if (!(await this.service.userCanAdd())) {
      this.router.navigate(['admin/config/home']);
    }
    this.getData();;
  }

  public name: string = '';
  public description: string = '';
  public price: number = 0;
  public images: string[] = [];

  public type: string = '';
  public types: any[]=[];
  public selectedType: any = {value: '0', label: ''};

  public brand: string = '';
  public brands: any[]=[];
  public selectedBrand: any = {value: '0', label: ''};

  public categories: any[]=[];
  public category: string = '';
  public selectedCategory: any = {value: '0', label: ''};

  public subCategory: string = '';
  public selectedSubCategory: any = {value: '0', label: ''};

  getData(): void {
    this.service.getAllTypes().subscribe((types) => {
      for (let i = 0; i < types.length; i++) {
        this.types[i] = {value: types[i]._id, label: types[i].name};
      }
    });

    this.service.getAllBrands().subscribe((brands) => {
      for (let i = 0; i < brands.length; i++) {
        this.brands[i] = {value: brands[i]._id, label: brands[i].name};
      }
    });

    this.service.getAllCategories().subscribe((categories) => {
      for (let i = 0; i < categories.length; i++) {
        this.categories[i] = {value: categories[i]._id, label: categories[i].name};
      }
    });
  }

  selectType(event: Select2UpdateEvent<any>) {
    if(event.options.length > 0){
      this.selectedType = event.options[0];

      if(this.selectedType.value === this.selectedType.label){
        this.service.createType(this.selectedType.label).subscribe((response) => {
          this.selectedType.value = response._id;
        });
      }
    }else{
      this.selectedType = {}
    }
  }

  selectBrand(event: any) {
    if(event.options.length > 0){
      this.selectedBrand = event.options[0];

      if(this.selectedBrand.value === this.selectedBrand.label){
        this.service.createBrand(this.selectedBrand.label).subscribe((response) => {
          this.selectedBrand.value = response._id;
        });
      }
    }else{
      this.selectedBrand = {}
    }
  }

  selectCategory(event: any) {
    if(event.options.length > 0){
      this.selectedCategory = event.options[0];

      if(this.selectedCategory.value === this.selectedCategory.label){
        this.service.createCategory(this.selectedCategory.label).subscribe((response) => {
          this.selectedCategory.value = response._id;
        });
      }
    }else{
      this.selectedCategory = {}
    }
  }

  selectSubCategory(event: any) {
    if(event.options.length > 0){
      this.selectedSubCategory = event.options[0];

      if(this.selectedSubCategory.value === this.selectedSubCategory.label){
        this.service.createCategory(this.selectedSubCategory.label).subscribe((response) => {
          this.selectedSubCategory.value = response._id;
        });
      }
    }else{
      this.selectedSubCategory = {}
    }
  }

  handleFileInput(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);
  }

  save(){
    this.service.getProductByName(this.name).subscribe((product) => {
      if (Object.keys(product).length !== 0){
        return;
      }
      // TODO implementar alerts
      this.service.createProduct(this.name, this.description,
        this.selectedBrand.value, this.selectedType.value, this.price,
        this.selectedCategory.value, this.selectedSubCategory.value,
        this.images).subscribe((response) => {
        console.log(response)
      });
    });
  }

}
