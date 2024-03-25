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
    //brand._id corresponde al newName de la marca
    this.service.getBrandByName(brand._id).subscribe((response) => {
      if(response._id === undefined){
        if(brand._id.trim() !== ''){
          this.sweetAlertService.showConfirmationAlert(
            'Confirmación',
            '¿Está seguro que desea editar esta marca?',
            () => {
              this.service.updateBrandByName(brand.name, brand._id).subscribe((response) => {
                this.sweetAlertService.showAlert('Éxito', 'La marca fue editada correctamente.', 'success');
              },
              (error) => {
                this.sweetAlertService.showAlert('Error', 'Hubo un error al editar los datos.', 'error');
              });
            },
            () => {
              location.reload();
            }
          );
        }else{
          this.sweetAlertService.showAlert('Error', 'No puede registrar una marca vacía.', 'error');
        }
      }else{
        this.sweetAlertService.showAlert('Atención', 'Esta marca ya está registrada.', 'info');
      }
    });
  }

  deleteBrand(brand: Brands) {
    this.sweetAlertService.showConfirmationAlert(
      'Confirmación',
      `¿Está seguro que desea eliminar la marca ${brand.name}? Asegúrese que no existan productos de esta marca.`,
      () => {
        this.service.deleteBrandByName(brand.name).subscribe((response) => {
          this.sweetAlertService.showAlert('Éxito', 'La marca fue eliminada correctamente.', 'success');
        },
        (error) => {
          this.sweetAlertService.showAlert('Error', 'Hubo un error al eliminar los datos.', 'error');
        });
      }
    );
  }

  editType(type: Types) {
    //type._id corresponde al newName del tipo
    this.service.getTypeByName(type._id).subscribe((response) => {
      if(response._id === undefined){
        if(type._id.trim() !== ''){
          this.sweetAlertService.showConfirmationAlert(
            'Confirmación',
            '¿Está seguro que desea editar este tipo?',
            () => {
              this.service.updateTypeByName(type.name, type._id).subscribe((response) => {
                this.sweetAlertService.showAlert('Éxito', 'El tipo fue editado correctamente.', 'success');
              },
              (error) => {
                this.sweetAlertService.showAlert('Error', 'Hubo un error al editar los datos.', 'error');
              });
            },
            () => {
              location.reload();
            }
          );
        }else{
          this.sweetAlertService.showAlert('Error', 'No puede registrar un tipo vacío.', 'error');
        }
      }else{
        this.sweetAlertService.showAlert('Atención', 'Este tipo ya está registrado.', 'info');
      }
    })
  }


  deleteType(type: Types) {
    this.sweetAlertService.showConfirmationAlert(
      'Confirmación',
      `¿Está seguro que desea eliminar el tipo ${type.name}? Asegúrese que no existan productos de este tipo.`,
      () => {
        this.service.deleteTypeByName(type.name).subscribe((response) => {
          this.sweetAlertService.showAlert('Éxito', 'El tipo fue eliminado correctamente.', 'success');
        },
        (error) => {
          this.sweetAlertService.showAlert('Error', 'Hubo un error al eliminar los datos.', 'error');
        });
      }
    );
  }

  editCategory(category: Categories) {
    //category._id corresponde al newName de la categoría
    this.service.getCategoryByName(category._id).subscribe((response) => {
      if(response._id === undefined){
        if(category._id.trim() !== ''){
          this.sweetAlertService.showConfirmationAlert(
            'Confirmación',
            '¿Está seguro que desea editar este tipo?',
            () => {
              this.service.updateCategoryByName(category.name, category._id).subscribe((response) => {
                this.sweetAlertService.showAlert('Éxito', 'La categoría fue editada correctamente.', 'success');
              },
              (error) => {
                this.sweetAlertService.showAlert('Error', 'Hubo un error al editar los datos.', 'error');
              });
            },
            () => {
              location.reload();
            }
          );
        }else{
          this.sweetAlertService.showAlert('Error', 'No puede registrar una categoría vacía.', 'error');
        }
      }else{
        this.sweetAlertService.showAlert('Atención', 'Esta categoría ya está registrada.', 'info');
      }
    })
  }

  deleteCategory(category: Categories) {
    this.sweetAlertService.showConfirmationAlert(
      'Confirmación',
      `¿Está seguro que desea eliminar la categoría ${category.name}? Asegúrese que no existan productos de esta categoría.`,
      () => {
        this.service.deleteCategoryByName(category.name).subscribe((response) => {
          this.sweetAlertService.showAlert('Éxito', 'La categoría fue eliminada correctamente.', 'success');
        },
        (error) => {
          this.sweetAlertService.showAlert('Error', 'Hubo un error al eliminar los datos.', 'error');
        });
      },
      () => {
        location.reload();
      }
    );
  }

}
