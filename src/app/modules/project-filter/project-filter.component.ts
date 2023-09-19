import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { Filter } from 'src/app/shared/model/Filter';
import { CommonService } from 'src/app/shared/service/common.service';

@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.css']
})
export class ProjectFilterComponent {

  filterObj = new Filter();
  categoryControl = new FormControl("");
  industryControl = new FormControl("");
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
  selectedTechnology: any[] = [{ id: 1, name: "Angular" }];
  selectedVersion: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fromPrice = 0;
  toPrice = 0;
  appliedFilters: any = [];
  filtersSelected: boolean = false;
  initialFilters: any;
  menuName: any;
  menuId: any;
  @ViewChild('osMultiSelect') osMultiSelect!: MatSelect;
  @ViewChild('technologyMultiSelect') technologyMultiSelect!: MatSelect;
  @ViewChild('versionMultiSelect') versionMultiSelect!: MatSelect;

  @ViewChild('category') categoryAutocomplete!: MatAutocomplete;
  @ViewChild('industry') industryAutocomplete!: MatAutocomplete;

  constructor(private commonService: CommonService, private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document, private route: ActivatedRoute,) { }

  ngOnInit() {
    this.getAllProjectCategory();
    this.getAllIndustryTypes();
    this.getAllOperatingSystems();
    this.getAllTechnologies();
    this.route.queryParams.subscribe(params => {
      this.menuName = params['menu'];
      if (params['id'] != undefined)
        this.menuId = Number(params['id']);
      setTimeout(() => {
        this.setInitialFilters();
      }, 1000)
    });
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
    this.filterObj.projectCategoryId = (event == null) ? null : event.id;
    this.updateAppliedFilters("projectCategoryId", event.name);
    this.commonService.setData(this.filterObj);
    this.filtersSelected = true;
  }
  handleIndustry(event: any) {
    this.filterObj.industryTypeId = (event == null) ? null : event.id;
    this.updateAppliedFilters("industryTypeId", event.name);
    this.commonService.setData(this.filterObj);
    this.filtersSelected = true;
  }
  handleOs(event: any) {
    let osIds = [];
    this.appliedFilters = this.appliedFilters.filter((item: any) => item.name != 'os');
    for (let value of event.value) {
      osIds.push(value.id);
      this.updateAppliedFilters("os", value.name);
    }
    this.filterObj.operatingSystemMappingList = osIds;
    this.commonService.setData(this.filterObj);
    this.filtersSelected = true;
  }
  handleTechnology(event: any) {
    this.versions = [];
    var technologyIds: any = [];
    const observables: any = [];
    this.appliedFilters = this.appliedFilters.filter((item: any) => item.name != 'technology');
    this.appliedFilters = this.appliedFilters.filter((item: any) => item.name != 'version');
    this.technologyMappingList = [];
    this.filterObj.technologyVersionMappingList = null;
    event.value.forEach((technology: any) => {
      let technologyObj = { id: 0, technologyId: technology.id, projectCodeId: 0 }
      this.technologyMappingList.push(technologyObj);
      observables.push(this.commonService.getVersionByTechnologyId(technology.id));
      technologyIds.push(technology.id);
      this.updateAppliedFilters("technology", technology.name);
    });
    this.filterObj.technologyMappingList = technologyIds;
    this.commonService.setData(this.filterObj);
    this.filtersSelected = true;
    forkJoin(observables).subscribe((responses: any) => {
      this.versions = [].concat(...responses);
    });
  }
  handleVersion(event: any) {
    let versionIds = [];
    this.appliedFilters = this.appliedFilters.filter((item: any) => item.name != 'version');
    for (let value of event.value) {
      versionIds.push(value.id);
      this.updateAppliedFilters("version", value.name);
    }
    this.filterObj.technologyVersionMappingList = versionIds;
    this.commonService.setData(this.filterObj);
    this.filtersSelected = true;
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
  priceChange() {
    let prices = [];
    prices.push(Number(this.fromPrice));
    prices.push(Number(this.toPrice));
    this.filterObj.price = prices;
    this.commonService.setData(this.filterObj);
    this.updateAppliedFilters("price", this.formatAmount(this.fromPrice) + " - " + this.formatAmount(this.toPrice));
    this.filtersSelected = true;
  }

  clearFilters() {
    this.filtersSelected = false;
    this.categoryControl.patchValue("");
    this.industryControl.patchValue("");
    this.categoryAutocomplete.options.forEach(option => option.deselect());
    this.industryAutocomplete.options.forEach(option => option.deselect());
    this.fromPrice = 0;
    this.toPrice = 0;
    this.filterObj = { ...this.initialFilters };
    this.appliedFilters = [];
    this.osMultiSelect.writeValue([]);
    this.technologyMultiSelect.writeValue([]);
    if(this.versionMultiSelect !=undefined)
    this.versionMultiSelect.writeValue([]);
    this.commonService.setData(this.filterObj);
  }
  removeItem(item: any): void {
    const index = this.appliedFilters.indexOf(item);
    if (index >= 0) {
      this.appliedFilters.splice(index, 1);
      this.updateFilterColumns(item);
    }
  }
  updateFilterColumns(filter: any) {
    switch (filter.name) {
      case "technology":
        this.removeOptionFromArray(this.technologyMultiSelect, (this.filterObj.technologyMappingList || []), "name", filter.value);
        this.modifyVersions();
        break;
      case "version":
        this.removeOptionFromArray(this.versionMultiSelect, (this.filterObj.technologyVersionMappingList || []), "name", filter.value);
        break;
      case "os":
        this.removeOptionFromArray(this.osMultiSelect, (this.filterObj.operatingSystemMappingList || []), "name", filter.value);
        break;
      case "projectCategoryId":
        this.resetCategory();
        break;
      case "industryTypeId":
        this.resetIndustry();
        break;
      case "price":
        this.resetPrice();
        break;
    }
    this.commonService.setData(this.filterObj);
  }
  setInitialFilters() {
    this.appliedFilters = [];
    this.versions = [];
    if (this.menuId != null) {
      this.categoryControl.patchValue("");
      this.industryControl.patchValue("");
      switch (this.menuName) {
        case "Category": {
          var selectedCategory = this.projectCategories.find((category: any) => category.id == this.menuId);
          this.categoryControl.patchValue(selectedCategory);
          this.appliedFilters.push({ name: "projectCategoryId", value: selectedCategory.name });
          this.filtersSelected = true;
          this.filterObj.projectCategoryId = this.menuId;
          break;
        }
        case "Industry": {
          var selectedIndustry = this.industryTypes.find((industry: any) => industry.id == this.menuId);
          this.industryControl.patchValue(selectedIndustry);
          this.appliedFilters.push({ name: "industryTypeId", value: selectedCategory.name });
          this.filtersSelected = true;
          this.filterObj.industryTypeId = this.menuId;
          break;
        }
        case "Technology": {
          var technologyIds = [];
          this.selectedTechnology = this.technologies.filter((technology: any) => technology.id == this.menuId);
          this.appliedFilters.push({ name: "technology", value: this.selectedTechnology[0].name });
          this.filtersSelected = true;
          technologyIds.push(this.menuId);
          this.filterObj.technologyVersionMappingList = technologyIds;
          this.commonService.getVersionByTechnologyId(this.menuId).subscribe(res=>{
            this.versions =res;
          })
          break;
        }
      }
    }
  }
  updateAppliedFilters(filterName: string, value: any) {
    let matchFound = false;
    for (let i = 0; i < this.appliedFilters.length; i++) {
      if (this.appliedFilters[i].name == filterName && (filterName == 'projectCategoryId' || filterName == 'industryTypeId' || filterName == 'price')) {
        matchFound = true;
        (value == null) ? this.appliedFilters.splice(i, 1) : this.appliedFilters[i].value = value;
        break;
      }
    }
    if (!matchFound)
      this.appliedFilters.push({ name: filterName, value: value })
  }
  formatAmount(amount: number): string {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  resetCategory() {
    this.categoryControl.patchValue("");
    this.filterObj.projectCategoryId = null;
    this.categoryAutocomplete.options.forEach(option => option.deselect());
  }
  resetIndustry() {
    this.industryControl.patchValue("");
    this.filterObj.industryTypeId = null;
    this.industryAutocomplete.options.forEach(option => option.deselect());
  }
  resetPrice() {
    this.fromPrice = 0;
    this.toPrice = 0;
    this.filterObj.price = null;
  }
  removeOptionFromArray(select: any, dataArray: any[], key: string | null, value: any) {
    const selectedOptions = select.value as any[];
    const index = selectedOptions.findIndex((option: any) => {
      if (key) {
        return option[key].toLowerCase() === value.toLowerCase();
      } else {
        return option === value;
      }
    });
    const deleteIndex = dataArray?.indexOf(selectedOptions[index].id);
    if (deleteIndex !== -1 && deleteIndex !== undefined) {
      dataArray?.splice(deleteIndex, 1);
    }
    if (index !== -1) {
      selectedOptions.splice(index, 1);
      select.writeValue(selectedOptions);
    }
  }
  modifyVersions(){
    const observables: any = [];
    this.versions = [];
    this.selectedTechnology.forEach((technology: any) => {
      observables.push(this.commonService.getVersionByTechnologyId(technology.id));
    });
    forkJoin(observables).subscribe((responses: any) => {
      this.versions = [].concat(...responses);
    });
    this.filterObj.technologyVersionMappingList = null;
    this.appliedFilters = this.appliedFilters.filter((item: any) => item.name != 'version');
  }
}
