import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TransferConfirm } from '../Models/TransferConfirm';
import { Transferencias } from '../Models/Transferencias'; 
import { TransferOwnaccounts } from '../Models/TransferOwnaccounts';

@Injectable({
  providedIn: 'root'
})
export class TransferenciasService {

  myapUrl = environment.apiUrl;
  myApiUrl= 'api/Transaction/';
  constructor(private http: HttpClient) { }

  SendTransfer(_Account:number,_Transfer: Transferencias): Observable<any> {
    return this.http.post<any>(`${this.myapUrl}` + `${this.myApiUrl}RequestTransaction`, _Transfer)
    //return this.http.post<any>(`${this.myapUrl}` + `${this.myApiUrl}RequestTransaction`, {"valor": _Transfer,"account":_Account})
  }

  SendTransferOwnaccounts(_Account:number,_Transfer: TransferOwnaccounts): Observable<any> {
    return this.http.post<any>(`${this.myapUrl}` + `${this.myApiUrl}RequestTransaction`, _Transfer)
    //return this.http.post<any>(`${this.myapUrl}` + `${this.myApiUrl}RequestTransaction`, {"valor": _Transfer,"account":_Account})
  }

  SendConfirm(_ConfirmTransfer: TransferConfirm): Observable<any> {
    return this.http.post<TransferConfirm>(`${this.myapUrl}` + `${this.myApiUrl}ConfirmTransaction`, _ConfirmTransfer)
  }

}
