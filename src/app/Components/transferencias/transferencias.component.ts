import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

import { ClientAccountsService } from 'src/app/Services/client-account.service';
import { Transferencias } from 'src/app/Models/Transferencias';
import { TransferenciasService } from 'src/app/Services/transferencias.service';
import { OtpvalidatorComponent } from 'src/app/DialogComponents/otpvalidator/otpvalidator.component';
import { ResponseDTO } from 'src/app/Models/ResponseDTO';


@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css'],
  providers: [MessageService]
})
export class TransferenciasComponent implements OnInit {

  _Transfer!: Transferencias;
  _TranferForm: FormGroup;
  _accountList: string[] = [];

  constructor(
    public messageService: MessageService,
    public _TransService: TransferenciasService,
    private formBuilder: FormBuilder,
    public dialog :MatDialog,
    private _clientAccountsService: ClientAccountsService) 
    { 

      this.getClientAccounts(); 

    this._TranferForm = this.formBuilder.group({
    
      CuentaOrigen: ['', [ Validators.pattern("[0-9]*"),Validators.required]],
      CuentaDestino: ['', [ Validators.pattern("[0-9]*"),Validators.required]],
      Monto: ['', [ Validators.pattern("[0-9]*"),Validators.required]],
      CreditoDescrip: ['', []],
      DebitDescrip: ['', []],
      
    });


  }

  ngOnInit(): void {

  }

  openDialog(): void {
    this.dialog.open(OtpvalidatorComponent, {
      data:{
        account : "",
        idtransaction :  "",
        idconfirm:''
      }
    });
  }

  openDialogOtp(_Account:String,IdTransaccion :string,IdConfirm :string) {
     
    const dialogRef = this.dialog.open(OtpvalidatorComponent, {
      
      data:{
       
      account : _Account,
       idtransaction :  IdTransaccion,
       idconfirm:IdConfirm

      }
    });

    dialogRef.afterClosed().subscribe(result => { 
      
      if (result ===1){
        this.messageService.add({severity:'success', summary: 'Confirmación', detail: 'Transacción Exitosa!'});
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Transacción Fallida!'});
      }
      
    });
  }
  SendTransfer(_Idtransf :number = 3,_CurrencyCod : string = "NIO" ) {

    const Transferencias = {  
      account_deb : this._TranferForm.get('CuentaOrigen')?.value,
      transactionr : {
        transfer_type: "ThirdPartyAccounts",
        debit_description: this._TranferForm.get('DebitDescrip')?.value,
        to_transfer_to_third_party_accounts: {
            credit_description: this._TranferForm.get('CreditoDescrip')?.value  ,
            to: {
              bank_code: "BLNI",
              account: {
                  number: this._TranferForm.get('CuentaDestino')?.value
              }
            },
            value: {
              currency: _CurrencyCod,
              amount: this._TranferForm.get('Monto')!.value 
            }
        }
      }
    }

    let _Account: number = this._TranferForm.get('CuentaOrigen')!.value

    this._TransService.SendTransfer(_Account,Transferencias).subscribe((_resptransf: any) => {

        if(_resptransf) {
          this.openDialogOtp(_resptransf.account, _resptransf.idtransaction, _resptransf.idconfirm);
        } else {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Transacción Fallida!'});
        }
    });

  }

  getClientAccounts() {
    let cif: number = parseInt(sessionStorage.getItem('cif') || '112233');
    this._clientAccountsService.GetClientAccounts(cif).subscribe((resp: any) => {
      const response = resp.response as ResponseDTO;
      if (response.success) {
        this._accountList = response.result;
      }
    });
  }
}
