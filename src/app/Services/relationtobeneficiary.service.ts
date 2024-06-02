import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RelationToBeneficiary } from '../Models/RelationToBeneficiary';

@Injectable({
  providedIn: 'root'
})
export class RelationToBeneficiaryService 
{

  myapUrl = 'https://openbankingdev.lafise.com/';
  myApiUrl= '/obl/v1/banks/BLNI/catalogs/35/detail';
  //myApiUrl= '/obl/v1/banks/{{bankId}}/catalogs/5/detail';

  constructor(private http:HttpClient) { }

  GetAllRelationToBeneficiary()
  {
    return this.http.get<RelationToBeneficiary[]>(`${this.myapUrl}`+`${this.myApiUrl}`);
  }  

}
