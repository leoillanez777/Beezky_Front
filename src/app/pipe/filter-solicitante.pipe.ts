import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs';

@Pipe({
  name: 'filterSolicitante'
})
export class FilterSolicitantePipe implements PipeTransform {
  transform(items: any[], field : string, value:number, field2 : string ,valueMes:number): any[] {
    let _filter = []
    
    for (let i in items){
      if  (items[i][field] === value && items[i][field2] === valueMes ){
        _filter.push(items[i])
      }
    }

    return _filter;
  }

}
