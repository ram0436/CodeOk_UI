import { Component, HostListener, Input, Renderer2 } from "@angular/core";
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
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.renderer.listen("window", "resize", (event) => {});
    this.getAllTechnologies();
    this.fetchPostsData();
    this.fetchReviewsData();
    this.updateCards(this.cards);
  }

  updateCards(cards: any) {
    for (var i = 0; i < cards.length; i++) {
      cards[i].imageIndex = 0;
    }
  }

  getCardImageURL(card: any): string {
    this.imagesList = [];
    if (
      card.projectImageList &&
      card.projectImageList[card.imageIndex]?.codeImageURL
    ) {
      this.imagesList = card.projectImageList;
      return card.projectImageList[card.imageIndex]?.codeImageURL;
    } else {
      return "../../../assets/image_not_available.jpg";
    }
  }

  showPrevious(event: Event, card: any) {
    event.preventDefault();
    event.stopPropagation();
    if (card.imageIndex > 0) {
      card.imageIndex = card.imageIndex - 1;
      this.getCardImageURL(card);
    }
  }
  showNext(event: Event, card: any) {
    event.preventDefault();
    event.stopPropagation();

    const totalImages =
      (card.projectImageList && card.projectImageList.length) || 0;

    if (card.imageIndex < totalImages - 1) {
      card.imageIndex = card.imageIndex + 1;
      this.getCardImageURL(card);
    }
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
    const maxWidth = 1520;
    const availableWidth = window.innerWidth;

    const midWidth = 1380;

    const smWidth = 510;

    // Adjust maxLength based on available width
    if (availableWidth <= maxWidth) {
      maxLength = 36;
    }

    if (availableWidth <= midWidth) {
      maxLength = 29;
    }

    if (availableWidth <= smWidth) {
      maxLength = 32;
    }

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
    const maxWidth = 1090;
    const minWidth = 510;
    const availableWidth = window.innerWidth;

    if (availableWidth <= maxWidth) {
      return postCard.technologyMappingList.slice(0, 2);
    }
    if (availableWidth <= minWidth) {
      return postCard.technologyMappingList.slice(0, 3);
    } else {
      return postCard.technologyMappingList.slice(0, 3);
    }
  }
  getDisplayedTechnologiesVersion(postCard: any): any[] {
    const maxWidth = 1090;
    const minWidth = 510;
    const availableWidth = window.innerWidth;
    if (availableWidth <= maxWidth) {
      return postCard.technologyVersionMappingList.slice(0, 2);
    }
    if (availableWidth <= minWidth) {
      return postCard.technologyVersionMappingList.slice(0, 3);
    } else {
      return postCard.technologyVersionMappingList.slice(0, 3);
    }
  }
  getDisplayedTechnologiesFramework(postCard: any): any[] {
    const maxWidth = 1090;
    const minWidth = 510;
    const availableWidth = window.innerWidth;
    if (availableWidth <= maxWidth) {
      return postCard.technologyFrameworkMappingList.slice(0, 2);
    }
    if (availableWidth <= minWidth) {
      return postCard.technologyFrameworkMappingList.slice(0, 3);
    } else {
      return postCard.technologyFrameworkMappingList.slice(0, 3);
    }
  }
  getDisplayedTags(postCard: any): any[] {
    return postCard.tagList.slice(0, 5);
  }
}
