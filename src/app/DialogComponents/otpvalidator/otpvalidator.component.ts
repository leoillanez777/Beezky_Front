
import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {MatDialogRef,MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

import { TransferenciasService } from 'src/app/Services/transferencias.service';

@Component({
  selector: 'app-otpvalidator',
  templateUrl: './otpvalidator.component.html',
  styleUrls: ['./otpvalidator.component.css'],
  providers: [MessageService]
})
export class OtpvalidatorComponent implements OnInit {
  form: FormGroup;
  _dataResult : any={};
 
  constructor(
    public messageService: MessageService,
    private formBuilder : FormBuilder,
    public dialog :MatDialog,
    public dialogRef: MatDialogRef<OtpvalidatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _TransferenciasService :TransferenciasService
    ) { 

    this.form = this.formBuilder.group({
      OTP:['',[Validators.required,Validators.maxLength(6)]]    
    })
  }

  ngOnInit(): void {
    this._dataResult =  this.data
  }

  ValidaOtp(){
 
    let _OTP= this.form.get('OTP')?.value;     
    this._dataResult["otp"]=_OTP;
    if (_OTP !=""){
      this._TransferenciasService.SendConfirm(this._dataResult).subscribe((_respconfirm: any) => 
          {        
            if (_respconfirm)
            {
              this.messageService.add({
                severity:'success', summary: 'Transferencia', detail: 'Se ha enviado la confirmación.'
              })
              this.dialogRef.close(1);
            }   
          }); 
   
    }else{      
        this.dialogRef.close(0);
    }
  } 
}