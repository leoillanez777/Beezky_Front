import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';

import { CustomDatePipe } from 'src/app/pipe/custom-date.pipe';
import { AccountsService } from 'src/app/Services/account.service';
import { TransactionHistory } from 'src/app/Models/TransactionHistory';
import { TransactionDetail } from 'src/app/Models/TransactionDetail';
import { ClientAccountsService } from 'src/app/Services/client-account.service';

import { Account } from 'src/app/Models/Account';
import { ResponseDTO } from 'src/app/Models/ResponseDTO';
import * as moment from 'moment';

@Component({
  selector: 'app-client-accounts',
  templateUrl: './client-accounts.component.html',
  styleUrls: ['./client-accounts.component.css'],

})

export class ClientAccountsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  
  _accountList: any[] = [];
  selectedAccount: any;
  accountName: string = '';
  accountCurrency: string = '';
  accountNetBalance: number = 0;
  accountNotAvailable: number = 0;
  accountBalance: number = 0;
  accountForm: FormGroup;
  filterForm: FormGroup;
  subscription?: Subscription;
  startDate: Date = new Date;
  endDate: Date = new Date;
  today: Date = new Date;
  accountNumber: number = 0;
  columnsToDisplay: string[] = ['transaction_date', 'confirmation_number', 'transaction_description', 'debit', 'credit', 'account_balance'];

  constructor(
    private formBuilder: FormBuilder, 
    private _accountService: AccountsService,
    private _clientAccountsService: ClientAccountsService,
    private http: HttpClient,
    private config: PrimeNGConfig,
    private _customerDatePipe: CustomDatePipe,
    ) {

    this.getClientAccounts();

    this.accountForm = this.formBuilder.group({
      accountDDL: ['', [Validators.required]],

    })
    this.filterForm = this.formBuilder.group({

      startDate: [, [Validators.required]],
      endDate: [, [Validators.required]],


    })

    this.startDate = moment().startOf('month').toDate();
    this.endDate = moment().toDate();

    this.filterForm.get("startDate")?.setValue(this.startDate);
    this.filterForm.get("endDate")?.setValue(this.endDate);

    this.subscription = this._clientAccountsService.getData().subscribe((x) => {
      this.selectedAccount = x;
      this.accountForm.get("accountDDL")?.setValue(this.selectedAccount);
      this.GetBalance(this.selectedAccount);
      this.GetHistorical();
    });
  }

  ngOnInit(): void {
    this.http.get('assets/locales/es.json').subscribe((data: any) => {
      this.config.setTranslation(data);
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

  GetHistorical() {
    this.dataSource = [];
    
    if (Object.keys(this.selectedAccount).length !== 0) {
      const mStartDate = moment(this.filterForm.get('startDate')?.value).format("yyyy-MM-DD");
      const mEndDate = moment(this.filterForm.get('endDate')?.value).format("yyyy-MM-DD");
    
      this._accountService.GetHistoricalExt(this.selectedAccount.accountNumber, mStartDate, mEndDate).subscribe((resp: TransactionHistory) => {
        if (resp) {
          let dataSource = resp.content.map(val => ({
            reference: val.reference,
            account_number: val.account_number,
            transaction_date: this._customerDatePipe.transform(val.transaction_date),
            transaction_description: val.transaction_description,
            transaction_amount: val.transaction_amount,
            transaction_type: val.transaction_type,
            confirmation_number: val.confirmation_number,
            check_number: val.check_number,
            account_balance: val.account_balance,
            debit: val.transaction_type === 'DEBIT' ? val.transaction_amount : 0,
            credit: val.transaction_type != 'DEBIT' ? val.transaction_amount : 0,
          }));
          this.dataSource = new MatTableDataSource<TransactionDetail>(dataSource);
        }

      });
    }
  }
  GetBalance(_account: number) {

    this._accountService.GetBalance(_account).subscribe((resp: Account) => {    
      if (resp) {
        this.accountNumber = parseInt(resp.account_id);
        this.accountName = resp.label;
        this.accountCurrency = resp.net_balance.currency;
        this.accountBalance = resp.balance.amount;
        this.accountNotAvailable = resp.not_available.amount;
        this.accountNetBalance = resp.net_balance.amount;
      }
    });
  }

  ChangeData(event: any) {
    this.selectedAccount = event.value;
    const sAccount: number = parseInt(event.value.accountNumber);
    this.GetBalance(sAccount);
  }

}

