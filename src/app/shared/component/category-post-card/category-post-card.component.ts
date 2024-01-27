import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonService } from '../../service/common.service';
import { ProjectService } from 'src/app/modules/service/project.service';

@Component({
  selector: 'app-category-post-card',
  templateUrl: './category-post-card.component.html',
  styleUrls: ['./category-post-card.component.css']
})
export class CategoryPostCardComponent {

    ratingsMap: Map<string, { averageRating: number, totalRatings: number }> = new Map();

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
    technologies : any = [];
    displayedCardCount: number = 16;

    isScrolledDown = false;

    isFavorite: boolean = false;

    reviewsData: any[] = []; 
    averageRating: number = 0;
    totalRatings: number = 0;


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
  
    @HostListener('window:scroll', [])
    onScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      this.isScrolledDown = scrollY > 0;
    }
  
    constructor(private router: Router, private commonService: CommonService, private projectService: ProjectService) { }

    ngOnInit() {
      this.getAllTechnologies();
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
            console.error('Error fetching reviews data:', error);
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
        totalRatings: totalReviews
      });
    }

    getRibbonText(serviceTypeId: number): string {
      switch (serviceTypeId) {
        case 1:
          return 'Community';
        case 2:
          return 'Standard';
        case 3:
          return 'Premium';
        case 4:
          return 'Enterprise';
        default:
          return '';
      }
    }

    toggleFavorite(event: Event) {
      event.preventDefault(); 
      event.stopPropagation();
      this.isFavorite = !this.isFavorite;
    }

    truncateTitle(title: string, maxLength: number = 45): string {
      if (title.length <= maxLength) {
        return title;
      } else {
        return title.substring(0, maxLength) + '...';
      }
    }

    loadMoreCards() {
        this.displayedCardCount += 16; // Increase the count for the next set of cards
        this.paginatedCards = this.cards.slice(0, this.displayedCardCount);
      }

    formatDate(date: any): any {
        const inputDate: Date = new Date(date);
        const daysAgo = moment(this.currentDate).diff(inputDate, 'days');

        if (daysAgo >= 0 && daysAgo <= 7) {
            if (daysAgo === 0) {
                return 'Today';
            } else if (daysAgo === 1) {
                return 'Yesterday';
            } else {
                return daysAgo + ' days ago';
            }
        } else {
            return moment(inputDate).format('MMM YYYY');
        }
    }
    getCardImageURL(card: any): string {
        if (card.gadgetImageList && card.gadgetImageList[0]?.imageURL) {
            return card.gadgetImageList[0]?.imageURL;
        } else if (card.vehicleImageList && card.vehicleImageList[0]?.imageURL) {
            return card.vehicleImageList[0]?.imageURL;
        } else if (card.electronicApplianceImageList && card.electronicApplianceImageList[0]?.imageURL) {
            return card.electronicApplianceImageList[0]?.imageURL;
        } else if (card.furnitureImageList && card.furnitureImageList[0]?.imageURL) {
            return card.furnitureImageList[0]?.imageURL;
        }else if (card.sportImageList && card.sportImageList[0]?.imageURL) {
            return card.sportImageList[0]?.imageURL;
        }else if (card.petImageList && card.petImageList[0]?.imageURL) {
            return card.petImageList[0]?.imageURL;
        }else if (card.fashionImageList && card.fashionImageList[0]?.imageURL) {
            return card.fashionImageList[0]?.imageURL;
        }else if (card.bookImageList && card.bookImageList[0]?.imageURL) {
            return card.bookImageList[0]?.imageURL;
        }
        else {
            return '../../../assets/image_not_available.png';
        }
    }
  getAllTechnologies() {
      this.commonService.getAllTechnology().subscribe(res => {
        this.technologies = res;
      })
  };
  getName(id:number){
      var technology = this.technologies.filter((technology:any)=>technology.id==id);
      if(technology.length > 0)
      return technology[0].name;
  };
  getDisplayedTechnologies(postCard: any): any[] {
    return postCard.technologyMappingList.slice(0, 5);
  };
  getDisplayedTags(postCard: any): any[] {
    return postCard.tagList.slice(0, 5);
  };
}
