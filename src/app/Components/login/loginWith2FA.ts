import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { LoginService } from 'src/app/Services/login.service';
import { ResponseDTO } from 'src/app/Models/ResponseDTO';

@Component({
  selector: 'login-with-2-fa',
  templateUrl: './loginWith2FA.html',
  providers: [MessageService]
})

export class LoginWith2FA implements OnInit {
  formGroup!: FormGroup;
  loading: boolean = false;

  constructor(
    private loginSerice: LoginService,
    public messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      TwoFactorCode: new FormControl('', [Validators.required]),
      RememberMachine: new FormControl(false)
    });
  }

  async login2FA() {
    this.loading = true;
    try {
      const data2Fa = this.buildLoginData();
      const res: any = await lastValueFrom(this.loginSerice.LoginWith2FA(data2Fa));
      console.log(res);
      const responseDTO = res.response;
      if (responseDTO.success) {
        this.loginSerice.LoginSessionSuccess(responseDTO);
        this.router.navigate(['/dashboard']);
      }
      else {
        this.handleError(responseDTO.result.messages, responseDTO.message);
      }
      
    }
    catch (error) {
      this.handleError(error, 'Hubo un error intentar ingresar el doble factor.');
    }
    finally {
      this.loading = false;
    }
  }

  private buildLoginData(): any {
    return {
      user: sessionStorage.getItem('user'),
      pass: this.formGroup.get('TwoFactorCode')?.value,
      machine: this.formGroup.get('RememberMachine')?.value
    };
  }

  private handleError(error: any, defaultMessage: string) {
    let errorMessage = defaultMessage;
    if (typeof error === 'object' && error.error && error.error.errors) {
      const errorValues = Object.keys(error.error.errors).map(key => error.error.errors[key]);
      errorMessage = errorValues.join('\n');
    } else if (error && error.message) {
      errorMessage = error.message;
    } else if (error && error.error && typeof error.error === 'string') {
      errorMessage = error.error; // Trata error.error como una cadena de error directa.
    }

    this.messageService.add({ severity: 'error', life: 5000, summary: 'Error', detail: errorMessage });
  }

}