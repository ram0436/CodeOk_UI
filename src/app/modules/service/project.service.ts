import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private searchResultsSubject = new BehaviorSubject<any[]>([]);
  private getAllItemsSubject = new BehaviorSubject<any[]>([]);
  public searchResults$ = this.searchResultsSubject.asObservable();
  public getAllItems$ = this.getAllItemsSubject.asObservable();

  constructor(private http: HttpClient) {}
  private BaseURL = environment.baseUrl;

  saveProjectCodePost(payLoad: any) {
    return this.http.post(`${this.BaseURL}ProjectCode`, payLoad);
  }

  uploadProjectCodeImages(formData: any) {
    return this.http.post(`${this.BaseURL}ProjectCode/UploadImages`, formData);
  }

  getAllProjectCodePosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BaseURL}ProjectCode/GetDashboard`).pipe(
      tap((results) => {
        this.getAllItemsSubject.next(results);
      })
    );
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
      `${this.BaseURL}User/ApplyForVacancy`,
      vacancyData
    );
  }

  uploadResume(formData: any) {
    return this.http.post(`${this.BaseURL}User/uploadResume`, formData);
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

  searchAds(searchQuery: string): Observable<any[]> {
    const apiUrl = `${this.BaseURL}ProjectCode/GlobalSearch?searchItem=${searchQuery}`;
    return this.http.get<any[]>(apiUrl).pipe(
      tap((results) => {
        this.searchResultsSubject.next(results);
      })
    );
  }
}
