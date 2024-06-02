import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeographicLocation } from '../Models/GeographicLocation';

@Injectable({
  providedIn: 'root'
})
export class GeographicLocationService 
{

  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=6';
  

  constructor(private http:HttpClient) { }
  GetAllGeographicLocation()
  {
    return this.http.get<GeographicLocation[]>(`${this.myapUrl}`+`${this.myApiUrl}`)
    .pipe(
      map((resp) => {
         return resp;
      })
   );
  }

}
