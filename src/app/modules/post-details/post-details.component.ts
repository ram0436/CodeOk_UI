import { Location } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/shared/service/common.service';
import { ProjectService } from '../service/project.service';
import { UserService } from '../user/service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLicenseComponent } from 'src/app/shared/component/app-license/app-license.component';

declare var Razorpay: any;

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent {

  dialogRef: MatDialogRef<any> | null = null;

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

  razorpayPaymentId: string = '';
  paymentStatus: boolean = false;

  downloadCount: number = 0;

  serviceTypeData: any = {
    0: {
      items: [
        { label: 'Single App License', price: '100', checked: true },
        { label: 'Multiple App License', price: '300', checked: false }
      ]
    },
    1: {
      items: [
        { label: 'Include one time initial project setup cost', price: '5', checked: false },
        { label: 'Include future project updates', price: '10', checked: false },
        { label: 'Include 3 months customer support', price: '10', checked: false },
        { label: 'Extend customer support for 6 months', price: '15', checked: false },
        { label: 'Extend customer support for 12 months', price: '20', checked: false }
      ]
    },
    2: {
      items: [
        { label: 'Include one time initial project setup cost', price: '5', checked: false},
        { label: 'Include future project updates', price: '10', checked: false },
        { label: 'Include 3 months customer support', price: '10', checked: false },
        { label: 'Extend customer support for 6 months', price: '15', checked: false },
        { label: 'Extend customer support for 12 months', price: '20', checked: false }
      ]
    },
    3: {
      items: [
        { label: 'Include one time initial project setup cost', price: '25', checked: false },
        { label: 'Include future project updates', price: '25', checked: false },
        { label: 'Include 3 months customer support', price: '25', checked: false },
        { label: 'Extend customer support for 6 months', price: '35', checked: false },
        { label: 'Extend customer support for 12 months', price: '45', checked: false }
      ]
    },
    4: {
      items: [
        { label: 'Code quality assured by CodeOKK', checked: true },
        { label: 'Project setup cost included', checked: true },
        { label: 'Future project updates Included', checked: true },
        { label: 'Customer support included', checked: true },
        { label: 'Technical support included', checked: true },
        { label: 'AMC required', checked: true }
      ]
    }
  };

  radioPrice: number = 0;
  checkboxPrice: number = 0;

  showDownloadButton: boolean = false;
  showBuyButton: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private projectService: ProjectService, private userService: UserService, private snackBar: MatSnackBar, private commonService: CommonService, private location: Location, private sanitizer: DomSanitizer, private el: ElementRef) { }

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
      this.checkPaymentStatus(tableRefGuid);
    }
    this.getRatingData(tableRefGuid);
    this.calculateTotal()
    this.getDownloadCount(tableRefGuid);


  }

  checkPaymentStatus(tableRefGuid: any){
    const userId = localStorage.getItem('id');
    this.userService.checkPaymentStatus(tableRefGuid, Number(userId)).subscribe(status => {
      if (status) {
        this.showDownloadButton = true;
      } else {
        this.showBuyButton = true;
      }
    });
  }

  getDownloadCount(tableRefGuid: any){
    this.projectService.downloadCount(tableRefGuid).subscribe(
      (data: any) => {
          this.downloadCount = data;
        },
        (error: any) => {
        }
    )
  }


  onRadioChange(selectedItem: any) {

    this.serviceTypeData[0].items.forEach((item: any) => {
      item.checked = false;
      if (item === selectedItem) {
        this.radioPrice = 0;
        selectedItem.checked = true;
      }
    });

    this.calculateTotal();
  }

  calculateTotal() {

    this.checkboxPrice = 0;

    this.serviceTypeData[0].items.forEach((item: any) => {
      if (item.checked){
        this.radioPrice = parseFloat(item.price);
      }
    });

    for (let key = 1; key < Object.keys(this.serviceTypeData).length; key++) {
      this.serviceTypeData[key].items.forEach((item: any) => {
        if (item.checked && item.price) {
          this.checkboxPrice += parseFloat(item.price);
        }
      });
    }
    
  }

  onCheckboxChange(item: any, serviceTypeId: number) {

    if (item.label === 'Include 3 months customer support' || 
    item.label === 'Extend customer support for 6 months' || 
    item.label === 'Extend customer support for 12 months') {
      this.serviceTypeData[serviceTypeId].items.slice(2).forEach((serviceItem: any) => {
        serviceItem.checked = false;
    });
  }
  
    item.checked = !item.checked;
  
    this.calculateTotal();
  }
   

  openLicenseModal(selectedLicenseType: string) {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  
    this.dialogRef = this.dialog.open(AppLicenseComponent, { 
      width: '500px',
      data: { licenseType: selectedLicenseType }
    });
  } 
  

  payNow() {
    const totalAmount = (this.checkboxPrice + this.radioPrice) * 100;
  
    const RazorpayOptions = {
      description: 'Razorpay',
      currency: 'USD',
      amount: totalAmount,
      name: 'Ram',
      key: 'rzp_test_9Jens2a59xJEKP',
      image: 'https://cfdblob.blob.core.windows.net/logo/CodeOkk_logo.gif',
      theme: {
        color: '#6466e3'
      },
      modal: {
        ondismiss: () => {
        }
      },
      handler: (response: any) => {
        if (response && response.razorpay_payment_id) {
          this.razorpayPaymentId = response.razorpay_payment_id;
          this.paymentStatus = true;
          this.verifyPayment();
          this.checkPaymentStatus(this.postDetails.tableRefGuid);
        } else {
        }
      }
    };
    
  
    const failureCallback = (e: any) => {
      this.razorpayPaymentId = '';
      this.paymentStatus = false;
      this.verifyPayment();
      this.checkPaymentStatus(this.postDetails.tableRefGuid);
    };
  
    const rzp = new Razorpay(RazorpayOptions);
    rzp.on('payment.failed', failureCallback);
  
    rzp.open();

  }

  verifyPayment(){

    const userId = localStorage.getItem('id');

    const tableRefGuid = this.postDetails.tableRefGuid;

    const payload = {
      paymentId: this.razorpayPaymentId,
      projectTableRefGuid: tableRefGuid,
      status: this.paymentStatus, 
      userId: Number(userId),
      createdOn: new Date().toISOString()
    };

    this.userService.makePayment(payload).subscribe(
      (response) => {
        // this.showNotification("Your rating has been submitted succesfully");
      },
      (error) => {
      }
    )

  }
  

  goToCustomerReviews() {
    const customerReviewsElement = this.el.nativeElement.querySelector('#customerReviews');
    this.isReviewsVisible = true;
    if (customerReviewsElement) {
      customerReviewsElement.scrollIntoView();
    }
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
    return parseFloat(this.averageRating.toFixed(1));
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
      const modifiedIframeString = res[0].documentaionURL.replace('width="853"', 'width="280"').replace('height="480"', 'height="180"');
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

    const userId = localStorage.getItem('id');

    const tableRefGuid = this.postDetails.tableRefGuid;

    const payload = {
      tableRefGuid: tableRefGuid,
      createdBy: Number(userId),
      createdOn: new Date().toISOString()
    };


    this.projectService.codeDownload(payload).subscribe(
      (response) => {
      },
      (error) => {
      }
    );

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


