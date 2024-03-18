import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap} from 'rxjs';
import { Brands } from '../interfaces/brands.interface';
import { Categories } from '../interfaces/categories.interface';
import { Users } from '../interfaces/users.interface';
import { Types } from '../interfaces/types.interface';
import { Services } from '../interfaces/services.interface';
import { Products } from '../interfaces/products.interface';
import { Privileges } from '../interfaces/privileges.interface';
import { Data } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class MainService{
  private connectionUrl: string = 'http://localhost:3000/server/';

  constructor(private http: HttpClient) { }

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
    return this.http.get<Users>(url)
      .pipe(
        catchError(() => of({} as Users))
      );
  }

  createUser(email: string, password: string, privileges: string[]): Observable<Users> {
    const url = `${this.connectionUrl}users`;
    return this.http.post<Users>(url, { email, password, privileges })
      .pipe(
        catchError(() => of({} as Users))
      );
  }

  updateUserByEmail(email: string, newEmail: string, password: string, privileges: string[]): Observable<Users> {
    const url = `${this.connectionUrl}users/${email}`;
    return this.http.put<Users>(url, { newEmail, password, privileges })
      .pipe(
        catchError(() => of({} as Users))
      );
  }

  deleteUserByEmail(email: string): Observable<Users> {
    const url = `${this.connectionUrl}users/${email}`;
    return this.http.delete<Users>(url)
      .pipe(
        catchError(() => of({} as Users))
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

  getProductByName(name: string): Observable<Products> {
    const url = `${this.connectionUrl}products/${name}`;
    return this.http.get<Products>(url)
      .pipe(
        catchError(() => of({} as Products))
      );
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
    catchError(() => of({} as Data))
    );
  }

}
