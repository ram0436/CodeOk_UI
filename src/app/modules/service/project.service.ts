import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http : HttpClient) { }
  private BaseURL = environment.baseUrl;

  saveProjectCodePost(payLoad: any) {
    return this.http.post(`${this.BaseURL}ProjectCode`, payLoad);
  }

  uploadProjectCodeImages(formData: any) {
    return this.http.post(`${this.BaseURL}ProjectCode/UploadImages`, formData);
  }

  getAllProjectCodePosts(){
    return this.http.get(`${this.BaseURL}ProjectCode/GetDashboard`);
  }

  getProjectCodeById(id:any){
    return this.http.get(`${this.BaseURL}ProjectCode/GetByTabRefGuid?tabRefGuid=`+id);
  }
}
