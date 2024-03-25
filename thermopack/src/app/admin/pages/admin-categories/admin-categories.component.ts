import { Component } from '@angular/core';
import { EditListComponent } from "../../components/edit-list/edit-list.component";
import { MainService } from '../../../services/service';
import { Brands } from '../../../interfaces/brands.interface';
import { Types } from '../../../interfaces/types.interface';
import { Categories } from '../../../interfaces/categories.interface';
import { SweetAlertService } from '../../services/sweet-alert.service';

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
    private sweetAlertService: SweetAlertService,
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
    this.sweetAlertService.showConfirmationAlert(
      'Confirmación',
      '¿Está seguro que desea realizar cambios?',
      () => {
      this.service.updateBrandByName(brand.name, brand._id).subscribe((response) => {
        console.log(response);
        this.sweetAlertService.showAlert('Éxito', 'Los datos se han guardado correctamente', 'success');
      })
  });
  }

  deleteBrand(brand: Brands) {
    this.sweetAlertService.showConfirmationAlert(
      'Confirmación',
      '¿Está seguro que desea eliminar la marca' + brand.name,
      () => {
    this.service.deleteBrandByName(brand.name).subscribe((response) => {
      console.log(response);
      this.sweetAlertService.showAlert('Éxito', 'La marca'+  brand.name +'se ha eliminado correctamente', 'success');
    })
  });
  }

  editType(type: Types) {
    this.sweetAlertService.showConfirmationAlert(
      'Confirmación',
      '¿Está seguro que desea realizar cambios?',
      () => {
    this.service.updateTypeByName(type.name, type._id).subscribe((response) => {
      console.log(response);
      this.sweetAlertService.showAlert('Éxito', 'Los datos se han guardado correctamente', 'success');
    })
  });
  }

  deleteType(type: Types) {
    this.sweetAlertService.showConfirmationAlert(
      'Confirmación',
      '¿Está seguro que desea eliminar el tipo' + type.name,
      () => {
    this.service.deleteTypeByName(type.name).subscribe((response) => {
      console.log(response);
      this.sweetAlertService.showAlert('Éxito', 'El tipo'+  type.name +'se ha eliminado correctamente', 'success');
    })
  });
  }

  editCategory(category: Categories) {
    this.sweetAlertService.showConfirmationAlert(
      'Confirmación',
      '¿Está seguro que desea realizar cambios?',
      () => {
    this.service.updateCategoryByName(category.name, category._id).subscribe((response) => {
      console.log(response);
      this.sweetAlertService.showAlert('Éxito', 'Los datos se han guardado correctamente', 'success');
    })
  });
  }

  deleteCategory(category: Categories) {
    this.sweetAlertService.showConfirmationAlert(
      'Confirmación',
      '¿Está seguro que desea eliminar la categoría' + category.name,
      () => {
    this.service.deleteCategoryByName(category.name).subscribe((response) => {
      console.log(response);
      this.sweetAlertService.showAlert('Éxito', 'La categoría'+  category.name +'se ha eliminado correctamente', 'success');
    })
  });
  }

}
