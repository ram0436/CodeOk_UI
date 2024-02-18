import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";
import { PostMenuComponent } from "./modules/post-menu/post-menu.component";
import { AuthGuard } from "./modules/auth/authguard/authguard";
import { AddPostComponent } from "./modules/add-post/add-post.component";
import { ProjectPostsComponent } from "./modules/project-posts/project-posts.component";
import { PostDetailsComponent } from "./modules/post-details/post-details.component";
import { PricingPlansComponent } from "./shared/component/pricing-plans/pricing-plans.component";
import { CompanyComponent } from "./modules/company/company.component";
import { CareerComponent } from "./modules/career/career.component";

const routes: Routes = [
  {
    path: "user",
    loadChildren: () =>
      import("./modules/user/user.module").then((m) => m.UserModule),
    canActivate: [AuthGuard],
  },
  { path: "", component: DashboardComponent },
  { path: "post-menu", component: PostMenuComponent, canActivate: [AuthGuard] },
  { path: "add-post", component: AddPostComponent, canActivate: [AuthGuard] },
  { path: "project-posts", component: ProjectPostsComponent },
  { path: "post-details/:id", component: PostDetailsComponent },
  { path: "pricing-plans", component: PricingPlansComponent },
  { path: "company", component: CompanyComponent },
  { path: "career", component: CareerComponent },
  {
    path: "admin",
    loadChildren: () =>
      import("./modules/admin/admin.module").then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
