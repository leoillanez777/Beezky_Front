import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';

import { LoginService } from 'src/app/Services/login.service';
import { ValidateEmail } from 'src/app/Models/Login';
import { ResponseDTO } from 'src/app/Models/ResponseDTO';


@Component({
  templateUrl: 'validate-code.html',
  providers: [MessageService],
})

export class ValidateCodeComponent implements OnInit {

  email: string = "";
  code: string = "";
  userId: string = "";
  loading: boolean = true;
  withCode: boolean = false;

  constructor(
    public messageService: MessageService,
    private loginService: LoginService, 
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }
  
  ngOnInit(): void {
    this.email = sessionStorage.getItem('user') || 'ejemplo@mail.com';

    // Suscribirse a los cambios de parámetros
    // this.codigo = this.route.snapshot.queryParamMap.get('codigo');
    this.userId = this.route.snapshot.queryParamMap.get('userId') || localStorage.getItem('id') || '';
    this.code = this.route.snapshot.queryParamMap.get('code') || '';
    if (this.code !== "") {
      this.withCode = true;
      this.onValidateCode();
    }
    else {
      this.loading = this.withCode = false;
    }
    
  }

  onPrevPage(): void {
    this.router.navigate(['verify-email/send-code']);
  }

  onValidateCode(): void {
    if (this.code === "") {
      this.messageService.add({ severity:'error', summary: 'Error en el código', detail: 'El campo del código no puede estar vacío',life: 5000 });
    }
    else {
      this.loading = true;
      const validate: ValidateEmail = {
        userId: this.userId,
        code: this.code
      };
      this.loginService.ValidateCode(validate)
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
            this.router.navigate(['verify-email/confirmation-code']);
          }
          else {
            this.messageService.add({severity: 'warn', life: 5000, summary: 'Aviso', detail: responseDTO.message});
            this.loading = false;
          }
        });
    }
  }

}