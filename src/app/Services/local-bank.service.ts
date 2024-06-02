import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalBank } from '../Models/LocalBank';

@Injectable({
  providedIn: 'root'
})
export class LocalBankService {

  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=8';
  

  constructor(private http:HttpClient) { }

  GetAllLocalBank()
  {
    return this.http.get<LocalBank[]>(`${this.myapUrl}`+`${this.myApiUrl}`)
    .pipe(
      map((resp) => {
         return resp;
      })
   );
  }  

}
