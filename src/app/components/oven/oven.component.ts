import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Observable, Subscription, combineLatest, map, share, shareReplay, take } from 'rxjs';
import { RecipeService } from 'src/app/services/recipes.service';
import { IRecipes, IRecipe } from 'src/app/interfaces/recipes.interface';
import * as _ from 'lodash';
import { ICardData } from '../home/home.component';

@Component({
  selector: 'app-oven',
  templateUrl: './oven.component.html',
  styleUrls: ['./oven.component.scss']
})
export class OvenComponent implements OnInit {

  public recipeList: IRecipe[] = [];
  public isScreen: boolean = true;
  public panelOpenState: boolean = true;
  public cards: Observable<ICardData[]>;
  public recipeList$: Observable<IRecipe[]>;
  public testEmitter$ = new BehaviorSubject<any | null>(null);
  public rowHeight: string = '';

  @Output() updated = new EventEmitter();

  private subscriptions: Subscription[] = [];
  constructor(private breakpointObserver: BreakpointObserver,
    private recipeService: RecipeService) {
      
      this.recipeList$ = this.recipeService.findById(this.recipeService.savedRecipeIds, 50).pipe(
        map((res: IRecipe[]) => {
          return res;
        })
      );
      this.subscriptions.push(this.recipeList$.subscribe((res: IRecipe[]) => { return res;}));

        this.cards = combineLatest([this.recipeService.findById(this.recipeService.savedRecipeIds, 50), this.breakpointObserver.observe(Breakpoints.Handset)])
        .pipe(
          map(([res, breakpointState]: [IRecipe[], BreakpointState]) => {
            const recipes: any = _.cloneDeep(res);
            this.recipeList = _.cloneDeep(res);
            const cardData = [];
            if (breakpointState.matches) {
              for (let r of recipes) {
                r.Images = JSON.parse(r.Images);
                cardData.push({ title: r.Name, description: r.Images[0], cols: 3, rows: 1, expanded: true, classList: 'Cards Favorite Empty' });
              }
            } else {
              for (let r of recipes) {
                r.Images = JSON.parse(r.Images);
                cardData.push({ title: r.Name, description: r.Images[0], cols: 1, rows: 1, expanded: true, classList: 'Cards Favorite Empty' });
              }
            }
            return cardData;
          }),
          shareReplay()
        );
        this.cards.subscribe((cards: ICardData[]) => {
          this.updated.emit(this.cards);
          return cards;
        });
     }
  ngOnInit(): void {

  }

  ngAfterViewInit() {
    

    
  }

  ngOnDestroy() {
    _.forEach(this.subscriptions, (sub) => sub.unsubscribe());
  }

  public removeRecipe(card: ICardData) {
    const recipe = _.find(this.recipeList, (r) => r.Name === card.title);
    _.remove(this.recipeService.savedRecipeIds, (r) => r === _.get(recipe, 'RecipeId', 0));
    this.cards = this.cards.pipe(
      map((cards: ICardData[]) => {
        _.remove(cards, (c) => c === card);
        return cards;
      })
    );
    // TODO: Remove from backend
  }

  public getSavedRecipes(): boolean {
    return this.recipeService.savedRecipeIds.length > 0;
  }

  public getLink(cardTitle: string) {
    const recipe = _.find(this.recipeList, (r) => r.Name === cardTitle);
    return 'https://www.food.com/recipe/' + cardTitle.replace(' ', '-') + '-' + recipe?.RecipeId;
  }
}
