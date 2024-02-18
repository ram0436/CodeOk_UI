import { Component } from "@angular/core";
import { CommonService } from "src/app/shared/service/common.service";
import { ProjectService } from "../service/project.service";
import { UserService } from "../user/service/user.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  messages: any[] = [];

  constructor(
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  cards: any = [];
  currentDate: Date = new Date();
  isLoading: Boolean = true;
  ngOnInit(): void {
    this.projectService.getAllProjectCodePosts().subscribe((res) => {
      this.cards = res;
      this.isLoading = false;
    });

    this.userService.getDashboardMessage().subscribe(
      (data: any[]) => {
        this.messages = data;
      },
      (error: any) => {}
    );

    this.projectService.searchResults$.subscribe((results) => {
      this.cards = results;
    });

    this.projectService.getAllItems$.subscribe((results) => {
      this.cards = results;
    });
  }
}
