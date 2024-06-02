import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/Services/register.service';
import { CreateUserService } from 'src/app/Services/create-user.service'
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { CompletarCampos } from 'src/app/Models/UserAccount'
import { catchError, of } from 'rxjs';
import { ResponseDTO } from 'src/app/Models/ResponseDTO';

@Component({
    templateUrl: 'account.html',
    providers: [MessageService],
})
export class AccountComponent implements OnInit {
    userData: any;
    loading: boolean = false;
    submitted: boolean = false;

    constructor(
        public messageService: MessageService,
        public registerService: RegisterService, 
        private router: Router,
        private createUserService: CreateUserService
    ) {}

    ngOnInit() {
        this.userData = this.registerService.getInformation().registerInformation;
    }

    nextPage() {
        if (this.userData.password !== this.userData.confirmPassword) {
            this.messageService.add({severity: 'warn', life: 5000,
                summary: 'Contraseñas no coinciden', 
                detail: 'Por favor, verifica que ambas contraseñas coincidan antes de continuar.'});
            return;
        }


        if (this.userData.firstName && this.userData.lastName  
            && this.userData.password && this.userData.emailAddress) {
            this.loading = true;
            const create_account = CompletarCampos(
                this.userData.emailAddress,
                this.userData.firstName,
                this.userData.lastName,
                this.userData.password
            );
            this.registerService.createAccountInformation.registerInformation = this.userData;
            this.createUserService.CreateAccount(create_account)
            .pipe(
                catchError(error => {
                    let errorMessage = error.message ?? "Hubo un error al crear la cuenta.";
                    this.messageService.add({severity: 'error', life: 5000,
                        summary: 'Error', detail: errorMessage});
                    this.loading = false;
                    return of(null);
                })
            )
            .subscribe((res: any) => { 
                if (res && res.responseDTO) {
                    const responseDTO: ResponseDTO = res.responseDTO;
                    if (responseDTO.success) {
                        sessionStorage.setItem("token", responseDTO.result.token);
                        sessionStorage.setItem("id", responseDTO.result.userId);
                        sessionStorage.setItem("firstname", responseDTO.result.name);
                        sessionStorage.setItem("lastname", responseDTO.result.lastName);
                        sessionStorage.setItem("user", responseDTO.result.email);
                        this.router.navigate(['create-user/kyc']);
                    }
                    else {
                        responseDTO.result.messages.forEach((msg: any) => {
                            this.messageService.add({severity: 'error', summary: 'Error', detail: msg.description, life: 6000});
                        });
                    }
                }
                else {
                    this.messageService.add({severity: 'error', life: 5000, summary: 'Error', detail: 'Hubo un error al crear la cuenta.'});
                }
                this.loading = false;
            });

            return;
        }

        this.submitted = true;
    }
}