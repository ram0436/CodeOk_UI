import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { CommonService } from 'src/app/shared/service/common.service';
import { ProjectService } from '../service/project.service';
import { UserService } from '../user/service/user.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {

  cardsCount: any[] = new Array(20);
  currentImageIndex: any = 0;
  numericValue: number = 0;
  selectedImage: string = "";
  payload = {
    "id": 0,
    "tableRefGuid": "",
    "name": "",
    "description": "",
    "projectCategoryId": 0,
    "industryTypeId": 0,
    "technologyMappingList": [],
    "technologyVersionMappingList": [],
    "operatingSystemMappingList": [],
    "systemRequirement": "",
    "installationSteps": "",
    "features": "",
    "isMobileResponsive": true,
    "demoURL": "",
    "documentaionURL": "",
    "price": null as number | null,
    "commentForReviewer": "",
    "isApproved": true,
    "isPremium": true,
    "createdBy": 0,
    "createdOn": "2023-09-06T06:37:55.962Z",
    "modifiedBy": 0,
    "modifiedOn": "2023-09-06T06:37:55.962Z"
  }
  currentUploadImageIndex: number = 0;
  allUploadedFiles: any = [];
  imageProgress: boolean = false;
  projectCodeProgress: boolean = false;
  userData: any;
  imageUrl: string = '../../../../../assets/img_not_available.png';
  categoryControl = new FormControl("");
  industryControl = new FormControl("");
  tagCtrl = new FormControl('');
  filteredCategorys!: Observable<{ id: number; name: string; }[]>;
  filteredIndustries!: Observable<{ id: number; name: string; }[]>;
  projectCategories: any = [];
  industryTypes: any = [];
  operatingSystems: any = [];
  technologies: any = [];
  versions: any = [];
  tags: any = [];
  uploadedFiles: any = [];
  technologyMappingList: any = [];
  selectedOs: any;
  selectedTechnology: any;
  selectedVersion: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('fileUpload') fileUpload!: ElementRef
  firstImageUploaded: boolean = false; // Changes made by Hamza

  isInputFocused: boolean = false;

  constructor(private commonService: CommonService, private snackBar: MatSnackBar, private projectService: ProjectService,
    @Inject(DOCUMENT) private document: Document, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.getUserData();
    for (var i = 0; i < this.cardsCount.length; i++) {
      this.cardsCount[i] = "";
    }
    this.getAllProjectCategory();
    this.getAllIndustryTypes();
    this.getAllOperatingSystems();
    this.getAllTechnologies();
  }

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    if (!this.payload.price) {
      this.isInputFocused = false;
    }
  }

  allowOnlyNumbers(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const numericInput = inputValue.replace(/[^0-9.-]/g, '');
    inputElement.value = numericInput;
    this.numericValue = parseFloat(numericInput);
  }
  selectFile() {
    if (this.document) {
      const uploadElement = this.document.getElementById("fileUpload");
      if (uploadElement) {
        uploadElement.click();
      }
    }
  }
  selectImage(event: any): void {
    var files = event.target.files;
    const formData = new FormData();
    this.imageProgress = true;
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    this.projectService.uploadProjectCodeImages(formData).subscribe((data: any) => {
      this.imageProgress = false;
      let imagesLength = data.length;
      let dataIndex = 0;

      for (let j = 0; j < this.cardsCount.length && dataIndex < data.length; j++) {
        if (this.cardsCount[j] === "") {
          this.cardsCount[j] = data[dataIndex];
          dataIndex++;
          imagesLength--;
        }

        // Set firstImageUploaded to true if this is the first image
        if (!this.firstImageUploaded) {
          this.firstImageUploaded = true;
        }
      };
    })
  }
  deleteBackgroundImage(index: any): void {
    for (let i = index; i < this.cardsCount.length - 1; i++) {
      this.cardsCount[i] = this.cardsCount[i + 1];
    }
    this.cardsCount[this.cardsCount.length - 1] = '';
  }
  postAdd() {
    this.payload.isPremium = true;
    this.payload.createdBy = this.userData.id;
    this.payload.createdOn = new Date().toISOString().slice(0, 23);
    this.payload.modifiedBy = this.userData.id;
    this.payload.modifiedOn = new Date().toISOString().slice(0, 23);
    this.payload.price = Number(this.payload.price);
    var payload = this.addAttachmentsPayload(this.payload);
    this.saveProjectCodePost(payload);
  }
  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
  saveProjectCodePost(payload: any) {
    if (this.validatePostForm(payload))
      this.projectService.saveProjectCodePost(payload).subscribe(data => {
        this.showNotification("Post added succesfully");
       // this.router.navigateByUrl('/');
      });
  }
  addAttachmentsPayload(commonPayload: any): any {
    var imageList: { id: number; codeImageURL: any; projectCodeId: number }[] = [];
    var repositoryList: { id: number; codeRepositoryURL: any; projectCodeId: number }[] = [];
    var tags: any = [];
    this.cardsCount.forEach(imageURL => {
      if (imageURL != "")
        imageList.push({ id: 0, codeImageURL: imageURL, projectCodeId: 0 });
    });

    this.uploadedFiles.forEach((file: any) => {
      if (file != "")
        repositoryList.push({ id: 0, codeRepositoryURL: file.url, projectCodeId: 0 });
    })

    this.tags.forEach((tag: any) => {
      tags.push({ id: 0, name: tag, projectCodeId: 0 })
    })
    var payload = Object.assign({}, commonPayload, {
      projectImageList: imageList,
      projectRepositoryList: repositoryList,
      tagList: tags
    });
    return payload;
  }
  getUserData() {
    let userId = localStorage.getItem('id');
    if (userId != null) {
      this.userService.getUserById(Number(userId)).subscribe((res: any) => {
        this.userData = res[0];
        if (this.userData.userImageList.length > 0)
          this.imageUrl = this.userData.userImageList[this.userData.userImageList.length - 1].userImageURL;
      })
    }
  }
  uploadProfilePicture(event: any) {
    var files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    this.userService.uploadProfilePicture(formData).subscribe((data: any) => {
      if (data.length > 0) {
        this.imageUrl = data[0];
        this.userService.getUserById(Number(localStorage.getItem("id"))).subscribe((userData: any) => {
          if (userData.length > 0) {
            userData[0].userImageList.push({ "id": 0, "imageId": "st", "imageURL": data[0], "usersId": Number(localStorage.getItem("id")) });
            this.userService.updateUser(userData[0]).subscribe(res => {
            })
          }
        })
      }
    })
  }
  validatePostForm(payload: any): boolean {
    let flag = false;
    if (payload.name == "")
      this.showNotification("Title is required");
    else if (payload.name.length < 15 || payload.name.length > 50)
      this.showNotification("Title should be min 15 and max of 50 charecters");
    else if (payload.description == "")
      this.showNotification("discription is required");
    else if (payload.description.length < 15 || payload.description.length > 500)
      this.showNotification("discription should be min 15 and max 500 charecters");
    else if (payload.projectImageList.length <= 0)
      this.showNotification("In upload photo, at least 1 photo is required.");
    else
      flag = true;
    return flag;
  }
  selectProfilePicture() {
    if (this.document) {
      const uploadElement = this.document.getElementById("upload");
      if (uploadElement) {
        uploadElement.click();
      }
    }
  }
  filterDropDowns(value: any, data: any): { id: number; name: string }[] {
    var filterValue = "";
    if (typeof value == 'object')
      filterValue = value.name.toLowerCase();
    else
      filterValue = value.toLowerCase();
    return data.filter(
      (brand: any) => brand.name.toLowerCase().indexOf(filterValue) === 0
    );
  }
  displayCategory(brand: any): string {
    return brand.name || "";
  }
  handleCategory(event: any) {
    this.payload.projectCategoryId = event.id;
  }
  handleIndustry(event: any) {
    this.payload.industryTypeId = event.id;
  }
  handleOs(event: any) {
    var operatingSystemMappingList: any = [];
    event.value.forEach((os: any) => {
      let osObj = { id: 0, operatingSystemId: os.id, projectCodeId: 0 }
      operatingSystemMappingList.push(osObj);
    });
    this.payload.operatingSystemMappingList = operatingSystemMappingList;
  }
  handleTechnology(event: any) {
    this.versions = [];
    const observables: any = [];
    this.technologyMappingList = [];
    event.value.forEach((technology: any) => {
      let technologyObj = { id: 0, technologyId: technology.id, projectCodeId: 0 }
      this.technologyMappingList.push(technologyObj);
      observables.push(this.commonService.getVersionByTechnologyId(technology.id));
    });
    this.payload.technologyMappingList = this.technologyMappingList;
    forkJoin(observables).subscribe((responses: any) => {
      this.versions = [].concat(...responses);
    });
  }
  handleVersion(event: any) {
    var technologyVersionMappingList: any = [];
    event.value.forEach((version: any) => {
      let versionObj = { id: 0, technologyVersionId: version.id, projectCodeId: 0 }
      technologyVersionMappingList.push(versionObj);
    });
    this.payload.technologyVersionMappingList = technologyVersionMappingList;
  }
  getAllProjectCategory() {
    this.commonService.getAllProjectCategory().subscribe(res => {
      this.projectCategories = res;
      this.getFilteredProjectCategories();
    })
  }
  getAllIndustryTypes() {
    this.commonService.getAllIndustryType().subscribe(res => {
      this.industryTypes = res;
      this.getFilteredIndustryTypes();
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
  getFilteredProjectCategories() {
    this.filteredCategorys = this.categoryControl.valueChanges.pipe(
      startWith(""),
      map((value) => this.filterDropDowns(value || "", this.projectCategories))
    );
  }
  getFilteredIndustryTypes() {
    this.filteredIndustries = this.industryControl.valueChanges.pipe(
      startWith(""),
      map((value) => this.filterDropDowns(value || "", this.industryTypes))
    );
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  deleteFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  deleteAllFiles(): void {
    this.uploadedFiles = [];
  }
  onClick(event: any) {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }
  selectProjectCode(event: any): void {
    var files = event.target.files;
    const formData = new FormData();
    this.projectCodeProgress = true;
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    this.projectService.uploadProjectCodeImages(formData).subscribe((data: any) => {
      this.projectCodeProgress = false;
      for (let i = 0; i < files.length; i++) {
        this.uploadedFiles.push({ url: data[i], file: files[i] });
      }
    })
  }
}
