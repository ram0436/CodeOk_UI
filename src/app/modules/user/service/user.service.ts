import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private dataSubject = new Subject<any>();

  private BaseURL = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}

  login(payload: any) {
    return this.httpClient.post(`${this.BaseURL}Auth`, payload);
  }

  register(payload: any) {
    return this.httpClient.post(`${this.BaseURL}User`, payload);
  }

  uploadProfilePicture(formData: any) {
    return this.httpClient.post(`${this.BaseURL}User/UploadImages`, formData);
  }
  getUserById(id: number) {
    return this.httpClient.get(`${this.BaseURL}User/` + id);
  }
  updateUser(payload: any) {
    return this.httpClient.put(`${this.BaseURL}User/` + payload.id, payload);
  }
  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  applyForVacancy(vacancyData: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.BaseURL}User/ApplyForVacancy`,
      vacancyData
    );
  }

  uploadResume(formData: any) {
    return this.httpClient.post(`${this.BaseURL}User/uploadResume`, formData);
  }

  makePayment(payload: any) {
    return this.httpClient.post(`${this.BaseURL}User/MakePayment`, payload);
  }

  addDashboardMessage(payload: any) {
    return this.httpClient.post(
      `${this.BaseURL}User/AddDashboardMessage`,
      payload
    );
  }

  addUserFeedback(payload: any) {
    return this.httpClient.post(`${this.BaseURL}User/AddUserFeedback`, payload);
  }

  addWishList(payload: any) {
    return this.httpClient.post(`${this.BaseURL}User/AddWishList`, payload);
  }

  getWishListByUserId(userId: any) {
    return this.httpClient.get(
      `${this.BaseURL}User/GetWishListByUserId?userId=${userId}`
    );
  }

  getDashboardMessage(): Observable<any[]> {
    const apiUrl = `${this.BaseURL}User/GetDashboardMessage`;
    return this.httpClient.get<any[]>(apiUrl);
  }

  checkPaymentStatus(tableRefGuid: string, userId: number): Observable<any> {
    return this.httpClient.get(
      `${this.BaseURL}User/IsPaymentVerified?projectTableRefGuid=${tableRefGuid}&userId=${userId}`
    );
  }

  sendLoginOTP(
    mobileNumber: string,
    ipAddress: string,
    createdOn: string
  ): Observable<any> {
    const url = `${this.BaseURL}Auth/SendLoginOTP`;
    const body = {
      mobile: mobileNumber,
      ipAddress: ipAddress,
      createdOn: createdOn,
    };
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpClient.post(url, body, { headers: headers });
  }

  OTPLogin(mobileNo: string, otp: number, firstName: string): Observable<any> {
    const url = `${this.BaseURL}Auth/OTPLogin?mobileNo=${mobileNo}&otp=${otp}&firstName=${firstName}`;
    return this.httpClient.post(url, null, {
      headers: new HttpHeaders({
        Accept: "*/*",
      }),
    });
  }
}
