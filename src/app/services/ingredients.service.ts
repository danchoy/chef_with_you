import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIngredients } from '../interfaces/ingredients.interface';
import { isDevMode } from '@angular/core';

const baseUrl = (isDevMode()) ? 'http://localhost:4200/api/ingredients' : 'http://localhost/api/ingredients';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<IIngredients[]> {
    return this.http.get<IIngredients[]>(baseUrl);
  }

  get(id: any): Observable<IIngredients> {
    // return this.http.get(`${baseUrl}/${id}`);
    return this.http.get<IIngredients>(baseUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<IIngredients[]> {
    return this.http.get<IIngredients[]>(`${baseUrl}?title=${title}`);
  }
}