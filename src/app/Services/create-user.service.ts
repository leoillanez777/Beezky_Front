import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { UserAccount } from '../Models/UserAccount'
import { ResponseDTO } from '../Models/ResponseDTO';


@Injectable({
  providedIn: 'root'
})
export class CreateUserService {

  private myapUrl = environment.apiUrl;
  private myApiUrl = 'api/authentication/';

  constructor(private http: HttpClient) { }
  
  CreateAccount(account: UserAccount): Observable<any> {
    return this.http.post<ResponseDTO>(`${this.myapUrl}` + `${this.myApiUrl}`, account)
  }
}
