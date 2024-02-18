import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { UserService } from "../../service/user.service";
import { UserRoleType } from "src/app/shared/enum/UserRoleType";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  firstName: string = "";
  lastName: string = "";
  countryId: string = "";
  email: string = "";
  linkedinURL: string = "";
  aboutMe: string = "";
  phoneNumber: string = "";
  password: string = "";
  roleId: number = 0;

  isBuyer: boolean = false;
  isSeller: boolean = false;

  message: string = "";

  validPhoneNumberMessage: boolean = false;
  phoneNumberErrorMessage: boolean = false;

  validEmailMessage: boolean = false;
  emailErrorMessage: string = "";

  isSubmitClicked: boolean = false;

  selectedUserRoleType: UserRoleType | string = UserRoleType.Seller;

  userRoleTypes = Object.values(UserRoleType).filter(
    (value) => typeof value === "string" && value !== "Admin"
  );

  countries: any = [
    {
      id: 1,
      countryName: "India",
      countryCode: "+91",
    },
    {
      id: 2,
      countryName: "USA",
      countryCode: "+1",
    },
  ];

  selectedCountry = this.countries[0];

  constructor(
    private userService: UserService,
    private router: Router,
    private dialogRef: MatDialogRef<SignupComponent>,
    private snackBar: MatSnackBar
  ) {}
  signIn() {
    this.isSubmitClicked = true;

    if (
      !this.email ||
      !this.firstName ||
      !this.phoneNumber ||
      !this.lastName ||
      !this.password
    ) {
      this.showNotification("Please fill in all required fields");
      this.isSubmitClicked = false;
      return;
    }

    this.validateEmail();

    this.validatePhoneNumber();

    if (
      this.validPhoneNumberMessage ||
      this.validEmailMessage ||
      this.phoneNumberErrorMessage
    ) {
      this.isSubmitClicked = false;
      return;
    }

    if (this.isBuyer) {
      this.roleId = 2;
    } else if (this.isSeller) {
      this.roleId = 1;
    }

    let payload: any = {
      id: 0,
      userId: "",
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      userImageList: [],
      userRoleId: this.roleId,
      countryId: this.selectedCountry.countryCode,
      email: this.email,
      mobileNo: this.phoneNumber,
      watsAppNo: "",
      linkedinURL: this.linkedinURL,
      aboutMe: this.aboutMe,
      createdBy: 0,
      createdOn: new Date().toISOString(),
      modifiedBy: 0,
      modifiedOn: new Date().toISOString(),
    };

    this.userService.register(payload).subscribe((data) => {
      this.dialogRef.close();
      this.showNotification("Account created successfully");
    });
  }

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(this.email);
    this.validEmailMessage = !isValid;
  }

  validatePhoneNumber(): void {
    if (!this.isSubmitClicked) {
      const regex = /^[0-9]*$/;
      const isValid = regex.test(this.phoneNumber);
      this.validPhoneNumberMessage = !isValid;
    } else if (this.isSubmitClicked) {
      const regex = /^[0-9]{10}$/;
      const isValid = regex.test(this.phoneNumber);
      this.phoneNumberErrorMessage = !isValid;
    }
  }

  userTypeSelected(event: any) {
    if (event.value === "Buyer") {
      this.isBuyer = true;
      this.isSeller = false;
    } else if (event.value === "Seller") {
      this.isBuyer = false;
      this.isSeller = true;
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
