import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UnderConstructionComponent } from "../../../shared/components/under-construction/under-construction.component";
import { ConfigGalleryComponent } from '../../components/config-gallery/config-gallery.component';
import { FormsModule } from '@angular/forms';
import { MainService } from '../../../services/service';
import { ActivatedRoute, Router } from '@angular/router';
import { Types } from '../../../interfaces/types.interface';
import { SelectTypeComponent } from '../../../shared/components/select-type/select-type.component';
import { CommonModule } from '@angular/common';
import { Brands } from '../../../interfaces/brands.interface';

@Component({
    selector: 'admin-add-product-page',
    standalone: true,
    templateUrl: './add-product-page.component.html',
    styles: ``,
    imports: [ConfigGalleryComponent, NavbarComponent, UnderConstructionComponent, FormsModule, SelectTypeComponent, CommonModule]
})
export class AddProductPageComponent {
  constructor(
    private service: MainService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
    this.getData();;
  }

  public name: string = '';
  public description: string = '';
  public price: number = 0;
  public images: string[] = [];
  public type: string = '';
  public types: Types[]=[];
  public selectedType: number = 0;
  public brand: string = '';
  public brands: Brands[]=[];
  public selectedBrand: number = 0;
  public categories: Brands[]=[];
  public category: string = '';
  public selectedCategory: number = 0;
  public subCategory: string = '';
  public selectedSubCategory: number = 0;

  getData(): void {
    this.service.getAllTypes().subscribe((types) => {
      this.types = types;
      for (let i = 0; i < this.types.length; i++) {
        if (this.types[i]._id == this.type){
          this.selectedType = i;
        }
      }
    });
    this.service.getAllBrands().subscribe((brands) => {
      this.brands = brands;
      for (let i = 0; i < this.brands.length; i++) {
        if (this.brands[i]._id == this.brand){
          this.selectedBrand = i;
        }
      }
    });
    this.service.getAllCategories().subscribe((categories) => {
      this.categories = categories;
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i]._id == this.category){
          this.selectedCategory = i;
        }
        if (this.categories[i]._id == this.subCategory){
          this.selectedSubCategory = i;
        }
      }
    });
  }

  selectType(event: any) {
    this.selectedType = event.target.value;
  }

  selectBrand(event: any) {
    this.selectedBrand = event.target.value;
  }

  selectCategory(event: any) {
    this.selectedCategory = event.target.value;
  }

  selectSubCategory(event: any) {
    this.selectedSubCategory = event.target.value;
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
          this.brands[this.selectedBrand]._id, this.types[this.selectedType]._id, this.price,
          this.categories[this.selectedCategory]._id, this.categories[this.selectedSubCategory]._id,
          this.images).subscribe((response) => {
      console.log(response)
    });
    });
  }



}
