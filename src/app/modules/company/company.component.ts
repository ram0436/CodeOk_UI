import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent {

  activeTab: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const tabParam = params['tab'];
      this.activeTab = tabParam ? tabParam.toLowerCase() : '';
    });
  }

  onTabChange(event: any): void {
    const selectedTabLabel = event.tab.textLabel.toLowerCase();
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { tab: selectedTabLabel },
      queryParamsHandling: 'merge',
    });
  }

  getTabIndex(){
    const tabName = this.activatedRoute.snapshot.queryParamMap.get('tab');
    switch (tabName) {
      case 'about':
        return 0;
      case 'policies':
        return 1;
      case 'safety':
        return 2;
      case 'premium service':
        return 3;
      case 'contact us':
        return 4;
      default:
        return 0;
    }
  }

}
