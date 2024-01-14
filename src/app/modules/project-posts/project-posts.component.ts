import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/shared/service/common.service';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-project-posts',
  templateUrl: './project-posts.component.html',
  styleUrls: ['./project-posts.component.css']
})
export class ProjectPostsComponent {

  menuName: string = "";
  menuId: Number = 0;
  isLoading: boolean = false;
  cards: any = [];
  subscription: any;
  actualCards: any;
  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private projectService: ProjectService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isLoading = true;
      this.menuName = params['menu'];
      if (params['id'] != undefined)
        this.menuId = Number(params['id']);
      this.getPosts();
    });
    this.subscription = this.commonService.getData().subscribe((data: any) => {
      this.isLoading = true;
      setTimeout(() => this.filterPosts(data), 500);
    });
  }
  getPosts() {
    this.cards = [];
    this.projectService.getAllProjectCodePosts().subscribe((data: any) => {
      this.actualCards = data;
      
      if (this.menuId != 0) {
        switch (this.menuName) {
          case "Category": {
            this.cards = this.actualCards.filter((card: any) => card.projectCategoryId == this.menuId);
            break;
          }
          case "Industry": {
            this.cards = this.actualCards.filter((card: any) => card.industryTypeId == this.menuId);
            break;
          }
          case "Technology": {
            this.cards = this.actualCards.filter((card: any) => card.technologyMappingList.some((mapping: any) => mapping.technologyId == this.menuId));
            break;
          }
        }
      }
      else
        this.cards = data;
      this.isLoading = false;
      this.menuId = 0;
    })
  }
  filterPosts(data: any) {
    const filterObj: { [key: string]: { operator: string; value: any } } = {};
    Object.keys(data).forEach(key => {
      if (data[key] != null && data[key] != "") {
        if (key == 'projectCategoryId' || key == 'industryTypeId')
          filterObj[key] = { operator: '==', value: data[key] };
        else if (key == 'price')
          filterObj[key] = { operator: 'between', value: data[key] };
        else
          filterObj[key] = { operator: 'includes', value: data[key] };
      }
    });
    const filteredData = this.actualCards.filter((item: any) =>
      Object.entries(filterObj).every(([field, condition]) => {
        const { operator, value } = condition;
        const itemValue = item[field];

        if (Array.isArray(itemValue) && operator === 'includes') {
          return itemValue.some(v => value.includes(v?.operatingSystemId || v?.technologyId || v?.technologyVersionId));
        } else {
          switch (operator) {
            case '==':
              return item[field] === value;
            case '<=':
              return item[field] <= value;
            case 'includes':
              return value.includes(itemValue);
            case 'between':
              return value[0] <= itemValue && value[1] >= itemValue;
            default:
              return true;
          }
        }
      })
    );
    this.cards = [];
    this.cards = filteredData;
    this.isLoading = false;
    this.cdr.detectChanges();
  }
}
