import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ClientRegisterService } from 'src/app/Services/client-register.service';
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';


@Component({
  selector: 'app-client-register',
  templateUrl: './client-register.component.html',
  styleUrls: ['./client-register.component.css'],
  providers: [MessageService],
})
export class ClientRegisterComponent implements OnInit, OnDestroy {

  items: MenuItem[];
  subscription?: Subscription;

  constructor(
    private _router: Router,
    public _ClientService: ClientRegisterService,
    public messageService: MessageService
  ) {
    this.items = 
    [
      {
        label: 'KYC',
        routerLink: 'kyc'
      },
      {
        label: 'Cliente',
        routerLink: 'customer'
      },
      {
        label: 'Confirmación',
        routerLink: 'confirmation'
      }
    ];
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}