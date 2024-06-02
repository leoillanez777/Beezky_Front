import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseDTO } from '../Models/ResponseDTO';

@Injectable({ providedIn: 'root' })
export class ClientAccountsService 
{

  myapUrl = environment.apiUrl;
  myApiUrl= 'api/account/';
  

  constructor(private http:HttpClient) { }
  private data: any = {};
  private subject = new BehaviorSubject<any>(this.data);

  sendData(message: any) {
    this.subject.next(message);
  }

  clearData() {
    this.subject.next(this.data);
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }

  GetClientAccounts(cif: any): Observable<ResponseDTO[]> {
    return this.http.get<ResponseDTO[]>(`${this.myapUrl}${this.myApiUrl}GetAccounts/BLNI/${cif}`)
  }

  GetClientBalance(cif: any): Observable<ResponseDTO[]> {
    return this.http.get<ResponseDTO[]>(`${this.myapUrl}${this.myApiUrl}GetAccounts/BLNI/${cif}`)
  }

}
