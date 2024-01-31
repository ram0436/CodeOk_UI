import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user/service/user.service';
import { VacancyPositionType, Qualification, TechnicalSkillType } from '../../shared/enum/JobVacancy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent {

  
  @ViewChild('fileInput') fileInput! : ElementRef;

  resumeFile: File | null = null;
  resumeUrl: string = '';
  progress: boolean = false;
  resumeFileName: string = '';
  mobileNumber: string = '+91';

  selectedPositionType: VacancyPositionType | null = null;
  selectedTechnicalSkill: TechnicalSkillType | null = null;
  selectedQualification: Qualification | null = null;

  positionType: VacancyPositionType = VacancyPositionType.FullTime;
  qualificationType: Qualification = Qualification.MTech;
  technicalSkillType: TechnicalSkillType = TechnicalSkillType.Others;
  Qualification = Qualification;

  constructor(private userService: UserService, private renderer: Renderer2, private snackBar: MatSnackBar, private router: Router) { }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  setPositionType(value: number) {
    this.positionType = value;
  }

  setQualificationType(value: Qualification) {
    this.qualificationType = value;
  }

  setTechnicalSkillsType(value: number) {
    this.technicalSkillType = value;
  }

  handleBackspace(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.selectionStart! <= 4) {
      event.preventDefault();
    }
  }

  handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (!inputValue.startsWith('+91')) {
      inputElement.value = '+91';
    }

  }


  uploadResume(event: any){
    var files = event.target.files;
    const formData = new FormData();
    this.progress = true;
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
      this.resumeFileName = files[i].name;
    }
    this.userService.uploadResume(formData).subscribe((data: any) => {
      this.progress = false;
      if (data.length > 0) {
        this.resumeUrl = data[0];
      }
    })
  }

  applyForVacancy(){

    const name = (document.getElementById('name') as HTMLInputElement).value;
    const mobile = (document.getElementById('mobile') as HTMLInputElement).value;
    const aboutMe = (document.getElementById('aboutMe') as HTMLTextAreaElement).value;

    const mobileNumberWithoutCountryCode = mobile.slice(3, 13);

    if (this.resumeUrl && name && mobile && aboutMe && this.qualificationType && this.positionType && this.technicalSkillType) {
      if (mobile.length === 13) {
          const vacancyData = {
            name: name,
            qualification: this.qualificationType,
            postionType: this.positionType,
            technicalSkill: this.technicalSkillType,
            mobileNo: mobileNumberWithoutCountryCode,
            resumeURL: this.resumeUrl,
            aboutMe: aboutMe,
            createdOn: new Date().toISOString()
          };

          this.userService.applyForVacancy(vacancyData).subscribe(response => {
            this.showNotification('Your application has been successfully submitted.');
            this.router.navigate(['/']);
          }, error => {
            this.showNotification('An error occur while submitting your application.');
          });
        }
        else{
          this.showNotification('Please enter a valid 10-digit mobile number.');
        }
    } else {
      this.showNotification('Please fill in all the details and select a resume file.');
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  navigateToTab(tab: string) {
    const url = `/vacancy-opening#${tab}`;
    this.router.navigateByUrl(url);
  }


}
