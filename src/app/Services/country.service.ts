import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../Models/Country';

@Injectable({
  providedIn: 'root'
})
export class CountryService 
{

  // myapUrl = 'https://openbankingdev.lafise.com/';
  // myApiUrl= '/obl/v1/banks/BLNI/catalogs/1/detail';
  myapUrl = environment.apiUrl;
  myApiUrl= 'api/catalogo/GetByCode?code=1';
  

  constructor(private http:HttpClient) { }
  GetAllCountry()
  {
    return this.http.get<Country[]>(`${this.myapUrl}`+`${this.myApiUrl}`)
    .pipe(
      map((res)=> {
        return res;
      })
    );
  }

}
