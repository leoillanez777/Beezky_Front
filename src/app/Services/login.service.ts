import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { LoginModel as Login, ValidateEmail }  from 'src/app/Models/Login';
import { ResponseDTO } from '../Models/ResponseDTO';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  myapUrl = environment.apiUrl;
  myApiUrl= 'api/Authentication/';

  constructor(private http:HttpClient) { }

  Login(login: Login): Observable<Login> {
    return this.http.post<Login>(`${this.myapUrl}${this.myApiUrl}Login`, login);
  }

  LoginSessionSuccess(res: ResponseDTO): void {
    sessionStorage.setItem("token", res.result.token);
    sessionStorage.setItem("id", res.result.userId);
    sessionStorage.setItem("firstname", res.result.name);
    sessionStorage.setItem("lastname", res.result.lastName);
    if (res.result.avatar) {
      sessionStorage.setItem('avatar', res.result.avatar);
    }
    if (res.result.customerID) {
      sessionStorage.setItem("cif", res.result.customerID);
    }
  }

  ReSendCode(email: string): Observable<any> {
    return this.http.get<any>(`${this.myapUrl}${this.myApiUrl}ReSendCode/${email}`);
  }

  ValidateCode(validate: ValidateEmail): Observable<any> {
    return this.http.post<any>(`${this.myapUrl}${this.myApiUrl}ValidateEmail`, validate);
  }

  GetPersonalData(): Observable<any> {
    return this.http.get<any>(`${this.myapUrl}${this.myApiUrl}PersonalData`);
  }

  UpdatePersonalData(data: any): Observable<any> {
    return this.http.post<any>(`${this.myapUrl}${this.myApiUrl}PersonalData`, data);
  }

  LoginWith2FA(data: any): Observable<any> {
    return this.http.post<any>(`${this.myapUrl}${this.myApiUrl}LoginWith2FA`, data)
  }
}