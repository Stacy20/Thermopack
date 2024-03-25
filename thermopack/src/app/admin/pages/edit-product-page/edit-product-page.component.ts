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

@Component({
    selector: 'admin-edit-product-page',
    standalone: true,
    templateUrl: './edit-product-page.component.html',
    styles: ``,
    imports: [ConfigGalleryComponent, NavbarComponent, UnderConstructionComponent, FormsModule, SelectTypeComponent, CommonModule]
})
export class EditProductPageComponent {
  constructor(
    private service: MainService,
    private route: ActivatedRoute,
    private sweetAlertService: SweetAlertService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!this.service.isLoggedIn){ this.router.navigate(['/login']); }
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
    this.images[index] = '';
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
          this.service.updateProductByName(this.originalName, this.name, this.description,
            this.brands[this.selectedBrand]._id, this.types[this.selectedType]._id, this.price,
            this.categories[this.selectedCategory]._id, this.categories[this.selectedSubCategory]._id,
            this.images).subscribe((response) => {
            this.sweetAlertService.showAlert('Éxito', 'Los datos se han guardado correctamente', 'success');
      });
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
    for (let i = 0; i < this.imagesPast.length; i++) {
      if(this.imagesPast[i]!==this.images[i]){
        break;
      }
      else {
        return false;
      }
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
