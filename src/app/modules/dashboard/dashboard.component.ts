import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/service/common.service';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private projectService: ProjectService) { }

  cards: any = [];
  currentDate: Date = new Date();
  isLoading: Boolean = true;
  ngOnInit(): void {
    this.projectService.getAllProjectCodePosts().subscribe(res=>{
      this.cards = res;
      this.isLoading = false;
    });
  }
}
