import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subscription, combineLatest, filter, map, shareReplay, take } from 'rxjs';
import { IIngredients } from 'src/app/interfaces/ingredients.interface';
import { IRecipe } from 'src/app/interfaces/recipes.interface';
import { IngredientsService } from 'src/app/services/ingredients.service';
import { RecipeService } from 'src/app/services/recipes.service';
import { ICardData } from '../home/home.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface ISearchResults {
  Ingredients: string[]
}

@Component({
  selector: 'app-fridge',
  templateUrl: './fridge.component.html',
  styleUrls: ['./fridge.component.scss']
})
export class FridgeComponent implements OnInit {
  public recipeList: IRecipe[] = [];
  public isScreen: boolean = true;
  public panelOpenState: boolean = true;
  public ingredients$: Observable<string[]> = new Observable<string[]>();
  public recipeList$: Observable<IRecipe[]> = new Observable<IRecipe[]>();
  public searchResults: Observable<ISearchResults[]> = new Observable<ISearchResults[]>();
  @Output() emitter = new EventEmitter();
  public rowHeight: string = '';
  public searchValue: string = '';

  private subscriptions: Subscription[] = [];
  constructor(private breakpointObserver: BreakpointObserver,
              private recipeService: RecipeService) {

    this.recipeList$ = this.recipeService.findById(this.recipeService.savedRecipeIds, 50).pipe(
      map((res: IRecipe[]) => {
        console.log(res);
        return res;
      }),
      shareReplay()
    );
    this.subscriptions.push(this.recipeList$.subscribe((res: IRecipe[]) => { return res; }));

    this.ingredients$ = combineLatest([this.recipeService.findById(this.recipeService.savedRecipeIds, 50), this.breakpointObserver.observe(Breakpoints.Handset)])
      .pipe(
        map(([res, breakpointState]: [IRecipe[], BreakpointState]) => {
          const recipes: any = _.cloneDeep(res);
          this.recipeList = _.cloneDeep(res);
          const cardData: any[] = [];
          for (const r of recipes) {
            r.Ingredients = JSON.parse(r.Ingredients);
            for (const i of r.Ingredients) {
              // TODO: Display recipe name here or above for grouping
              this.recipeService.inActiveIngredients.push(i);
              cardData.push(i);
            }
          }
          return cardData;
        }),
        shareReplay()
      );
      this.recipeList$.subscribe((recipe: IRecipe[]) => {
        const recipes: any = _.cloneDeep(recipe);
        for (const r of recipes) {
          r.Ingredients = JSON.parse(r.Ingredients);
          for (const i of r.Ingredients) {
            // TODO: Display recipe name here or above for grouping
           if (!_.includes(this.recipeService.inActiveIngredients, i)) {
            if (!_.includes(this.recipeService.activeIngredients, i)) {
              this.recipeService.inActiveIngredients.push(i);
            }
          }
          }
      }
    });
        
  }
  ngOnInit(): void {
    this.doSearch();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    _.forEach(this.subscriptions, (sub) => sub.unsubscribe());
  }

  public getSavedRecipes(): boolean {
    return this.recipeService.savedRecipeIds.length > 0;
  }

  public doSearch() {
    this.searchResults = this.recipeService.getIngredients(this.searchValue).pipe(
      map((ingredients: ISearchResults[]) => {
        const res: any = _.cloneDeep(ingredients);
        return res;
      }),
      take(1)
    );
    this.searchResults.subscribe((ingredients: ISearchResults[]) => {
      const res = _.cloneDeep(ingredients);
      console.log(ingredients);
    });
  }

  public getIngredients(res: any) {
    let ingredientsArr: any = _.get(res, 'Ingredients', '');
    if (ingredientsArr[0] === '[') {
      ingredientsArr = JSON.parse(_.get(res, 'Ingredients', ''));
    } else {
      ingredientsArr = _.get(res, 'Ingredient', '');
    }
    return (this.searchValue !== '' && !_.isNil(this.searchValue)) ? ingredientsArr : ingredientsArr[0];
  }

  public showOptions(event:MatCheckboxChange, ingredient: string): void {
    if (event.checked && !_.includes(this.recipeService.activeIngredients, ingredient)) {
      this.recipeService.activeIngredients.push(ingredient);
      _.remove(this.recipeService.inActiveIngredients, ingredient);
    } else {
      _.remove(this.recipeService.activeIngredients, (i) => i === ingredient);
    }
  }

  public getInactiveIngredients() {
    return this.recipeService.inActiveIngredients;
  }

  public getActiveIngredients() {
    return this.recipeService.activeIngredients;
  }

  public addIngredients(ingredient: string) {
    _.remove(this.recipeService.inActiveIngredients, (i) => i === ingredient);
    if (!_.includes(this.recipeService.activeIngredients, ingredient)) {
      this.recipeService.activeIngredients.push(ingredient);
    }
  }

  public removeIngredients(ingredient: string) {
    _.remove(this.recipeService.activeIngredients, (i) => i === ingredient);
    if (!_.includes(this.recipeService.inActiveIngredients, ingredient)) {
      this.recipeService.inActiveIngredients.push(ingredient);
    }
  }
}
