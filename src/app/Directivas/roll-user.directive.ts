import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';


@Directive({
  selector: '[appRollUser]'
  
})
export class RollUserDirective implements OnInit {
  @Input('appRollUser') _Modulo! : string
  _SelectPermiso: any
  _SelectOpcion :any
  
  constructor(
    private el:ElementRef,  private templateRef: TemplateRef<any>,private viewContainer: ViewContainerRef,
     ) {
      
  }
 
  ngOnInit(): void {
    let _OpcionBtn :string;
    this._SelectOpcion = this._Modulo.split('/') 
    _OpcionBtn= this._SelectOpcion[1].toString()

      this.getvalidaPermiso(parseInt(localStorage.getItem('useLog')!.toString()),this._SelectOpcion[0],this._SelectOpcion[1])

  }

  getvalidaPermiso(IdUser:number,NameModule:string,_opcionBtn:string){
  }
  
}
