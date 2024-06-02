import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { KYCLafise } from 'src/app/Models/Lafise/Kyc';
import { ResponseDTO } from 'src/app/Models/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class ClientRegisterService {

  myapUrl = environment.apiUrl;
  myApiUrl = 'api/customer/';

  constructor(private http: HttpClient) { }

  KYCCheck(data: KYCLafise, bankId: string = 'BLNI'): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.myapUrl}${this.myApiUrl}kyc/${bankId}`, data);
  }

  CreateCustomer(clientBody: any, bankId: string = 'BLNI'): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.myapUrl}${this.myApiUrl}${bankId}`, clientBody);
  }

}
