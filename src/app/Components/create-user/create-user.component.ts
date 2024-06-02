import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/Services/register.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  providers: [MessageService],
})
export class CreateUserComponent implements OnInit, OnDestroy {
  
  items: MenuItem[];
  subscription?: Subscription;

  constructor(
    public messageService: MessageService, 
    public registerService: RegisterService) {
    this.items = [];
  }

  ngOnInit(): void {
      this.items = [{
        label: 'Crear Cuenta',
        routerLink: 'account'
      },
      {
          label: 'KYC',
          routerLink: 'kyc'
      },
      {
          label: 'Cliente',
          routerLink: 'customer'
      },
      {
          label: 'Confirmation',
          routerLink: 'confirmation'
      }];

    this.subscription = this.registerService.registerComplete$.subscribe((personalInformation) =>{
      this.messageService.add({severity:'success', summary:'Completo', detail: 'Estimado, ' + personalInformation.firstName + ' ' + personalInformation.lastName + ' registro completo.'});
    });
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}