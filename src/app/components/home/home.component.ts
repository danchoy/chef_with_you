import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Observable, Subject, Subscription, combineLatest, map, share, shareReplay, take } from 'rxjs';
import { RecipeService } from 'src/app/services/recipes.service';
import { IRecipes, IRecipe } from 'src/app/interfaces/recipes.interface';
import * as _ from 'lodash';
import { ThisReceiver } from '@angular/compiler';

import { MatPaginator } from '@angular/material/paginator'; // add by Dan


export interface ICardData {
  title: string,
  description: string,
  cols?: number,
  rows?: number,
  expanded: boolean,
  classList?: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator; // add by Dan

  public paginatedCards$: Observable<ICardData[]> = new Observable<ICardData[]>(); // add by Dan
  public pageSize: number = 18; // add by Dan
  public pageIndex: number = 0; // add by Dan

  @Output() updated = new EventEmitter();

  @ViewChild('gridList')
  public gridList!: ElementRef;

  public classList: any = 'Cards Favorite Empty';


  public isScreen: boolean = true;
  public panelOpenState: boolean = true;
  public recipeList: IRecipe[] = [];
  public cards$: Observable<ICardData[]> = new Observable<ICardData[]>();
  public recipeList$: Observable<IRecipe[]> = new Observable<IRecipe[]>();
  public testEmitter$ = new BehaviorSubject<any | null>(null);
  public rowHeight: string = '';
  public searchValue: string = '';

  private subscriptions: Subscription[] = [];

