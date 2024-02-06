import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-app-license',
  templateUrl: './app-license.component.html',
  styleUrls: ['./app-license.component.css']
})
export class AppLicenseComponent {

  singleLicense: boolean = true;
  multipleLicense: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AppLicenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { licenseType: string }
  ) {
    // Check the received license type data and set flags accordingly
    if (data && data.licenseType === 'Single App License') {
      this.singleLicense = true;
      this.multipleLicense = false;
    } else if (data && data.licenseType === 'Multiple App License') {
      this.singleLicense = false;
      this.multipleLicense = true;
    }
  }

  closeMatDialog() {
    this.dialogRef.close();
  }
}
