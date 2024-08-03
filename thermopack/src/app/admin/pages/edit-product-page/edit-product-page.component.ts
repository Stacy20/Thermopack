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
import { SweetAlertService } from '../../services/sweet-alert.service';

import { Select2Data, Select2Module, Select2UpdateEvent } from 'ng-select2-component';

@Component({
    selector: 'admin-edit-product-page',
    standalone: true,
    templateUrl: './edit-product-page.component.html',
    styles: ``,
    imports: [ConfigGalleryComponent, NavbarComponent, UnderConstructionComponent, FormsModule, SelectTypeComponent, CommonModule, Select2Module]
})
export class EditProductPageComponent {
  constructor(
    private service: MainService,
    private route: ActivatedRoute,
    private sweetAlertService: SweetAlertService,
    private router: Router,
  ) {}

  async ngOnInit() {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
    if (!(await this.service.userCanEdit())) {
      this.router.navigate(['admin/config/home']);
    }
    this.route.paramMap.subscribe(params => {
      this.getData(params.get('id'));;
    });
  }
  public originalName: string = '';
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

  public descriptionPast: string = '';
  public pricePast: number = 0;
  public imagesPast: string[] = [];
  public typePast: string = '';
  public brandPast: string = '';
  public categoryPast: string = '';
  public subCategoryPast: string = '';


  getData(title: string | null): void {
    if (title == null){
      return;
    }

    this.service.getProductByName(title).subscribe((product) => {
      this.name = this.originalName = product.name;
      this.description = product.description;
      this.price = product.price;
      this.brand = product.brandId;
      this.type = product.typeId;
      this.category = product.categoryId;
      this.subCategory = product.subcategoryId;
      this.images = product.images;
      this.imagesPast.push(...product.images)
    });

    this.service.getAllTypes().subscribe((types) => {
      for (let i = 0; i < types.length; i++) {
        this.types[i] = {value: types[i]._id, label: types[i].name};
      }
      this.selectedType = this.type;
    });

    this.service.getAllBrands().subscribe((brands) => {
      for (let i = 0; i < brands.length; i++) {
        this.brands[i] = {value: brands[i]._id, label: brands[i].name};
      }
      this.selectedBrand = this.brand;
    });

    this.service.getAllCategories().subscribe((categories) => {
      for (let i = 0; i < categories.length; i++) {
        this.categories[i] = {value: categories[i]._id, label: categories[i].name};
      }
      this.selectedCategory = this.category;
      this.selectedSubCategory = this.subCategory;
    });
  }

  selectType(event: any) {
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
    this.images.splice(index,1);
    // this.images.splice(index, 1);
  }

  update(){
    if (!this.name ||this.name.trim().length<3 || !this.description||this.description.trim().length<5 ) {
      this.sweetAlertService.showAlert('Error', 'Todos los campos son obligatorios', 'error');
      return; // Detener el proceso si falta algún campo obligatorio
    }
    if (this.images.length<1 ) {
      this.sweetAlertService.showAlert('Error', 'Debe seleccionar una o más imagenes', 'error');
      return; // Detener el proceso si falta algún campo obligatorio
    }
    if(this.hasChanged() ){
      this.service.getProductByName(this.name).subscribe((product) => {
        if (this.name !== this.originalName && Object.keys(product).length !== 0){
          this.sweetAlertService.showAlert('Error', 'Ya existe un producto llamado' + product.name, 'error');
          return;
        }
        else{
          this.service.updateProductByName(this.originalName, this.name.trim(), this.description.trim(),
            this.selectedBrand.value, this.selectedType.value, this.price,
            this.selectedCategory.value, this.selectedSubCategory.value,
            this.images).subscribe((response) => {
              this.sweetAlertService.showAlert('Éxito', 'Los datos se han guardado correctamente', 'success');
            })
        }
      });
    }else{
      this.sweetAlertService.showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info');
    }


  }
  hasChanged(): boolean {
    // Verificar si los campos han sido modificados con respecto a los datos cargados del servidor
    if (
      this.name !== this.originalName ||
      this.description !== this.descriptionPast ||
      this.price !== this.pricePast ||
      this.type !== this.typePast ||
      this.brand !== this.brandPast ||
      this.category !== this.categoryPast ||
      this.subCategory !== this.subCategoryPast|| this.arraysAreEqual()
    ) {
      return true; // Hay cambios
    } else {
      return false; // No hay cambios
    }

  }


  arraysAreEqual(): boolean {
    // Verificar si los elementos de los arrays son iguales
    let flag=0;
    for (let i = 0; i < this.imagesPast.length; i++) {
      if(this.imagesPast[i]!==this.images[i]){
        flag=1;
      }
    }
    if(flag==0){
        return false;
    }
    return true;
  }
  validateInput(event: KeyboardEvent) {
    const inputValue = event.key;

    // Verificar si el valor ingresado es un guión o un signo negativo
    if (inputValue === '-' || inputValue === '-') {
      event.preventDefault(); // Bloquear la entrada del usuario
    }
  }



}