  constructor(private breakpointObserver: BreakpointObserver,
    private recipeService: RecipeService) {

    this.recipeList$ = (this.searchValue === '') ? this.recipeService.getAll(this.pageSize, this.pageIndex) : this.recipeService.findByName(this.searchValue, this.pageSize, this.pageIndex)
      .pipe(
        map((res: IRecipe[]) => {
          return res;
        }),
        shareReplay()
      );

    this.subscriptions.push(this.recipeList$.pipe().subscribe((res: IRecipe[]) => {
      return res;
    })
    );

    this.cards$ = combineLatest([(this.searchValue === '') ? this.recipeService.getAll(this.pageSize, this.pageIndex) : this.recipeService.findByName(this.searchValue, this.pageSize, this.pageIndex), this.breakpointObserver.observe(Breakpoints.Handset)])
      .pipe(
        map(([res, breakpointState]: [IRecipe[], BreakpointState]) => {
          this.recipeList = _.cloneDeep(res);
          const recipes: any = _.cloneDeep(res);
          console.log(recipes);
          const cardData = [];
          if (breakpointState.matches) {
            for (let r of recipes) {
              r.Images = JSON.parse(r.Images);
              cardData.push({ title: r.Name, description: r.Images[0], cols: 3, rows: 1, expanded: true, classList: (_.includes(this.recipeService.savedRecipeIds, r.RecipeId)) ? 'Cards Favorite Filled' : 'Cards Favorite Empty' });
            }
          } else {
            for (let r of recipes) {
              r.Images = JSON.parse(r.Images);
              cardData.push({ title: r.Name, description: r.Images[0], cols: 1, rows: 1, expanded: true, classList: (_.includes(this.recipeService.savedRecipeIds, r.RecipeId)) ? 'Cards Favorite Filled' : 'Cards Favorite Empty' });
            }
          }
          return cardData
        }),
      );

  }
  ngOnInit(): void { // add by Dan
    this.paginatedCards$ = this.cards$.pipe(
      map(cards => cards.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize))
    );
  }

  public pageChange(event: any) { // add by Dan
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cards$ = combineLatest([
      (this.searchValue === '') ? this.recipeService.getAll(this.pageSize, this.pageIndex) : this.recipeService.findByName(this.searchValue, this.pageSize, this.pageIndex),
      this.breakpointObserver.observe(Breakpoints.Handset)
    ])
      .pipe(
        map(([res, breakpointState]: [IRecipe[], BreakpointState]) => {
          this.recipeList = _.cloneDeep(res);
          const recipes: any = _.cloneDeep(res);
          console.log(recipes)
          const cardData = [];
          if (breakpointState.matches) {
            for (let r of recipes) {
              r.Images = JSON.parse(r.Images);
              const isFavorite = _.includes(this.recipeService.savedRecipeIds, r.RecipeId);
              cardData.push({
                title: r.Name,
                description: r.Images[0],
                cols: 3,
                rows: 1,
                expanded: true,
                classList: isFavorite ? 'Cards Favorite Filled' : 'Cards Favorite Empty'
              });
            }
          } else {
            for (let r of recipes) {
              r.Images = JSON.parse(r.Images);
              const isFavorite = _.includes(this.recipeService.savedRecipeIds, r.RecipeId);
              cardData.push({
                title: r.Name,
                description: r.Images[0],
                cols: 1,
                rows: 1,
                expanded: true,
                classList: isFavorite ? 'Cards Favorite Filled' : 'Cards Favorite Empty'
              });
            }
          }
          return cardData;
        }),
        shareReplay()
      );
      this.cards$.subscribe((cards: ICardData[]) => {
        this.updated.emit(this.cards$);
        this.paginatedCards$ = this.cards$.pipe(
          map(cards => cards)
        );
      });
  }
  ngAfterViewInit() { }

  ngOnDestroy() {
    _.forEach(this.subscriptions, (sub) => sub.unsubscribe());
  }

  public favoriteCard(e: any, cardData: ICardData) {
    if (cardData.classList === 'Cards Favorite Filled') {
      const recipe = _.find(this.recipeList, (r) => r.Name === cardData.title);
      if (_.includes(this.recipeService.savedRecipeIds, _.get(recipe, 'RecipeId', 0))) {
        _.remove(this.recipeService.savedRecipeIds, (r) => r === _.get(recipe, 'RecipeId', 0));
        cardData.classList = 'Cards Favorite Empty';
      }
    } else if (cardData.classList === 'Cards Favorite Empty') {
      const recipe = _.find(this.recipeList, (r) => r.Name === cardData.title);
      if (!_.includes(this.recipeService.savedRecipeIds, _.get(recipe, 'RecipeId', 0))) {
        this.recipeService.savedRecipeIds.push(_.get(recipe, 'RecipeId', 0));
        cardData.classList = 'Cards Favorite Filled';
      }
    }
    e.stopPropagation();
  }

  public getToolTip(classList?: string) {
    return (!_.isNil(classList) && classList === 'Cards Favorite Empty') ? 'Favorite Recipe' : 'Unfavorite Recipe';
  }

  public doSearch() {
    this.pageIndex = 0;
    this.pageSize = 18;

    this.cards$ = combineLatest([
      (this.searchValue === '') ? this.recipeService.getAll(this.pageSize, this.pageIndex) : this.recipeService.findByName(this.searchValue, this.pageSize, this.pageIndex),
      this.breakpointObserver.observe(Breakpoints.Handset)
    ])
      .pipe(
        map(([res, breakpointState]: [IRecipe[], BreakpointState]) => {
          this.recipeList = _.cloneDeep(res);
          const recipes: any = _.cloneDeep(res);
          console.log(recipes)
          const cardData = [];
          if (breakpointState.matches) {
            for (let r of recipes) {
              r.Images = JSON.parse(r.Images);
              const isFavorite = _.includes(this.recipeService.savedRecipeIds, r.RecipeId);
              cardData.push({
                title: r.Name,
                description: r.Images[0],
                cols: 3,
                rows: 1,
                expanded: true,
                classList: isFavorite ? 'Cards Favorite Filled' : 'Cards Favorite Empty'
              });
            }
          } else {
            for (let r of recipes) {
              r.Images = JSON.parse(r.Images);
              const isFavorite = _.includes(this.recipeService.savedRecipeIds, r.RecipeId);
              cardData.push({
                title: r.Name,
                description: r.Images[0],
                cols: 1,
                rows: 1,
                expanded: true,
                classList: isFavorite ? 'Cards Favorite Filled' : 'Cards Favorite Empty'
              });
            }
          }
          return cardData;
        }),
        shareReplay()
      );

    this.cards$.subscribe((cards: ICardData[]) => {
      this.updated.emit(this.cards$);
      this.paginatedCards$ = this.cards$.pipe(
        map(cards => cards.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize))
      );
    });
  }


  public getLink(cardTitle: string) {
    const recipe = _.find(this.recipeList, (r) => r.Name === cardTitle);
    return 'https://www.food.com/recipe/' + cardTitle.replace(' ', '-') + '-' + recipe?.RecipeId;
  }

  public getTotalCount(): number {
    return this.recipeService.totalRecipeCount;
  }

}
