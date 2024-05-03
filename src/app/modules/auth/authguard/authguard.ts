import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const userRole = localStorage.getItem("role");
    const allowedAdminRoutes = ["admin"];
    const allowedUserRoutes = [""];
    const commonRoutes = [
      "post-menu",
      "Gadgets",
      "add-post",
      "view-posts",
      "post-details/:id",
      "Vehicles",
      "Electronics & Appliances",
      "Furniture",
      "Sports & Hobbies",
      "user",
      "user/account",
      "user/account/personal",
      "user/account/myadds",
      "user/account/security",
      "user/account/mywishlist",
      "user/account/feedback",
    ];
    const requestedRoute = route.routeConfig?.path || "";
    if (userRole == "Admin") {
      if (allowedAdminRoutes.includes(requestedRoute)) {
        return true;
      } else if (commonRoutes.includes(requestedRoute)) return true;
      else {
        this.router.navigate(["/"]);
        return false;
      }
    } else if (
      userRole == "Buyer" ||
      userRole == "Seller" ||
      userRole == "User"
    ) {
      if (allowedUserRoutes.includes(requestedRoute)) {
        return true;
      } else if (commonRoutes.includes(requestedRoute)) return true;
      else {
        this.router.navigate(["/"]);
        return false;
      }
    } else {
      this.router.navigate(["/"]);
      return false;
    }
  }
}
