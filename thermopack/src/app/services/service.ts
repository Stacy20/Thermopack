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
    const options = {
      params: new HttpParams({
        fromObject: {
          'name': name
        }
      })
    };
    const url = `${this.connectionUrl}brands`;
    return this.http.post<Brands>(url, options)
      .pipe(
        catchError(() => of({} as Brands))
      );
  }

  updateBrandByName(name: string, newName: string): Observable<Brands> {
    const options = {
      params: new HttpParams({
        fromObject: {
          'name': newName
        }
      })
    };
    const url = `${this.connectionUrl}brands/${name}`;
    return this.http.put<Brands>(url, options)
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


}
