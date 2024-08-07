import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { UserService } from "src/app/modules/user/service/user.service";
import { LoginComponent } from "../../../modules/user/component/login/login.component";
import { SignupComponent } from "../../../modules/user/component/signup/signup.component";
import { GadgetType } from "../../enum/GadgetType";
import { VehicleType } from "../../enum/VehicleType";
import { ElectronicApplianceType } from "../../enum/ElectronicApplianceType";
import { FurnitureType } from "../../enum/FurnitureType";
import { MatIconModule } from "@angular/material/icon";
import { SportType } from "../../enum/SportType";
import { CommonService } from "../../service/common.service";
import { SalesEnquiryComponent } from "../sales-enquiry/sales-enquiry.component";
import { ProjectService } from "src/app/modules/service/project.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  customMatMenuClass = "custom-mat-menu";
  expandIconVisible: boolean = false;
  vehicleTypes = VehicleType;
  gadgetsTypes = GadgetType;
  ElectronicAppliancesTypes = ElectronicApplianceType;
  furnitureTypes = FurnitureType;
  sportTypes = SportType;
  isUserLogedIn: boolean = false;
  userData: any;
  imageUrl: string =
    "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";
  dialogRef: MatDialogRef<any> | null = null;

  isDropdownOpen: { [key: string]: boolean } = {
    allCategories: false,
    projectCategory: false,
    projectType: false,
    languageTech: false,
  };

  searchResults: any[] = [];
  allItems: any[] = [];

  hideSecondNav = false;
  projectCategories: any = [];
  industryTypes: any = [];
  operatingSystems: any = [];
  technologies: any = [];
  versions: any = [];

  searchQuery: string = "";

  locationSearchQuery: string = "";

  isSlideVisible = false;

  isAdmin: boolean = false;
  // Function to handle the scroll event
  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    // Adjust the value (e.g., 200) based on when you want the effect to trigger
    this.hideSecondNav = scrollPosition > 0;
  }

  @HostListener("document:click", ["$event"])
  handleDocumentClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isSlideVisible = false;
    }
  }

  toggleDropdown(dropdownKey: string) {
    if (this.isDropdownOpen[dropdownKey]) {
      this.isDropdownOpen[dropdownKey] = false;
    } else {
      Object.keys(this.isDropdownOpen).forEach((key) => {
        this.isDropdownOpen[key] = false;
      });
      this.isDropdownOpen[dropdownKey] = true;
    }
    // this.toggleExpandIcons(dropdownKey);
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private commonService: CommonService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    var role = localStorage.getItem("role");
    if (role != null && role == "Admin") this.isAdmin = true;
    else this.isAdmin = false;
  }

  @HostListener("document:click", ["$event"])
  onClick(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const dropdownToggle = document.querySelector(
      ".dropdown-toggle"
    ) as HTMLElement;
    const dropdownMenu = document.querySelector(
      ".category-dropdown-menu"
    ) as HTMLElement;

    if (
      this.isDropdownOpen &&
      !this.elementRef.nativeElement.contains(clickedElement) &&
      !dropdownToggle.contains(clickedElement) &&
      !dropdownMenu.contains(clickedElement)
    ) {
      Object.keys(this.isDropdownOpen).forEach((key) => {
        this.isDropdownOpen[key] = false;
      });

      // this.expandIconVisible = false;
    }
  }

  generateGadgetsLink(subCategory?: GadgetType) {
    if (subCategory) {
      return "/Gadgets/view-posts?type=Gadget&sub=" + subCategory;
    } else {
      return "/Gadgets/view-posts?type=Gadget";
    }
  }

  getAllItems() {
    this.projectService.getAllProjectCodePosts().subscribe(
      (allItems: any) => {
        this.allItems = allItems;
      },
      (error) => {}
    );
  }

  search(): void {
    if (this.searchQuery && this.searchQuery.length >= 2) {
      this.projectService.searchAds(this.searchQuery).subscribe(
        (results: any[]) => {
          this.searchResults = results;
        },
        (error) => {}
      );
    } else {
      this.showNotification("Search query should have at least 2 characters");
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  generateQueryParams() {
    const queryParams = {
      type: "Gadget",
      sub: [
        this.gadgetsTypes.Mobiles,
        this.gadgetsTypes.Tablets,
        this.gadgetsTypes.Accessories,
      ],
    };
    return queryParams;
  }

  onEnter() {
    if (this.searchQuery.trim() !== "") {
      this.search();
    } else {
      this.getAllItems();
    }
  }

  onInputChange() {
    if (this.searchQuery.trim() === "") {
      this.getAllItems();
    }
  }

  clearSearchText(): void {
    this.searchQuery = "";
    this.getAllItems();
  }

  clearLocationSearchText(): void {
    this.locationSearchQuery = "";
  }

  ngOnInit() {
    if (localStorage.getItem("authToken") != null) {
      this.isUserLogedIn = true;
      this.getUserData();
    }
    this.userService.getData().subscribe((data) => {
      this.getUserData();
    });
    this.getAllProjectCategory();
    this.getAllIndustryTypes();
    this.getAllTechnologies();
  }

  toggleSlideVisibility() {
    this.isSlideVisible = !this.isSlideVisible;
  }

  openLoginModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(LoginComponent, { width: "500px" });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem("authToken") != null) this.isUserLogedIn = true;
    });
  }
  openSignUpModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(SignupComponent, { width: "500px" });

    this.dialogRef.afterClosed().subscribe((result) => {
      this.isUserLogedIn = false;
    });
  }
  openSalesEnquiryModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(SalesEnquiryComponent, {
      width: "500px",
    });

    // this.dialogRef.afterClosed().subscribe(result => {
    //   this.isUserLogedIn = false;
    // });
  }
  logout() {
    if (localStorage.getItem("authToken") != null) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("userId");
      this.isUserLogedIn = false;
      this.router.navigate(["/"]);
    }
  }
  getUserData() {
    if (localStorage.getItem("id") != null) {
      this.userService
        .getUserById(Number(localStorage.getItem("id")))
        .subscribe((userData: any) => {
          this.userData = userData[0];
          if (this.userData?.userImageList?.length > 0) {
            this.imageUrl =
              this.userData.userImageList[
                this.userData.userImageList.length - 1
              ].userImageURL;
          }
        });
    }
  }

  navigateToPostDetails(postId: string): void {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/post-details", postId]);
    });
  }

  toggleExpandIcons(): void {
    this.expandIconVisible = !this.expandIconVisible;
  }
  postAdd() {
    if (localStorage.getItem("id") != null) this.router.navigate(["/add-post"]);
    else this.openLoginModal();
  }
  getAllProjectCategory() {
    this.commonService.getAllProjectCategory().subscribe((res) => {
      this.projectCategories = res;
    });
  }
  getAllIndustryTypes() {
    this.commonService.getAllIndustryType().subscribe((res) => {
      this.industryTypes = res;
    });
  }
  getAllTechnologies() {
    this.commonService.getAllTechnology().subscribe((res) => {
      this.technologies = res;
    });
  }
}
