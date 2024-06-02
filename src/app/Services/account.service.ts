import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Account } from '../Models/Account';
import { TransactionHistory } from '../Models/TransactionHistory';
import { ResponseDTO } from '../Models/ResponseDTO';


@Injectable({ providedIn: 'root' })
export class AccountsService {

  myapUrl = environment.apiUrl;
  myApiUrl = 'api/Account/';


  constructor(private http: HttpClient) { }

  GetAllAccounts(bankId: string, customerId: string): Observable<ResponseDTO> {
    return this.http.get<ResponseDTO>(`${this.myapUrl}${this.myApiUrl}GetAllAccounts/${bankId}/${customerId}`);
  }

  GetBalance(account: number): Observable<Account> {
    return this.http.get<Account>(this.myapUrl + this.myApiUrl + `GetBalance?account=${account}`)
  }
  GetHistorical(account: number, startDate: Date, endDate: Date): Observable<TransactionHistory> {
    return this.http.get<TransactionHistory>(this.myapUrl + this.myApiUrl + `GetHistorical?account=${account}&startDate=${startDate}&endDate=${endDate}`)
  }
  GetHistoricalExt(account: number, startDate: string, endDate: string): Observable<TransactionHistory> {
    return this.http.get<TransactionHistory>(this.myapUrl + this.myApiUrl + `GetHistoricalExt?account=${account}&startDate=${startDate}&endDate=${endDate}`)
  }
  NewAccount(body: any): Observable<any> {

    return this.http.post<any>(`${this.myapUrl}` + `${this.myApiUrl}NewAccount`, body)
  }
  AskForConsent(body: any): Observable<any> {

    return this.http.post<any>(`${this.myapUrl}` + `${this.myApiUrl}AskForConsent`, body)
  }
  ConfirmConsent(otp: string, consentid: string): Observable<any> {

    return this.http.post<any>(`${this.myapUrl}` + `${this.myApiUrl}ConfirmConsent?otp=${otp}&consentid=${consentid}`, {})
  }
}
