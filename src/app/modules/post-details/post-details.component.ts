import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/shared/service/common.service';
import { ProjectService } from '../service/project.service';
import { UserService } from '../user/service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent {

  postDetails: any;
  post: any;
  imagesList: any = [];
  isLoading: boolean = true;
  currentDate: Date = new Date();
  imageIndex: number = 0;
  targetRoute: any;

  isZoomed: boolean = false;
  projectCategories: any = [];
  industryTypes: any = [];
  operatingSystems: any = [];
  technologies: any = [];
  versions: any = [];

  isContentVisible = false;
  isReqVisible = false;
  isTagsVisible = false;
  isRateVisible = false;
  isReviewsVisible = false;
  isDownloadVisible = false;

  documentationURL: SafeHtml = '';

  maxRating: number = 0;
  currentRating: number = 0;

  selectedRating: number = 0;
  reviewText: string = '';

  stars: { filled: boolean; value: number }[] = [];

  reviewsData: any[] = []; 
  averageRating: number = 0;
  totalRatings: number = 0;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private userService: UserService, private snackBar: MatSnackBar, private commonService: CommonService, private location: Location, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getAllProjectCategory();
    this.getAllIndustryTypes();
    this.getAllOperatingSystems();
    this.getAllTechnologies();
    var tableRefGuid;
    this.route.paramMap.subscribe((params) => {
      tableRefGuid = params.get('id');
      this.targetRoute = params.get('targetRoute');
    });
    if (tableRefGuid != null) {
      this.getPostDetails(tableRefGuid);
    }
    this.getRatingData(tableRefGuid);
  }

  getRatingData(tableRefGuid: any){
    this.projectService.ProjectRatingData(tableRefGuid).subscribe(
      (data: any) => {
          this.reviewsData = data;
          this.calculateAverageAndTotalRatings();
        },
        (error: any) => {
        }
    )
  }

  calculateAverageAndTotalRatings() {
    if (this.reviewsData.length > 0) {
      this.totalRatings = this.reviewsData.length;

      const sumOfRatings = this.reviewsData.reduce((total, review) => total + review.rating, 0);
      this.averageRating = sumOfRatings / this.totalRatings;
    }
  }

  parseAverageRating(): number {
    return parseFloat(this.averageRating.toFixed(2));
  }


  handleRatingSelected(rating: number) {
    this.selectedRating = rating;
  }

  
  submitRating(tableRefGuid: string) {
    const userId = localStorage.getItem('id');

    const payload = {
      id: 0,
      projectCodeTableRefGuid: tableRefGuid, 
      rating: this.selectedRating,
      review: this.reviewText,
      createdBy: userId,
      createdOn: new Date().toISOString()
    };

    this.projectService.ProjectRatingReview(payload).subscribe(
      (response) => {
        this.showNotification("Your rating has been submitted succesfully");
      },
      (error) => {
      }
    );
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  formatTags(tagList: any[]): string {
    return tagList?.map(tag => tag.name).join(', ');
  }

  toggleDownloadContent() {
    this.isDownloadVisible = !this.isDownloadVisible;
  }

  toggleCardContent() {
    this.isContentVisible = !this.isContentVisible;
  }

  toggleReviewsContent() {
    this.isReviewsVisible = !this.isReviewsVisible;
  }

  toggleRateContent() {
    this.isRateVisible = !this.isRateVisible;
  }

  toggleReqContent(){
    this.isReqVisible = !this.isReqVisible;
  }

  toggleTagsContent(){
    this.isTagsVisible = !this.isTagsVisible;
  }

  goBack() {
    this.location.back();
  }

  getPostDetails(guid: any) {
    this.projectService.getProjectCodeById(guid).subscribe((res: any) => {
      this.postDetails = res[0];
      this.getVersionsByTechnologyIds(this.postDetails.technologyMappingList);
      const modifiedIframeString = res[0].documentaionURL.replace('width="853"', 'width="350"').replace('height="480"', 'height="250"');
      this.documentationURL = this.sanitizer.bypassSecurityTrustHtml(modifiedIframeString);
      // this.documentationURL = this.sanitizer.bypassSecurityTrustHtml(res[0].documentaionURL);
      this.isLoading = false;
    })
  }

  downloadCode() {
    if (this.postDetails?.projectRepositoryList && this.postDetails.projectRepositoryList.length > 0) {
      const repositoryLink = this.postDetails.projectRepositoryList[0].codeRepositoryURL;
      window.open(repositoryLink, '_blank');
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
        return moment(inputDate).format('MMM YYYY');
    }
}
  getAllProjectCategory() {
    this.commonService.getAllProjectCategory().subscribe(res => {
      this.projectCategories = res;
    })
  }
  getAllIndustryTypes() {
    this.commonService.getAllIndustryType().subscribe(res => {
      this.industryTypes = res;
    })
  }
  getAllOperatingSystems() {
    this.commonService.getAllOperatingSystem().subscribe(res => {
      this.operatingSystems = res;
    })
  }
  getAllTechnologies() {
    this.commonService.getAllTechnology().subscribe(res => {
      this.technologies = res;
    })
  }
  getVersionsByTechnologyIds(technologies: any) {
    this.versions = [];
    const observables: any = [];
    technologies.forEach((technology: any) => {
      observables.push(this.commonService.getVersionByTechnologyId(technology.id));
    });
    forkJoin(observables).subscribe((responses: any) => {
      this.versions = [].concat(...responses);
    });
  }
  getSingleValue(id: any, name: string) {
    var selected: any;
    if (name == 'category')
      selected = this.projectCategories.find((category: any) => category.id == id);
    else
      selected = this.industryTypes.find((industry: any) => industry.id == id);
    if (selected != undefined)
      return selected.name;
  }
  getMultipleValues(data: any, name: string) {
    var names: string = "";
    if (name == 'technology') {
      data.forEach((selectedTechnology: any, index: number) => {
        let tech = this.technologies.find((technology: any) => technology.id == selectedTechnology.technologyId);
        if (tech != undefined) {
          names += tech.name;
          if (index < data.length - 1) {
            names += ', ';
          }
        }
      });
    }
    else if (name == 'version') {
      data.forEach((selectedVersion: any, index: number) => {
        let version = this.versions.find((version: any) => version.id == selectedVersion.technologyVersionId);
        if (version != undefined) {
          names += version.name;
          if (index < data.length - 1) {
            names += ', ';
          }
        }
      });
    }
    else {
      data.forEach((selectedOs: any, index: number) => {
        let os = this.operatingSystems.find((os: any) => os.id == selectedOs.operatingSystemId);
        if (os != undefined) {
          names += os.name;
          if (index < data.length - 1) {
            names += ', ';
          }
        }
      });
    }
    return names;
  }
}


