import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

import { LoginService } from 'src/app/Services/login.service';
import { ResponseDTO } from 'src/app/Models/ResponseDTO';

@Component({
    selector: 'user-setting',
    templateUrl: './setting.html',
    providers: [MessageService]
})
export class UserSetting implements OnInit {
  formGroup!: FormGroup;
  loading: boolean = true;

  constructor(
    private loginSerice: LoginService,
    public messageService: MessageService
  ) {
  }

  ngOnInit() {
    
    this.formGroup = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        middleName: new FormControl(''),
        lastName: new FormControl('', [Validators.required]),
        secondSurName: new FormControl(''),
        loginWith2FA: new FormControl(false),
        avatar: new FormControl('assets/svg/account.svg')
    });
    this.getUserInfo();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    const fileList: File[] = Array.from(files);

    this.convertFilesToBase64(fileList);
  }

  convertFilesToBase64(files: File[]): void {
    for (const file of files) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const image64String = e.target?.result as string;
          this.formGroup.get('avatar')?.setValue(image64String);
        };
        reader.readAsDataURL(file);
    }
  }

  async postUserInfo() {
    this.loading = true;
    try {
      const updateData = this.buildUpdateData();
      const res: any = await lastValueFrom(this.loginSerice.UpdatePersonalData(updateData));
      sessionStorage.setItem('avatar', updateData.avatar);
    }
    catch (error) {
      this.handleError(error, 'Hubo un error al actualizar los datos del usuario.');
    }
    finally {
      this.loading = false;
    }
  }

  async getUserInfo() {
    try {
      const res: any = await lastValueFrom(this.loginSerice.GetPersonalData());
      const responseDTO: ResponseDTO = res.response;

      if (responseDTO.success) {
        const data = responseDTO.result;
        this.formGroup.get('firstName')?.setValue(data.firstName);
        this.formGroup.get('middleName')?.setValue(data.middleName);
        this.formGroup.get('lastName')?.setValue(data.lastName);
        this.formGroup.get('secondSurName')?.setValue(data.secondSurName);
        this.formGroup.get('loginWith2FA')?.setValue(data.loginWith2FA);
        this.formGroup.get('avatar')?.setValue('data:image/png;base64,' + data.avatar);
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: responseDTO.message })
      }
    } catch (error) {
        this.handleError(error, 'Hubo un error al recuperar los datos del usuario.');
    } finally {
        this.loading = false;
    }

  }

  private buildUpdateData(): any {
    return {
      firstName: this.formGroup.get('firstName')?.value,
      middleName: this.formGroup.get('middleName')?.value,
      lastName: this.formGroup.get('lastName')?.value,
      secondSurName: this.formGroup.get('secondSurName')?.value,
      loginWith2FA: this.formGroup.get('loginWith2FA')?.value,
      avatar: this.extractContentWithoutPrefix(this.formGroup.get('avatar')?.value)
    };
  }

  private extractContentWithoutPrefix(base64String: string): string {
    return base64String.split(';base64,')[1];
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