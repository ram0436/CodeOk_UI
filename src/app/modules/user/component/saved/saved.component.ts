import { Component, HostListener, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { ProjectService } from "src/app/modules/service/project.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "src/app/modules/user/service/user.service";
import { LoginComponent } from "src/app/modules/user/component/login/login.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonService } from "src/app/shared/service/common.service";

@Component({
  selector: "app-saved",
  templateUrl: "./saved.component.html",
  styleUrls: ["./saved.component.css"],
})
export class SavedComponent {
  ratingsMap: Map<string, { averageRating: number; totalRatings: number }> =
    new Map();

  @Input() isLoading: Boolean = false;
  currentDate: Date = new Date();

  savedCards: any[] = [];
  imagesList: any = [];
  isScrolledDown = false;

  // Pagination properties
  // pageSize = 20;
  currentPage = 0;
  totalPages = 0;
  paginatedCards: any[] = [];
  mainCategories: any = [];
  mainCategory: any;
  imageIndex: number = 0;
  technologies: any = [];
  displayedCardCount: number = 16;

  isFavorite: boolean = false;

  reviewsData: any[] = [];
  averageRating: number = 0;
  totalRatings: number = 0;

  favoriteStatus: { [key: string]: boolean } = {};

  isUserLogedIn: boolean = false;
  dialogRef: MatDialogRef<any> | null = null;

  scrollToTop() {
    const scrollDuration = 300; // Duration of the scroll animation in milliseconds
    const scrollStep = -window.scrollY / (scrollDuration / 15); // Divide the scroll distance into smaller steps

    const scrollAnimation = () => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
        requestAnimationFrame(scrollAnimation); // Continue scrolling until reaching the top
      }
    };

    requestAnimationFrame(scrollAnimation);
  }

  @HostListener("window:scroll", [])
  onScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isScrolledDown = scrollY > 0;
  }

  constructor(
    private router: Router,
    private commonService: CommonService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userService
      .getWishListByUserId(Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          response.forEach((item: any) => {
            const tabRefGuid = item.projectTableRefGuid;
            this.handleDashboardData(tabRefGuid);
          });
        },
        (error: any) => {
          // console.error("API Error:", error);
        }
      );
    this.getAllTechnologies();
  }

  handleDashboardData(tabRefGuid: string) {
    this.projectService.getProjectCodeById(tabRefGuid).subscribe(
      (dashboardResponse: any) => {
        if (Array.isArray(dashboardResponse)) {
          this.savedCards.push(...dashboardResponse);
          this.isLoading = false;
        } else if (
          typeof dashboardResponse === "object" &&
          dashboardResponse !== null
        ) {
          this.savedCards.push(dashboardResponse);
          this.isLoading = false;
        } else {
        }
        this.fetchReviewsData();
      },
      (dashboardError: any) => {
        this.savedCards = [];
        this.isLoading = false;
      }
    );
  }

  fetchReviewsData() {
    for (const postCard of this.savedCards) {
      this.projectService.ProjectRatingData(postCard.tableRefGuid).subscribe(
        (data: any) => {
          postCard.reviewsData = data;
          this.calculateAverageRating(postCard);
        },
        (error) => {
          console.error("Error fetching reviews data:", error);
        }
      );
    }
  }

  calculateAverageRating(postCard: any) {
    const totalReviews = postCard.reviewsData.length;
    let totalRating = 0;

    for (const review of postCard.reviewsData) {
      totalRating += review.rating;
    }

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    this.ratingsMap.set(postCard.tableRefGuid, {
      averageRating: averageRating,
      totalRatings: totalReviews,
    });
  }

  toggleFavorite(event: Event, productId: string) {
    event.preventDefault();
    event.stopPropagation();

    if (localStorage.getItem("id") != null) {
      this.favoriteStatus[productId] = this.favoriteStatus[productId] || false;

      this.favoriteStatus[productId] = !this.favoriteStatus[productId];

      if (this.favoriteStatus[productId]) {
        this.addToWishlist(productId);
      } else {
      }
    } else {
      this.openLoginModal();
    }
  }

  addToWishlist(productId: string) {
    const wishlistItem = {
      id: 0,
      projectTableRefGuid: productId,
      createdBy: localStorage.getItem("id"),
      createdOn: new Date().toISOString(),
    };

    this.userService.addWishList(wishlistItem).subscribe(
      (response: any) => {
        this.showNotification("Post saved successfully");
      },
      (error: any) => {}
    );
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  openLoginModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(LoginComponent, {
      width: "400px",
      panelClass: "custom-dialog-container",
    });

    const dialogRefElement = document.querySelector(".custom-dialog-container");
    if (dialogRefElement) {
      dialogRefElement.setAttribute("style", "margin-top: 85px");
    }

    this.dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem("authToken") != null) this.isUserLogedIn = true;
    });
  }

  truncateTitle(title: string, maxLength: number = 43): string {
    if (title.length <= maxLength) {
      return title;
    } else {
      return title.substring(0, maxLength) + "...";
    }
  }

  getRibbonText(serviceTypeId: number): string {
    switch (serviceTypeId) {
      case 1:
        return "Community";
      case 2:
        return "Standard";
      case 3:
        return "Premium";
      case 4:
        return "Enterprise";
      default:
        return "";
    }
  }

  formatDate(date: any): any {
    const inputDate: Date = new Date(date);
    const daysAgo = moment(this.currentDate).diff(inputDate, "days");

    if (daysAgo >= 0 && daysAgo <= 7) {
      if (daysAgo === 0) {
        return "Today";
      } else if (daysAgo === 1) {
        return "Yesterday";
      } else {
        return daysAgo + " days ago";
      }
    } else {
      return moment(inputDate).format("MMM DD");
    }
  }
  getAllTechnologies() {
    this.commonService.getAllTechnology().subscribe((res) => {
      this.technologies = res;
    });
  }
  getName(id: number) {
    var technology = this.technologies.filter(
      (technology: any) => technology.id == id
    );
    if (technology.length > 0) return technology[0].name;
  }

  getDisplayedTechnologies(postCard: any): any[] {
    return postCard.technologyMappingList.slice(0, 4);
  }
}
