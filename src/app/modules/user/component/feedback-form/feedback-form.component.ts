import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "./../../../../shared/service/common.service";
import { UserService } from "../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as moment from "moment";

@Component({
  selector: "app-feedback-form",
  templateUrl: "./feedback-form.component.html",
  styleUrls: ["./feedback-form.component.css"],
})
export class FeedbackFormComponent {
  title: string = "";
  message: string = "";

  validTitleMessage: boolean = false;
  validFeedbackMessage: boolean = false;
  selectedCodeokkRating: number = 0;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  handleCodeokkRatingSelected(rating: number) {
    this.selectedCodeokkRating = rating;
  }

  onSubmit() {
    this.validFeedbackMessage = this.message.length === 0;

    if (!this.validFeedbackMessage) {
      const requestBody = {
        id: 0,
        message: this.message,
        createdBy: Number(localStorage.getItem("id")),
        ratingCount: this.selectedCodeokkRating,
        createdOn: new Date().toISOString(),
      };

      console.log(requestBody);

      this.userService
        .addUserFeedback(requestBody)
        .subscribe((response: any) => {
          this.showNotification(
            "Your feedback has been submitted successfully"
          );
        });
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
