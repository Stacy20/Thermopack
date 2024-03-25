import { Component } from '@angular/core';
import { EditListComponent } from "../../components/edit-list/edit-list.component";
import { MainService } from '../../../services/service';
import { Brands } from '../../../interfaces/brands.interface';
import { Types } from '../../../interfaces/types.interface';
import { Categories } from '../../../interfaces/categories.interface';

@Component({
    selector: 'app-admin-categories',
    standalone: true,
    templateUrl: './admin-categories.component.html',
    imports: [EditListComponent]
})
export class AdminCategoriesComponent {

  public brands: Brands[]=[];
  public types: Types[]=[];
  public categories: Categories[]=[];

  constructor(
    private service: MainService,
  ) {}

  ngOnInit() {
    this.getData();;
  }

  getData(): void {
    this.service.getAllBrands().subscribe((brands) => {
      this.brands = brands
    });

    this.service.getAllTypes().subscribe((types) => {
      this.types = types
    });

    this.service.getAllCategories().subscribe((categories) => {
      this.categories = categories
    });
  }

  editBrand(brand: Brands) {
    this.service.updateBrandByName(brand.name, brand._id).subscribe((response) => {
      console.log(response);
      alert('Marca editada');
    })
  }

  deleteBrand(brand: Brands) {
    this.service.deleteBrandByName(brand.name).subscribe((response) => {
      console.log(response);
      alert('Marca eliminada');
    })
  }

  editType(type: Types) {
    this.service.updateTypeByName(type.name, type._id).subscribe((response) => {
      console.log(response);
      alert('Tipo editado');
    })
  }

  deleteType(type: Types) {
    this.service.deleteTypeByName(type.name).subscribe((response) => {
      console.log(response);
      alert('Tipo eliminado');
    })
  }

  editCategory(category: Categories) {
    this.service.updateCategoryByName(category.name, category._id).subscribe((response) => {
      console.log(response);
      alert('Categoría editada');
    })
  }

  deleteCategory(category: Categories) {
    this.service.deleteCategoryByName(category.name).subscribe((response) => {
      console.log(response);
      alert('Categoría eliminada');
    })
  }

}
