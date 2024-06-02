import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';

import { ResponseDTO } from 'src/app/Models/ResponseDTO';
import { AccountsService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-accounts-summary',
  templateUrl: './accounts-summary.component.html',
  styleUrls: ['./accounts-summary.component.css'],
  providers: [MessageService]
})
export class AccountsSummaryComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  dataSource: any = [];
  loading: boolean = true;

  constructor(
    public messageService: MessageService,
    private router: Router, 
    private accountService: AccountsService,
  ) {

  }

  ngOnInit(): void {
    this.getClientAccounts();
  }

  async getClientAccounts() {
    this.loading = true;
    try {
      const cif: string = sessionStorage.getItem('cif') || '0';

      const res: any = await lastValueFrom(this.accountService.GetAllAccounts('BLNI', cif));
      const resp = res.response as ResponseDTO;
      if (resp.success) {
        this.dataSource = resp.result;
      }
    }
    catch (error) {
      console.log(`Error: ${error}`);
    }
    finally {
      this.loading = false;
    }
  }

  gotoTransfer() {
    this.router.navigate(['/dashboard/transferencias']);
  }

  calculateTotal(): number {
    return this.dataSource.reduce((sum: number, item: { netBalance: { amount: string; }; }) => sum + parseFloat(item.netBalance?.amount) || 0, 0);
  }

  clear() {
    this.dt1?.clear();
  }

  filterData(event: Event) {
    const inputValue = (event.target as HTMLInputElement)?.value || '';
    this.dt1?.filterGlobal(inputValue, 'contains');
  }
}
