import { Component, HostListener, ViewChild, inject } from '@angular/core';
import * as _ from 'lodash';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, Routes } from '@angular/router';
import { RecipeService } from 'src/app/services/recipes.service';
import { MatDrawer } from '@angular/material/sidenav';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  
  @ViewChild('drawer', { static: false }) public drawer!: MatDrawer;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth < 850 ? this.drawer.close() : this.drawer.open();
  }

  constructor(private router: Router,
                private recipeService:RecipeService) {}

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      }),
      shareReplay()
    );

  public onButtonClick(){
    this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      }),
      shareReplay()
    ).subscribe((result) => {
        if (result) {
          this.drawer.close();
        }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}
  
  public getSavedRecipeCount(): number {
    return this.recipeService.savedRecipeIds.length;
  }

  public noSavedRecipes(): boolean {
    return this.recipeService.savedRecipeIds.length < 1;
  }
 }
