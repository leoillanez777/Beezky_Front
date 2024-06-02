import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MaritalStatus } from '../Models/MaritalStatus';

@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService 
{

  // myapUrl = 'https://openbankingdev.lafise.com/';
  // myApiUrl= '/obl/v1/banks/BLNI/catalogs/7/detail';
  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=7';
  

  constructor(private http:HttpClient) { }
  GetAllMaritalStatus()
  {
    return this.http.get<MaritalStatus[]>(`${this.myapUrl}`+`${this.myApiUrl}`)
    .pipe(
      map((resp) => {
         return resp;
      })
   );
  }

}
