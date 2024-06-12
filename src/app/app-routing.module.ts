import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CookbookComponent } from './components/cookbook/cookbook.component';
import { SettingsComponent } from './components/settings/settings.component';
import { OvenComponent } from './components/oven/oven.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { FridgeComponent } from './components/fridge/fridge.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'cookbook', component: CookbookComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'oven', component: OvenComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'fridge', component: FridgeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
