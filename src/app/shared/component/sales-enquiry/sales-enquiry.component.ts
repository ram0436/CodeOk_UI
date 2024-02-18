import { Component, ViewEncapsulation } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CustomerType } from "../../enum/CustomerType";
import { EnquiryType } from "../../enum/EnquiryType";
import { CommonService } from "../../service/common.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-sales-enquiry",
  templateUrl: "./sales-enquiry.component.html",
  styleUrls: ["./sales-enquiry.component.css"],
})
export class SalesEnquiryComponent {
  email: string = "";
  phoneNumber: string = "";
  password: string = "";
  firstName: string = "";

  message: string = "";

  validPhoneNumberMessage: boolean = false;
  phoneNumberErrorMessage: boolean = false;

  validEmailMessage: boolean = false;
  emailErrorMessage: string = "";

  isSubmitClicked: boolean = false;

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

  selectedCustomerType: CustomerType | string =
    CustomerType.IndividualDeveloper;
  selectedEnquiryType: EnquiryType | string = EnquiryType.Urgent;

  customerTypes = Object.values(CustomerType).filter(
    (value) => typeof value === "string"
  );

  enquiryTypes = Object.values(EnquiryType).filter(
    (value) => typeof value === "string"
  );

  constructor(
    private commonService: CommonService,
    private router: Router,
    private dialogRef: MatDialogRef<SalesEnquiryComponent>,
    private snackBar: MatSnackBar
  ) {}

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

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(this.email);
    this.validEmailMessage = !isValid;
  }

  submitSalesEnquiry(): void {
    this.isSubmitClicked = true;

    if (!this.email || !this.firstName || !this.phoneNumber || !this.message) {
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

    const requestBody = {
      id: 0,
      customerTypeId: this.getEnumId(this.selectedCustomerType, CustomerType),
      enquiryTypeId: this.getEnumId(this.selectedEnquiryType, EnquiryType),
      countryId: this.selectedCountry.id,
      customerName: this.firstName,
      email: this.email,
      mobile: this.selectedCountry.countryCode + this.phoneNumber,
      message: this.message,
      createdOn: new Date().toISOString(),
    };

    this.commonService.submitSalesEnquiry(requestBody).subscribe(
      (response: any) => {
        this.showNotification("Enquiry submitted successfully");
        this.isSubmitClicked = false;
        this.dialogRef.close();
      },
      (error) => {}
    );
  }

  private getEnumId(value: string | number, enumType: any): number {
    return typeof value === "string" ? enumType[value] : value;
  }

  closeMatDialog() {
    this.dialogRef.close();
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
