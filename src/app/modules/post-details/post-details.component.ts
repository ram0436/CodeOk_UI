import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/shared/service/common.service';
import { ProjectService } from '../service/project.service';

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

  documentationURL: SafeHtml = '';


  constructor(private route: ActivatedRoute, private projectService: ProjectService,
    private commonService: CommonService, private location: Location, private sanitizer: DomSanitizer) { }

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
  }

  formatTags(tagList: any[]): string {
    return tagList?.map(tag => tag.name).join(', ');
  }

  toggleCardContent() {
    this.isContentVisible = !this.isContentVisible;
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
      console.log(this.postDetails);
    })
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
      data.forEach((selectedTechnology: any) => {
        let tech = this.technologies.find((technology: any) => technology.id == selectedTechnology.technologyId);
        if (tech != undefined)
          names = names + tech.name + ',';
      })
    }
    else if (name == 'version') {
      data.forEach((selectedVersion: any) => {
        let version = this.versions.find((version: any) => version.id == selectedVersion.technologyVersionId);
        if (version != undefined)
          names = names + version.name + ',';
      })
    }
    else {
      data.forEach((selectedOs: any) => {
        let os = this.operatingSystems.find((os: any) => os.id == selectedOs.operatingSystemId);
        if (os != undefined)
          names = names + os.name + ',';
      })
    }
    return names;
  }
}


