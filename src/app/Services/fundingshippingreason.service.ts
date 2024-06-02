import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FundingShippingReason } from '../Models/FundingShippingReason';

@Injectable({
  providedIn: 'root'
})
export class FundingShippingReasonService 
{
 
  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=36';

  constructor(private http:HttpClient) { }
  GetAllFundingShippingReason()
  {
    return this.http.get<FundingShippingReason[]>(`${this.myapUrl}`+`${this.myApiUrl}`);
  }

}