import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Profession } from '../Models/Profession';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService 
{

  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=4';
  

  constructor(private http:HttpClient) { }

  GetAllProfession()
  {
    return this.http.get<Profession[]>(`${this.myapUrl}`+`${this.myApiUrl}`)
    .pipe(
      map((resp) => {
         return resp;
      })
   );
  }  

}
