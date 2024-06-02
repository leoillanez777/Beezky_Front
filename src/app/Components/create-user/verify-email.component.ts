import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  providers: [MessageService],
})
export class VerifyEmailComponent implements OnInit {
  
  items: MenuItem[];

  constructor(
    public messageService: MessageService
    ) {
    this.items = [];
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Enviar código',
        routerLink: 'send-code'
      },
      {
          label: 'Validar código',
          routerLink: 'validate-code'
      },
      {
          label: 'Confirmación',
          routerLink: 'confirmation-code'
      },
    ];

  }

}