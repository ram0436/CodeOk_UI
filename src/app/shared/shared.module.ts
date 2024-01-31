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
import { SalesEnquiryComponent } from './component/sales-enquiry/sales-enquiry.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LocationsComponent,
    StarRatingComponent,
    DashboardPostCardComponent,
    CategoryPostCardComponent,
    PricingPlansComponent,
    SalesEnquiryComponent,
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
    RouterModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSelectModule
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
