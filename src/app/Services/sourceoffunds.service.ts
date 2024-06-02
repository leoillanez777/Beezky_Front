import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SourceOfFunds } from '../Models/SourceOfFunds';

@Injectable({
  providedIn: 'root'
})
export class SourceOfFoundsService 
{


  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=34';
  

  constructor(private http:HttpClient) { }
  GetAllSourceOfFounds()
  {
    return this.http.get<SourceOfFunds[]>(`${this.myapUrl}`+`${this.myApiUrl}`)
    .pipe(
      map((resp) => {
         return resp;
      })
   );
  }

}
