import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-dashboard-post-card',
  templateUrl: './dashboard-post-card.component.html',
  styleUrls: ['./dashboard-post-card.component.css']
})
export class DashboardPostCardComponent {

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
    technologies : any= [];
    displayedCardCount: number = 16;

    isScrolledDown = false;

    isFavorite: boolean = false;

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

    constructor(private router: Router, private commonService: CommonService) { }

    ngOnInit() {
        this.getAllTechnologies();
     }

     toggleFavorite(event: Event) {
        event.preventDefault(); 
        event.stopPropagation();
        this.isFavorite = !this.isFavorite;
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
            return moment(inputDate).format('MMM DD');
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
        } else if (card.sportImageList && card.sportImageList[0]?.imageURL) {
            return card.sportImageList[0]?.imageURL;
        } else if (card.petImageList && card.petImageList[0]?.imageURL) {
            return card.petImageList[0]?.imageURL;
        } else if (card.fashionImageList && card.fashionImageList[0]?.imageURL) {
            return card.fashionImageList[0]?.imageURL;
        } else if (card.bookImageList && card.bookImageList[0]?.imageURL) {
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
    }
}
