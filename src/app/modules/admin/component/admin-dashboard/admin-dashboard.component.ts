import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CommonService } from 'src/app/shared/service/common.service';
import { ProjectService } from 'src/app/modules/service/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  ratingsMap: Map<string, { averageRating: number, totalRatings: number }> = new Map();

  @Input() isLoading: Boolean = false;
  @Input() cards: any;
  currentDate: Date = new Date();

  // Pagination properties
  // pageSize = 20;
  currentPage = 0;
  totalPages = 0;
  paginatedCards: any[] = [];
  mainCategory: any;
  imageIndex: number = 0;
  imagesList: any = [1];
  technologies : any= [];
  displayedCardCount: number = 16;

  isScrolledDown = false;

  isFavorite: boolean = false;

  reviewsData: any[] = []; 
  averageRating: number = 0;
  totalRatings: number = 0;

  selectedCategoryId! : number;
  allCards: any[] = [];
  mainCategories : any = [];
  title: string = '';
  message: string = '';

  validDescriptionMessage: boolean =false;


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

  constructor(private router: Router, private commonService: CommonService, private projectService: ProjectService,
    private route: ActivatedRoute,  private snackBar: MatSnackBar) { }

  ngOnInit() {
      this.getAllTechnologies();
      this.projectService.getAllProjectCodePosts().subscribe((data: any) => {
        this.allCards = data;
      });
   }



    truncateTitle(title: string, maxLength: number = 15): string {
      if (title.length <= maxLength) {
        return title;
      } else {
        return title.substring(0, maxLength) + '...';
      }
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
      return postCard.technologyMappingList.slice(0, 4);
  };

  getPostDetailsLink(card: any){
    const tableRefGuid = card.tableRefGuid;
  
    if (tableRefGuid != null) {
      return [`/post-details/${tableRefGuid}`];
    }
    else{
      return [``];
    }
  }

  editCard(data: any) {
    localStorage.setItem('guid',data.tableRefGuid);
    let tableRefGuid = data.tableRefGuid;
    if(tableRefGuid != null){
      let navigationUrl = '';
      this.router.navigateByUrl(`/post-details/${tableRefGuid}`);
      }
    }

}
