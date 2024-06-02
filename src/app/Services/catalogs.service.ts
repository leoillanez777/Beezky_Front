import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseDTO } from '../Models/ResponseDTO';


@Injectable({
  providedIn: 'root'
})
export class CatalogsService {

  private myapUrl = environment.apiUrl;
  private myApiUrl = 'api/customercatalogs/';

  constructor(private http: HttpClient) { }
  
  GetCatalog(type: string, bankId: string): Observable<any> {
    return this.http.get<ResponseDTO>(`${this.myapUrl}${this.myApiUrl}?catalogs=${type}&bankId=${bankId}`)
  }
}
