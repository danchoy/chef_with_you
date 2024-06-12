import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatBadgeModule } from '@angular/material/badge';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HomeComponent } from './components/home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { SettingsComponent } from './components/settings/settings.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { CookbookComponent } from './components/cookbook/cookbook.component';
import { OvenComponent } from './components/oven/oven.component';
import { FridgeComponent } from './components/fridge/fridge.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator'; // add by Dan

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SettingsComponent,
    IngredientsComponent,
    CookbookComponent,
    OvenComponent,
    FridgeComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatMenuModule,
    MatCardModule,
    MatMenuModule,
    MatGridListModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    MatPaginatorModule, // add by Dan
    MatBadgeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    OvenComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
