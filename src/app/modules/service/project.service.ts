import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  constructor(private http: HttpClient) {}
  private BaseURL = environment.baseUrl;

  saveProjectCodePost(payLoad: any) {
    return this.http.post(`${this.BaseURL}ProjectCode`, payLoad);
  }

  uploadProjectCodeImages(formData: any) {
    return this.http.post(`${this.BaseURL}ProjectCode/UploadImages`, formData);
  }

  getAllProjectCodePosts() {
    return this.http.get(`${this.BaseURL}ProjectCode/GetDashboard`);
  }

  getAllAdminProjectCodePosts() {
    return this.http.get(`${this.BaseURL}ProjectCode/AdminDashboard`);
  }

  getProjectCodeById(id: any) {
    return this.http.get(
      `${this.BaseURL}ProjectCode/GetByTabRefGuid?tabRefGuid=` + id
    );
  }

  approveCode(tableRefGuid: any) {
    return this.http.post(
      `${this.BaseURL}ProjectCode/ApprovedByAdmin?tabRefGuid=` + tableRefGuid,
      null
    );
  }

  ProjectRatingReview(payload: any) {
    return this.http.post(`${this.BaseURL}ProjectRatingReview`, payload);
  }

  codeDownload(payload: any) {
    return this.http.post(`${this.BaseURL}ProjectCode/Download`, payload);
  }

  ProjectRatingData(tableRefGuid: any) {
    return this.http.get(
      `${this.BaseURL}ProjectRatingReview/GetProjectRatingReviewByProjectTableRefGuid?projectTabRefGuid=` +
        tableRefGuid
    );
  }

  downloadCount(tableRefGuid: any) {
    return this.http.get(
      `${this.BaseURL}ProjectCode/DownloadCountByTableRefGuid?tableRefGuid=` +
        tableRefGuid
    );
  }

  applyForVacancy(vacancyData: any): Observable<any> {
    return this.http.post<any>(
      `https://codeokk.azurewebsites.net/api/User/ApplyForVacancy`,
      vacancyData
    );
  }

  uploadResume(formData: any) {
    return this.http.post(
      `https://codeokk.azurewebsites.net/api/User/uploadResume`,
      formData
    );
  }

  getFrameworkByTechnologyId(id: number) {
    return this.http.get(
      `${this.BaseURL}ProjectCode/GetTechnologyFrameworkById?technologyId=${id}`
    );
  }

  getProjectByUserId(userId: number) {
    return this.http.get(
      `${this.BaseURL}ProjectCode/GetProjectByUserId?userId=` + userId
    );
  }
}
