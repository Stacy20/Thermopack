import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError} from 'rxjs';
import { Brands } from '../interfaces/brands.interface';
import { Categories } from '../interfaces/categories.interface';
import { Users, DBResponse } from '../interfaces/users.interface';
import { Types } from '../interfaces/types.interface';
import { Services } from '../interfaces/services.interface';
import { Products } from '../interfaces/products.interface';
import { Privileges } from '../interfaces/privileges.interface';
import { Data } from '../interfaces/data.interface';
import { Contact } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class MainService{
  private connectionUrl: string = 'http://localhost:3000/server/';
  private termSearch?:string;
  private idSelectBrand?:string;
  private idSelectType?:string;
  private idCategory?:string;
  public isLoggedIn:boolean = false;

  //** Varibles de services IMPORTANES para paginacion */
  public services: Services[]=[];
  public totalServices:number=0;
  private _limitService:number=6;
  private _offsetServices: number=0;
  private servicesSubject: BehaviorSubject<{ services: Services[], totalCount: number }> = new BehaviorSubject<{ services: Services[], totalCount: number }>({ services: [], totalCount: 0 });
  public services$: Observable<{ services: Services[], totalCount: number }> = this.servicesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') == 'true';
    const lastLogin = localStorage.getItem('lastLogin');
    this.isLoggedIn = lastLogin && this.hanPasado24MenosHoras(lastLogin) ? this.isLoggedIn : false;
}

  hanPasado24MenosHoras(lastLogin: string): boolean {
    if (!lastLogin) {
      return false;
    }
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - lastLoginDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours < 24;
  }

  login() {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
    const now = new Date();
    const dateTimeString = now.toISOString();
    localStorage.setItem('lastLogin', dateTimeString);
  }


  //** Varibles de products IMPORTANES para paginacion */
  public products: Products[]=[];
  public totalProducts:number=0;
  private _limitProducts:number=9;
  private _offsetProducts: number=0;
  private productsSubject: BehaviorSubject<{ products: Products[], totalCount: number }> = new BehaviorSubject<{ products: Products[], totalCount: number }>({ products: [], totalCount: 0 });
  public products$: Observable<{ products: Products[], totalCount: number }> = this.productsSubject.asObservable();
  //pagination
  public nextPage(id:string):void{
    if(id=="0"){
    this._offsetServices=this._offsetServices+this._limitService;
    this.getServices();
    }else{
      this._offsetProducts=this._offsetProducts+this._limitProducts;
      this.filterProducts(this._limitProducts,this._offsetProducts);
    }
 }

 public pastPage(id:string):void{
  //Servicio
  if(id=="0"){
    if((this._offsetServices-this._limitService)<=this._limitService){
      this._offsetServices=0;
    }
    else{
      this._offsetServices=this._offsetServices-this._limitService;
    }

    this.getServices();
  }
  else{
    console.log('hola desde el server')
    if((this._offsetProducts-this._limitProducts)<=this._limitProducts){
      this._offsetProducts=0;
    }
    else{
      this._offsetProducts=this._offsetProducts-this._limitProducts;
    }

    this.filterProducts(this._limitProducts,this._offsetProducts);
  }

 }
 get offset(): number{
  return this._offsetServices;
  }
  get limit():number{
    return this._limitService
  }
  get offsetProducts(): number{
    return this._offsetProducts;
    }
    get limitProducts():number{
      return this._limitProducts
    }

  // brands

  getAllBrands(): Observable<Brands[]> {
    const url = `${this.connectionUrl}brands`;
    return this.http.get<Brands[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }

  getBrandByName(name: string): Observable<Brands> {
    const url = `${this.connectionUrl}brands/${name}`;
    return this.http.get<Brands>(url)
      .pipe(
        catchError(() => of({} as Brands))
      );
  }

  createBrand(name: string): Observable<Brands> {
    const url = `${this.connectionUrl}brands`;
    return this.http.post<Brands>(url, { name: name })
      .pipe(
        catchError(() => of({} as Brands))
      );
  }

  updateBrandByName(name: string, newName: string): Observable<Brands> {
    const url = `${this.connectionUrl}brands/${name}`;
    return this.http.put<Brands>(url, { name: newName })
      .pipe(
        catchError(() => of({} as Brands))
      );
  }

  deleteBrandByName(name: string): Observable<Brands> {
    const url = `${this.connectionUrl}brands/${name}`;
    return this.http.delete<Brands>(url)
      .pipe(
        catchError(() => of({} as Brands))
      );
  }

  // categories

  getAllCategories(): Observable<Categories[]> {
    const url = `${this.connectionUrl}categories`;
    return this.http.get<Categories[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }

  getCategoryByName(name: string): Observable<Categories> {
    const url = `${this.connectionUrl}categories/${name}`;
    return this.http.get<Categories>(url)
      .pipe(
        catchError(() => of({} as Categories))
      );
  }

  createCategory(name: string): Observable<Categories> {
    const url = `${this.connectionUrl}categories`;
    return this.http.post<Categories>(url, { name: name })
      .pipe(
        catchError(() => of({} as Categories))
      );
  }

  updateCategoryByName(name: string, newName: string): Observable<Categories> {
    const url = `${this.connectionUrl}categories/${name}`;
    return this.http.put<Categories>(url, { name: newName })
      .pipe(
        catchError(() => of({} as Categories))
      );
  }

  deleteCategoryByName(name: string): Observable<Categories> {
    const url = `${this.connectionUrl}categories/${name}`;
    return this.http.delete<Categories>(url)
      .pipe(
        catchError(() => of({} as Categories))
      );
  }

  // types

  getAllTypes(): Observable<Types[]> {
    const url = `${this.connectionUrl}types`;
    return this.http.get<Types[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }

  getTypeByName(name: string): Observable<Types> {
    const url = `${this.connectionUrl}types/${name}`;
    return this.http.get<Types>(url)
      .pipe(
        catchError(() => of({} as Types))
      );
  }

  createType(name: string): Observable<Types> {
    const url = `${this.connectionUrl}types`;
    return this.http.post<Types>(url, { name: name })
      .pipe(
        catchError(() => of({} as Types))
      );
  }

  updateTypeByName(name: string, newName: string): Observable<Types> {
    const url = `${this.connectionUrl}types/${name}`;
    return this.http.put<Types>(url, { name: newName })
      .pipe(
        catchError(() => of({} as Types))
      );
  }

  deleteTypeByName(name: string): Observable<Types> {
    const url = `${this.connectionUrl}types/${name}`;
    return this.http.delete<Types>(url)
      .pipe(
        catchError(() => of({} as Types))
      );
  }

  // privileges

  getAllPrivileges(): Observable<Privileges[]> {
    const url = `${this.connectionUrl}privileges`;
    return this.http.get<Privileges[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }

  getPrivilegeByName(name: string): Observable<Privileges> {
    const url = `${this.connectionUrl}privileges/${name}`;
    return this.http.get<Privileges>(url)
      .pipe(
        catchError(() => of({} as Privileges))
      );
  }

  createPrivilege(name: string): Observable<Privileges> {
    const url = `${this.connectionUrl}privileges`;
    return this.http.post<Privileges>(url, { name: name })
      .pipe(
        catchError(() => of({} as Privileges))
      );
  }

  updatePrivilegeByName(name: string, newName: string): Observable<Privileges> {
    const url = `${this.connectionUrl}privileges/${name}`;
    return this.http.put<Privileges>(url, { name: newName })
      .pipe(
        catchError(() => of({} as Privileges))
      );
  }

  deletePrivilegeByName(name: string): Observable<Privileges> {
    const url = `${this.connectionUrl}privileges/${name}`;
    return this.http.delete<Privileges>(url)
      .pipe(
        catchError(() => of({} as Privileges))
      );
  }

  // users

  getAllUsers(): Observable<Users[]> {
    const url = `${this.connectionUrl}users`;
    return this.http.get<Users[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }

  getUserByEmail(email: string): Observable<Users> {
    const url = `${this.connectionUrl}users/${email}`;
    console.log(url)
    return this.http.get<Users>(url)
      .pipe(
        catchError(() => of({} as Users))
      );
  }

  createUser(email: string, password: string, privileges: number[]): Observable<Users> {
    const url = `${this.connectionUrl}users`;
    return this.http.post<Users>(url, { email, password, privileges })
      .pipe(
        catchError(() => of({} as Users))
      );
  }

  updateUserByEmail(email: string, newEmail: string, password: string, privileges: number[]): Observable<DBResponse> {
    const url = `${this.connectionUrl}users/${email}`;
    return this.http.put<DBResponse>(url, { newEmail, password, privileges })
      .pipe(
        catchError(() => of({} as DBResponse))
      );
  }

  deleteUserByEmail(email: string): Observable<DBResponse> {
    const url = `${this.connectionUrl}users/${email}`;
    return this.http.delete<DBResponse>(url)
      .pipe(
        catchError(() => of({} as DBResponse))
      );
  }

  // services

  getAllServices(): Observable<Services[]> {
    const url = `${this.connectionUrl}services`;
    return this.http.get<Services[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }
// Observable<{ services: Services[], totalCount: number }>
getServices(): void {
  const url = `${this.connectionUrl}services`;
  const params = new HttpParams()
    .set('limit', this._limitService.toString())
    .set('offset', this._offsetServices.toString());

  this.http.get<{ services: Services[], totalCount: number }>(url, { params })
    .pipe(
      catchError(() => of({ services: [], totalCount: 0 })),
      tap((response) => {
        // Actualizar los atributos del servicio con la respuesta del servidor
        this.services = response.services;
        this.totalServices = response.totalCount;
        // Emitir la respuesta a través del observable para que los componentes puedan suscribirse a ella
        this.servicesSubject.next(response);
      })
    )
    .subscribe();
}
  getServiceByName(name: string): Observable<Services> {
    const url = `${this.connectionUrl}services/${name}`;
    return this.http.get<Services>(url)
      .pipe(
        catchError(() => of({} as Services))
      );
  }

  createService(name: string, description: string, price: number, images: string[]): Observable<Services> {
    const url = `${this.connectionUrl}services`;
    return this.http.post<Services>(url, { name, description, price, images })
      .pipe(
        catchError(() => of({} as Services))
      );
  }

  updateServiceByName(name: string, newName: string, description: string, price: number, images: string[]): Observable<Services> {
    const url = `${this.connectionUrl}services/${name}`;
    return this.http.put<Services>(url, { name: newName, description, price, images })
      .pipe(
        catchError(() => of({} as Services))
      );
  }

  deleteServiceByName(name: string): Observable<Services> {
    const url = `${this.connectionUrl}services/${name}`;
    return this.http.delete<Services>(url)
      .pipe(
        catchError(() => of({} as Services))
      );
  }

  // products

  getAllProducts(): Observable<Products[]> {
    const url = `${this.connectionUrl}products`;
    return this.http.get<Products[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }

  getProducts(): void {

    const url = `${this.connectionUrl}products`;
    const params = new HttpParams()
      .set('limit', this._limitProducts.toString())
      .set('offset', this._offsetProducts.toString());

    this.http.get<{ products: Products[], totalCount: number }>(url, { params })
      .pipe(
        catchError(() => of({ products: [], totalCount: 0 })),
        tap((response) => {
          // Actualizar los atributos del servicio con la respuesta del servidor
          this.products = response.products;
          console.log(this.products)
          this.totalProducts = response.totalCount;
          // Emitir la respuesta a través del observable para que los componentes puedan suscribirse a ella
          console.log(this.totalProducts, 'si buenas')
          this.productsSubject.next(response);
        })
      )
      .subscribe();
  }
  getProductByName(name: string): Observable<Products> {
    const url = `${this.connectionUrl}products/${name}`;
    return this.http.get<Products>(url)
      .pipe(
        catchError(() => of({} as Products))
      );
  }
  getProductsByCategoryId(categoryId: string):void{
    const url = `${this.connectionUrl}products/category/${categoryId}`;
    this.http.get<Products[]>(url)
      .pipe(
        catchError(() => of([])),
        tap((response) => {
          // Actualizar los atributos del servicio con la respuesta del servidor
          this.products = response;
        })
      );
  }

  // filterProducts(limit: number, offset: number, brandId ?: string, categoryId?: string, typeId?: string, name?: string): Observable<Products[]> {
  //   let url = `${this.connectionUrl}products?limit=${limit}&offset=${offset}`;
  //   if (brandId) url += `&brandId=${brandId}`;
  //   if (categoryId) url += `&categoryId=${categoryId}`;
  //   if (typeId) url += `&typeId=${typeId}`;
  //   if (name) url += `&name=${name}`;

  //   return this.http.get<Products[]>(url);
  // }

  cleanfilter(){
    this.idSelectBrand=undefined;
    this.idCategory =undefined;
    this.idSelectType=undefined;
    this.termSearch=undefined;
    this.filterProducts(this._limitProducts,this._offsetProducts);

  }
  filterProducts(limit: number, offset: number, brandId ?: string, categoryId?: string, typeId?: string, name?: string): void {
    let url = `${this.connectionUrl}products?limit=${limit}&offset=${offset}`;
    if (brandId || this.idSelectBrand) {
      this.idSelectBrand = brandId || this.idSelectBrand;
      url += `&brandId=${this.idSelectBrand}`;
    }
    if (categoryId || this.idCategory) {
      this.idCategory = categoryId || this.idCategory;
      url += `&categoryId=${this.idCategory}`;
    }
    if (typeId || this.idSelectType) {
      this.idSelectType = typeId || this.idSelectType;
      url += `&typeId=${this.idSelectType}`;
    }
    if (name || this.termSearch) {
      this.termSearch = name || this.termSearch;
      url += `&name=${this.termSearch}`;
    }
    console.log(this.idCategory,this.idSelectBrand,this.idSelectType, this.termSearch)
    this.http.get<{ products: Products[], totalCount: number }>(url)
    .pipe(
      catchError(() => of({ products: [], totalCount: 0 })),
      tap((response) => {
        // Actualizar los atributos del servicio con la respuesta del servidor
        this.products = response.products;
        this.totalProducts = response.totalCount;
        console.log(this.products, 'seleccione desde categorias', this.totalProducts)
        // Emitir la respuesta a través del observable para que los componentes puedan suscribirse a ella
        this.productsSubject.next(response);
      })
    )
    .subscribe();;
  }

  createProduct(name: string, description: string,
                brandId: string, typeId: string , price: number, categoryId: string,
                subcategoryId: string , images: string[]): Observable<Products> {
    const url = `${this.connectionUrl}products`;
    return this.http.post<Products>(url, { name, description, brandId,
                                          typeId , price, categoryId, subcategoryId, images})
      .pipe(
        catchError(() => of({} as Products))
      );
  }

  updateProductByName(name: string, newName: string, description: string,
                      brandId: string, typeId: string , price: number, categoryId: string,
                      subcategoryId: string , images: string[]): Observable<Products> {
    const url = `${this.connectionUrl}products/${name}`;
    return this.http.put<Products>(url, { name: newName, description, brandId,
                                          typeId , price, categoryId, subcategoryId, images})
      .pipe(
        catchError(() => of({} as Products))
      );
  }

  deleteProductByName(name: string): Observable<Products> {
    const url = `${this.connectionUrl}products/${name}`;
    return this.http.delete<Products>(url)
      .pipe(
        catchError(() => of({} as Products))
      );
  }

  // data
  getData(): Observable<Data[]> {
    const url = `${this.connectionUrl}data`;
    return this.http.get<Data[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }


  updateData(slogan: string, description: string, mision: string, vision: string,
              logo: string, visionImages: string[], presentationImages: string[],
              productsTitle: string, productsParagraph: string, servicesTitle: string,
              servicesParagraph: string): Observable<Data> {
    const url = `${this.connectionUrl}data`;
    return this.http.put<Data>(url, { slogan, description, mision, vision, logo, visionImages,
                              presentationImages, productsTitle, productsParagraph, servicesTitle,
                              servicesParagraph,
    })
      .pipe(
        catchError(() => of({} as Data))
      );
  }

  updateMainPage(slogan: string, description: string, mision: string, vision: string,
                  logo: string): Observable<Data> {
    const url = `${this.connectionUrl}data`;
    return this.http.put<Data>(url, { slogan, description, mision, vision, logo})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes devolver un mensaje de error específico
        return throwError('Hubo un error al procesar la solicitud');
      })
    );
  }

  updateMisionImages(visionImages: string[]): Observable<Data> {
    const url = `${this.connectionUrl}data`;
    return this.http.put<Data>(url, { visionImages })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes devolver un mensaje de error específico
        return throwError('Hubo un error al procesar la solicitud');
      })
    );
    }

  updatePresentationImages(presentationImages: string[]): Observable<Data> {
    const url = `${this.connectionUrl}data`;
    return this.http.put<Data>(url, { presentationImages })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes devolver un mensaje de error específico
        return throwError('Hubo un error al procesar la solicitud');
      })
    );
  }

  updateProductsServices(productsTitle: string, productsParagraph: string, servicesTitle: string,
    servicesParagraph: string): Observable<Data> {
    const url = `${this.connectionUrl}data`;
    return this.http.put<Data>(url, {productsTitle, productsParagraph, servicesTitle, servicesParagraph})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes devolver un mensaje de error específico
        return throwError('Hubo un error al procesar la solicitud');
      })
    );
  }

  // contact

  getContactData(): Observable<Contact[]> {
    const url = `${this.connectionUrl}contact`;
    return this.http.get<Contact[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }

  updateContactData(welcomeParagraph: string, ubicationText: string, ubicationGMLink: string, ubicationWazeLink: string,
                    telephoneNumbers: string[], email: string, whatsappLink: string, facebookLink: string,
                    instagramLink: string, youtubeLink: string): Observable<Contact> {
    const url = `${this.connectionUrl}contact`;
    return this.http.put<Contact>(url, { welcomeParagraph, ubicationText, ubicationGMLink, ubicationWazeLink,
                                    telephoneNumbers, email, whatsappLink, facebookLink,
                                    instagramLink, youtubeLink
      })
      .pipe(
        catchError(() => of({} as Contact))
      );
  }

  updateContactImages(images: string[]): Observable<Contact> {
    const url = `${this.connectionUrl}contact`;
    return this.http.put<Contact>(url, { images })
    .pipe(
    catchError(() => of({} as Contact))
    );
  }

}
