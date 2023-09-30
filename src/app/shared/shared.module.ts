import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderComponent } from './component/header/header.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './component/footer/footer.component';
import { LocationsComponent } from './component/locations/locations.component';
import { StarRatingComponent } from './component/star-rating/star-rating.component';
import { DashboardPostCardComponent } from './component/dashboard-post-card/dashboard-post-card.component';
import { CategoryPostCardComponent } from './component/category-post-card/category-post-card.component';
import { PricingPlansComponent } from './component/pricing-plans/pricing-plans.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LocationsComponent,
    StarRatingComponent,
    DashboardPostCardComponent,
    CategoryPostCardComponent,
    PricingPlansComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    MatMenuModule,
    MatSnackBarModule,
    RouterModule
  ],
  exports : [
    HeaderComponent,
    FooterComponent,
    LocationsComponent,
    StarRatingComponent,
    DashboardPostCardComponent,
    CategoryPostCardComponent,
    PricingPlansComponent
  ]
})
export class SharedModule { }
