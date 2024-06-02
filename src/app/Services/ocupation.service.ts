import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Occupation } from '../Models/Occupation';

@Injectable({
  providedIn: 'root'
})
export class OccupationService 
{

  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=5';

  constructor(private http:HttpClient) { }

  GetAllOccupation()
  {
    return this.http.get<Occupation[]>(`${this.myapUrl}`+`${this.myApiUrl}`)
    .pipe(
      map((resp) => {
         return resp;
      })
   );
  }  

}
