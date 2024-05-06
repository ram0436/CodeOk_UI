import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  private dataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}
  private BaseURL = environment.baseUrl;

  getAllProjectCategory() {
    return this.http.get(`${this.BaseURL}Common/GetAllProjectCategory`);
  }

  getAllOperatingSystem() {
    return this.http.get(`${this.BaseURL}Common/GetAllOperatingSystem`);
  }

  getAllTechnology() {
    return this.http.get(`${this.BaseURL}Common/GetAllTechnology`);
  }

  getAllIndustryType() {
    return this.http.get(`${this.BaseURL}Common/GetAllIndustryType`);
  }

  getVersionByTechnologyId(id: number) {
    return this.http.get(
      `${this.BaseURL}Common/GetVersionByTechnologyId?technologyId=${id}`
    );
  }

  getAllCountry() {
    return this.http.get(`${this.BaseURL}Common/GetAllCountry`);
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  submitSalesEnquiry(payload: any) {
    return this.http.post(`${this.BaseURL}SalesEnquiry`, payload);
  }
}
