import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Identification } from '../Models/Identification';

@Injectable({
  providedIn: 'root'
})
export class IdentificationService 
{


  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=2';
  

  constructor(private http:HttpClient) { }
  GetAllIdentification()
  {
    return this.http.get<Identification[]>(`${this.myapUrl}`+`${this.myApiUrl}`)
    .pipe(
      map((res)=>{
        return res;
      })
    );
  }

}
