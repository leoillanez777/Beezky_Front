import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EconomicActivity } from '../Models/EconomicActivity';

@Injectable({
  providedIn: 'root'
})
export class EconomicActivityService 
{

  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=3';
  

  constructor(private http:HttpClient) { }
  GetAllEconomicActivity()
  {
    return this.http.get<EconomicActivity[]>(`${this.myapUrl}`+`${this.myApiUrl}`)
    .pipe(
      map((resp) => {
         return resp;
      })
   );
  }

}
