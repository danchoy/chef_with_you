import { Injectable } from '@angular/core';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { Observable, map, skip } from 'rxjs';
import { IRecipe, IRecipeAndCount, IRecipes } from '../interfaces/recipes.interface';
import { isDevMode } from '@angular/core';
import { ISearchResults } from '../components/fridge/fridge.component';
import * as _ from 'lodash';

export enum QueryTypes {
  recipeBrowse = 'recipe_browse',
  recipeFavs = 'recipe_favs',
  ingredientsBrowse = 'ingredients_browse',
  keywordBrowse = 'keyword_browse'
}

const baseUrl = 'https://fbyx6hg5ef.execute-api.us-east-1.amazonaws.com/supercalifragilisticexpialidocious';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  public savedRecipeIds: number[] = [];
  public activeIngredients: string[] = [];
  public inActiveIngredients: string[] = [];
  public totalRecipeCount: number = 0;

  constructor(private http: HttpClient) { }

  getAll(pageSize: number = 18, pageNum: number): Observable<IRecipe[]> {
    return this.http.get<IRecipeAndCount[]>(baseUrl + `?queryType=${QueryTypes.recipeBrowse}` + `&pageSize=${pageSize}` + `&pageNum=${pageNum}` + `&name=`)
      .pipe(
        map(res => {
          const result: any = [];
          this.totalRecipeCount = res[0].totalCount;
          for (const r of res) {
            console.log(r);
            result.push({
              RecipeId: r.RecipeId,
              Name: r.Name,
              AuthorId: r.AuthorId,
              AuthorName: r.AuthorName,
              CookTime: r.CookTime,
              PrepTime: r.PrepTime,
              TotalTime: r.TotalTime,
              DatePublished: r.DatePublished,
              Images: r.Images,
              RecipeCategory: r.RecipeCategory,
              Keywords: r.Keywords,
              Ingredients: r.Ingredients,
              RecipeInstructions: r.RecipeInstructions
            })
          }
          return result;
        }));
  }

  get(id: any): Observable<IRecipe> {
    // return this.http.get(`${baseUrl}/${id}`);
    return this.http.get<IRecipe>(baseUrl);
  }

  getImage(url: string): Observable<File> {
    // return this.http.get(`${baseUrl}/${id}`);
    return this.http.get<File>(url);
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

  findByName(name: string, pageSize: number, pageNum: number): Observable<IRecipe[]> {
    return this.http.get<IRecipeAndCount[]>(baseUrl + `?name=` + encodeURIComponent(name) + `&queryType=${QueryTypes.recipeBrowse}` + `&pageSize=${pageSize}` + `&pageNum=${pageNum}`)
      .pipe(map(res => {
        const result: any = [];
        this.totalRecipeCount = res[0].totalCount;
        for (const r of res) {
          console.log(r);
          result.push({
            RecipeId: r.RecipeId,
            Name: r.Name,
            AuthorId: r.AuthorId,
            AuthorName: r.AuthorName,
            CookTime: r.CookTime,
            PrepTime: r.PrepTime,
            TotalTime: r.TotalTime,
            DatePublished: r.DatePublished,
            Images: r.Images,
            RecipeCategory: r.RecipeCategory,
            Keywords: r.Keywords,
            Ingredients: r.Ingredients,
            RecipeInstructions: r.RecipeInstructions
          })
        }
        return result;
      }));
  }

  findById(id: number[], pageSize: number): Observable<IRecipe[]> {
    const idString: any = id.join('&recipeId=');
    return this.http.get<IRecipe[]>(baseUrl + `?recipeId=` + idString + `&pageSize=${pageSize}` + `&queryType=${QueryTypes.recipeFavs}`);
  }

  getIngredients(name: string): Observable<ISearchResults[]> {
    return this.http.get<ISearchResults[]>(baseUrl + `?ingredient=` + name + `&queryType=${QueryTypes.ingredientsBrowse}`);
  }
}