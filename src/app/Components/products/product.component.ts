import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';

import { ResponseDTO } from 'src/app/Models/ResponseDTO';
import { AccountsService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [MessageService]
})
export class ProductComponent implements OnInit {
  @ViewChild('dtAccount') dtAccount: Table | undefined;
  @ViewChild('dtBalance') dtBalance: Table | undefined;
  dataSourceAccount: any = [];
  dataSourceBalance: any = [];
  loadingArray: boolean[] = [true, true, true];
  
  constructor(
    public messageService: MessageService,
    private router: Router, 
    private accountService: AccountsService,
    ) {
      
  }
  ngOnInit(): void {
    this.getClientAccounts();
  }

  gotoTransfer() {
    this.router.navigate(['/dashboard/transferencias']);
  }

  async getClientAccounts() {
    this.loadingArray[0] = true;
    try {
      const cif: string = sessionStorage.getItem('cif') || '0';

      const res: any = await lastValueFrom(this.accountService.GetAllAccounts('BLNI', cif));
      const resp = res.response as ResponseDTO;
      if (resp.success) {
        this.dataSourceAccount = resp.result;
      }
    }
    catch (error) {
      console.log(`Error: ${error}`);
    }
    finally {
      this.loadingArray[0] = false;
    }
  }

  filterAccounts(event: Event) {
    const inputValue = (event.target as HTMLInputElement)?.value || '';
    this.dtAccount?.filterGlobal(inputValue, 'contains');
  }
  clearAccountFilter() {
    this.dtAccount?.clear();
  }

}
