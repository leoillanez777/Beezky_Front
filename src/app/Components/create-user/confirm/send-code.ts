import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';

import { LoginService } from 'src/app/Services/login.service';
import { ResponseDTO } from 'src/app/Models/ResponseDTO';


@Component({
  templateUrl: 'send-code.html',
  providers: [MessageService],
})

export class SendCodeToEmailComponent implements OnInit {

  email: string = "";
  loading: boolean = false;

  constructor(
    public messageService: MessageService,
    private loginService: LoginService, 
    private router: Router
  ) {

  }
  
  ngOnInit(): void {
    this.email = sessionStorage.getItem('user') || 'ejemplo@mail.com';
  }

  onSendCode(): void {
    this.loading = true;

    this.loginService.ReSendCode(this.email)
      .pipe(
        catchError(error => {
          let errorMessage = error.message ?? "Error al enviar código para verificar correo.";
          this.messageService.add({severity: 'error', life: 5000,
              summary: 'Error', detail: errorMessage});
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((res: any) => {
        const responseDTO: ResponseDTO = res.response;
        if (responseDTO.success) {
          const userId: string = sessionStorage.getItem('id') || responseDTO.result;
          this.router.navigate(['verify-email/validate-code'], { queryParams: { userId: userId } });
        }
        else {
          this.messageService.add({ severity: 'warn', life: 5000, summary: 'Advertencia', detail: responseDTO.message });
        }

        this.loading = false;
      });
  }

}