import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { MessageService } from 'primeng/api';

import { LoginService } from 'src/app/Services/login.service';
import { LoginModel } from 'src/app/Models/Login';
import { ResponseDTO } from 'src/app/Models/ResponseDTO';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  // Usuario = new FormControl('', [Validators.required, Validators.email]);
  // Password = new FormControl('', [Validators.required]);

  loading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public messageService: MessageService,
    private loginService: LoginService, 
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      Usuario: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]]
    }) 

  }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (this.loading) return;
    if (this.form.status === "INVALID") {
      for(const ctrl in this.form.controls) {
        const control = this.form.get(ctrl);
        if (control?.hasError('required')) {
          this.messageService.add({severity:'warn', summary: 'Campo requerido', detail: `El campo ${ctrl}, es obligatorio`});
        }
        if (control?.hasError('email')) {
          this.messageService.add({severity:'warn', summary: 'Correo electrónico incorrecto', detail: `El correo electrónico ingresado no es correcto`});
        }
      }
      return;
    }
    this.loading = true;
    const login: LoginModel = {
      user: this.form.get('Usuario')?.value,
      pass: this.form.get('Password')?.value
    }

    this.loginService.Login(login)
    .pipe(
      catchError(error => {
        let errorMessage = error.message ?? "Error al recuperar los datos del usuario.";
        this.messageService.add({severity: 'error', life: 5000,
            summary: 'Error', detail: errorMessage});
        this.loading = false;
        return of(null);
      })
    )
    .subscribe((res: any) => { 
      const responseDTO: ResponseDTO = res.response;
      sessionStorage.setItem("user", responseDTO.result.email);
      if (responseDTO.success) {
          this.loginService.LoginSessionSuccess(responseDTO);
          this.router.navigate(['/dashboard']);
      }
      else {
        this.handleLoginError(responseDTO);
      }
      this.loading = false;
    });

  }

  public getErrorsMessage(control: string): string {
    const ctrl = this.form.get(control);
    if (ctrl?.errors) {
      for (const key in ctrl.errors) {
        switch (key) {
          case "email":
            return "Correo electrónico incorrecto";
          case "required":
            return `El campo ${control} es obligatorio`;
        }
      }
    }
    return "";
  }

  private handleLoginError(responseDTO: ResponseDTO): void {
    if (responseDTO.result.messages && responseDTO.result.messages.length > 0) {
      responseDTO.result.messages.forEach((msg: any) => {
        switch (msg.code) {
          case "EmailRequired":
            sessionStorage.setItem("user", responseDTO.result.email);
            this.messageService.add({severity: 'warn', summary: "Advertencia", detail: msg.description});
            this.router.navigate(['verify-email/send-code']);
            break;
          case "LoginWith2fa":
            sessionStorage.setItem("user", responseDTO.result.email);
            this.messageService.add({severity: 'info', summary: "Autenticar con Doble Factor", detail: msg.description});
            this.router.navigate(['login-2FA']);
            break;
          default:
            this.messageService.add({severity: 'error', summary: "Error", detail: msg.description});
            break;
        }
      });
    } else {
      this.messageService.add({severity: 'error', life: 5000, summary: 'Error', detail: responseDTO.message});
    }
  }
}
