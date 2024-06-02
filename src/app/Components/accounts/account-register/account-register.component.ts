import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MessageService } from 'primeng/api';

import { companyData } from 'src/app/Models/CompanyData';
import { CustomDatePipe } from 'src/app/pipe/custom-date.pipe';
import { AccountsService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-account-register',
  templateUrl: './account-register.component.html',
  styleUrls: ['./account-register.component.css'],
  providers: [MessageService]
})
export class AccountRegisterComponent implements OnInit {
  @ViewChild('stepper') private stepper?: MatStepper;
  isEditable = false;
  isOptional = false;
  accountForm: FormGroup;
  confirmationForm: FormGroup;
  _Currencies?: any;
  currencySelected: any;
  cif: number = 0;
  consent_id: string = "";
  isLoading: boolean = false;

  constructor(
    public messageService: MessageService,
    private formBuilder: FormBuilder, 
    private _accountService: AccountsService,
    private _customerDatePipe: CustomDatePipe) {


    this.accountForm = this.formBuilder.group({
      labelAccount: ['', [Validators.required]],
      currency: ['', []],
      amount: ['', [Validators.required]],
    });

    this.confirmationForm = this.formBuilder.group({
      emailToken: ['', [Validators.required]],
    });

    this._Currencies = [
      { code: 'NIO', description: 'Córdoba - NIO' },
      { code: 'USD', description: 'Dólar - USD' }
    ]
    this.cif = parseInt(sessionStorage.getItem('cif') || '0');
  }

  ngOnInit(): void {
  }
  askForConsent() {

    this.isLoading = true;
    const _consent = {
      time_to_live: 3600,
      everything: true,
      valid_from: this._customerDatePipe.transform(new Date) as Date,
      customer_id:  this.cif ,
      views: []
    }

    this._accountService.AskForConsent(_consent).subscribe((respClient: any) => {  
      if (respClient.consent_id) {
        this.consent_id = respClient.consent_id;
        this.stepper?.next();
        this.messageService.add({
          severity: "success", summary: "Solicitud de consentimiento!", detail: `Solicitud enviada exitosamente.`
        });
      } else {
        if (('message' in respClient)) {
          this.messageService.add({
            severity: 'error', summary: 'Error en la solicitud de consentimiento', detail: `${respClient['message']}`
          })
        }
        else {
          this.messageService.add({
            severity: 'error', summary: `Error ${respClient?.messages[0]?.code}`, 
              detail: respClient?.messages[0]?.message
          })
        }
      }
      this.isLoading = false;
    });
  }
  confirmConsent() {
    let otp: string = this.confirmationForm.get('emailToken')?.value;
    let consentid: string = this.consent_id;//,
    
    this.isLoading = true;
    this._accountService.ConfirmConsent(otp, consentid).subscribe((respClient: any) => {
 
      if (respClient.status==="ACCEPTED") {
        this.limpiarconfirmationForm();
        this.stepper?.next();
        this.messageService.add({
          severity:'success', summary: 'Confirmacion de consentimiento', detail: 'Confirmacion realizada correctamente.'
        })
      } else {
        if (('message' in respClient)) {
          this.messageService.add({
            severity: 'error', summary: 'Error en la solicitud de consentimiento', detail: `${respClient['message']}`
          })
        }
        else {
          this.messageService.add({
            severity: 'error', summary: `Error ${respClient?.messages[0]?.code}`, 
              detail: respClient?.messages[0]?.message
          })
        }
      }
      this.isLoading = false;
    });
  }

  createAccount() {
    const _newAccount = {
      branch_id: companyData.branch_id,
      label: this.accountForm.get('labelAccount')?.value,
      balance:
      {
        currency: this.accountForm.get('currency')?.value,
        amount: parseInt(this.accountForm.get('amount')?.value) as number
      },
      user_id: this.cif,
    
      product_code: companyData.product_code


    }

    this._accountService.NewAccount(_newAccount).subscribe((respClient: any) => {
    
      if (respClient) {
        this.limpiaraccountForm();
        this.messageService.add({
          severity:'success', summary: 'Creacion de cuenta', detail: 'La cuenta ha sido creada exitosamente'
        })
      } else {
        this.messageService.add({
          severity: 'error', summary: `Error ${respClient?.messages[0]?.code}`, 
            detail: respClient?.messages[0]?.message
        })
      }


    });
  }

  limpiarconfirmationForm() {
    this.confirmationForm.reset();
  }

  limpiaraccountForm() {
    this.accountForm.reset();
  }
}
