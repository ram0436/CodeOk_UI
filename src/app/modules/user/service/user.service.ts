import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private dataSubject = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  login(payload: any) {
    return this.httpClient.post(
      "https://codeokk.azurewebsites.net/api/Auth",
      payload
    );
  }

  register(payload: any) {
    return this.httpClient.post(
      "https://codeokk.azurewebsites.net/api/User",
      payload
    );
  }

  uploadProfilePicture(formData: any) {
    return this.httpClient.post(
      "https://codeokk.azurewebsites.net/api/User/UploadImages",
      formData
    );
  }
  getUserById(id: number) {
    return this.httpClient.get(
      "https://codeokk.azurewebsites.net/api/User/" + id
    );
  }
  updateUser(payload: any) {
    return this.httpClient.put(
      "https://codeokk.azurewebsites.net/api/User/" + payload.id,
      payload
    );
  }
  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  applyForVacancy(vacancyData: any): Observable<any> {
    return this.httpClient.post<any>(
      `https://codeokk.azurewebsites.net/api/User/ApplyForVacancy`,
      vacancyData
    );
  }

  uploadResume(formData: any) {
    return this.httpClient.post(
      `https://codeokk.azurewebsites.net/api/User/uploadResume`,
      formData
    );
  }

  makePayment(payload: any) {
    return this.httpClient.post(
      `https://codeokk.azurewebsites.net/api/User/MakePayment`,
      payload
    );
  }

  addDashboardMessage(payload: any) {
    return this.httpClient.post(
      `https://codeokk.azurewebsites.net/api/User/AddDashboardMessage`,
      payload
    );
  }

  addUserFeedback(payload: any) {
    return this.httpClient.post(
      `https://codeokk.azurewebsites.net/api/User/AddUserFeedback`,
      payload
    );
  }

  addWishList(payload: any) {
    return this.httpClient.post(
      `https://codeokk.azurewebsites.net/api/User/AddWishList`,
      payload
    );
  }

  getWishListByUserId(userId: any) {
    return this.httpClient.get(
      `https://codeokk.azurewebsites.net/api/User/GetWishListByUserId?userId=${userId}`
    );
  }

  getDashboardMessage(): Observable<any[]> {
    const apiUrl = `https://codeokk.azurewebsites.net/api/User/GetDashboardMessage`;
    return this.httpClient.get<any[]>(apiUrl);
  }

  checkPaymentStatus(tableRefGuid: string, userId: number): Observable<any> {
    return this.httpClient.get(
      `https://codeokk.azurewebsites.net/api/User/IsPaymentVerified?projectTableRefGuid=${tableRefGuid}&userId=${userId}`
    );
  }
}
