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
    //brand._id corresponde al newName de la marca
    this.service.getBrandByName(brand._id).subscribe((response) => {
      if(response._id === undefined){
        if(brand._id.trim() !== ''){
          this.service.updateBrandByName(brand.name, brand._id).subscribe((response) => {
            alert('Marca editada'); //TODO Alert
          });
        }else{
          alert('No puede registrar una marca vacía.'); //TODO Alert
        }
      }else{
        alert('Esta marca ya está registrada.'); //TODO Alert
      }
    });
  }

  deleteBrand(brand: Brands) {
    this.service.deleteBrandByName(brand.name).subscribe((response) => {
      console.log(response);
      alert('Marca eliminada');
    })
  }

  editType(type: Types) {
    //type._id corresponde al newName del tipo
    this.service.getTypeByName(type._id).subscribe((response) => {
      if(response._id === undefined){
        if(type._id.trim() !== ''){
          this.service.updateTypeByName(type.name, type._id).subscribe((response) => {
            alert('Tipo editado'); //TODO Alert
          });
        }else{
          alert('No puede registrar un tipo vacío.'); //TODO Alert
        }
      }else{
        alert('Este tipo ya está registrado.'); //TODO Alert
      }
    })
  }

  deleteType(type: Types) {
    this.service.deleteTypeByName(type.name).subscribe((response) => {
      console.log(response);
      alert('Tipo eliminado');
    })
  }

  editCategory(category: Categories) {
    //category._id corresponde al newName de la categoría
    this.service.getCategoryByName(category._id).subscribe((response) => {
      if(response._id === undefined){
        if(category._id.trim() !== ''){
          this.service.updateCategoryByName(category.name, category._id).subscribe((response) => {
            alert('Categoría editada'); //TODO Alert
          });
        }else{
          alert('No puede registrar una categoría vacía.'); //TODO Alert
        }
      }else{
        alert('Esta categoría ya está registrada.'); //TODO Alert
      }
    })
  }

  deleteCategory(category: Categories) {
    this.service.deleteCategoryByName(category.name).subscribe((response) => {
      console.log(response);
      alert('Categoría eliminada');
    })
  }

}
