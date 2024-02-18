import { Component, HostListener, Input } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { CommonService } from "../../service/common.service";
import { ProjectService } from "src/app/modules/service/project.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "src/app/modules/user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoginComponent } from "src/app/modules/user/component/login/login.component";

@Component({
  selector: "app-category-post-card",
  templateUrl: "./category-post-card.component.html",
  styleUrls: ["./category-post-card.component.css"],
})
export class CategoryPostCardComponent {
  ratingsMap: Map<string, { averageRating: number; totalRatings: number }> =
    new Map();

  @Input() isLoading: Boolean = false;
  @Input() cards: any;
  currentDate: Date = new Date();

  // Pagination properties
  // pageSize = 20;
  currentPage = 0;
  totalPages = 0;
  paginatedCards: any[] = [];
  mainCategories: any = [];
  mainCategory: any;
  imageIndex: number = 0;
  imagesList: any = [1];
  technologies: any = [];
  versions: any = [];
  frameworks: any = [];
  displayedCardCount: number = 16;

  isScrolledDown = false;

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
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getAllTechnologies();
    this.fetchPostsData();
    this.fetchReviewsData();
  }

  fetchReviewsData() {
    for (const postCard of this.cards) {
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

  fetchPostsData() {
    for (const postCard of this.cards) {
      this.getAllTechnologiesVersion(postCard.technologyMappingList);
      this.getAllTechnologiesFramework(postCard.technologyMappingList);
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

  truncateTitle(title: string, maxLength: number = 45): string {
    if (title.length <= maxLength) {
      return title;
    } else {
      return title.substring(0, maxLength) + "...";
    }
  }

  loadMoreCards() {
    this.displayedCardCount += 16; // Increase the count for the next set of cards
    this.paginatedCards = this.cards.slice(0, this.displayedCardCount);
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
      return moment(inputDate).format("MMM YYYY");
    }
  }
  getCardImageURL(card: any): string {
    if (card.gadgetImageList && card.gadgetImageList[0]?.imageURL) {
      return card.gadgetImageList[0]?.imageURL;
    } else if (card.vehicleImageList && card.vehicleImageList[0]?.imageURL) {
      return card.vehicleImageList[0]?.imageURL;
    } else if (
      card.electronicApplianceImageList &&
      card.electronicApplianceImageList[0]?.imageURL
    ) {
      return card.electronicApplianceImageList[0]?.imageURL;
    } else if (
      card.furnitureImageList &&
      card.furnitureImageList[0]?.imageURL
    ) {
      return card.furnitureImageList[0]?.imageURL;
    } else if (card.sportImageList && card.sportImageList[0]?.imageURL) {
      return card.sportImageList[0]?.imageURL;
    } else if (card.petImageList && card.petImageList[0]?.imageURL) {
      return card.petImageList[0]?.imageURL;
    } else if (card.fashionImageList && card.fashionImageList[0]?.imageURL) {
      return card.fashionImageList[0]?.imageURL;
    } else if (card.bookImageList && card.bookImageList[0]?.imageURL) {
      return card.bookImageList[0]?.imageURL;
    } else {
      return "../../../assets/image_not_available.png";
    }
  }
  getAllTechnologies() {
    this.commonService.getAllTechnology().subscribe((res) => {
      this.technologies = res;
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

  getAllTechnologiesVersion(technologies: any) {
    this.versions = [];
    technologies.forEach((technology: any) => {
      this.commonService
        .getVersionByTechnologyId(technology.technologyId)
        .subscribe((response: any) => {
          this.versions.push(...response);
        });
    });
  }
  getAllTechnologiesFramework(technologies: any) {
    this.frameworks = [];
    technologies.forEach((technology: any) => {
      this.projectService
        .getFrameworkByTechnologyId(technology.technologyId)
        .subscribe((response: any) => {
          this.frameworks.push(...response);
        });
    });
  }
  getName(id: number, name: string) {
    if (name == "technology") {
      var technology = this.technologies.filter(
        (technology: any) => technology.id == id
      );
      if (technology.length > 0) return technology[0].name;
    } else if (name == "version") {
      var version = this.versions.filter((version: any) => version.id == id);
      if (version.length > 0) return version[0].name;
    } else if (name == "framework") {
      var framework = this.frameworks.filter(
        (framework: any) => framework.id == id
      );
      if (framework.length > 0) return framework[0].name;
    }
  }
  getDisplayedTechnologies(postCard: any): any[] {
    return postCard.technologyMappingList.slice(0, 5);
  }
  getDisplayedTechnologiesVersion(postCard: any): any[] {
    return postCard.technologyVersionMappingList.slice(0, 5);
  }
  getDisplayedTechnologiesFramework(postCard: any): any[] {
    return postCard.technologyFrameworkMappingList.slice(0, 5);
  }
  getDisplayedTags(postCard: any): any[] {
    return postCard.tagList.slice(0, 5);
  }
}
