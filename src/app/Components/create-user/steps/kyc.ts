import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { lastValueFrom } from 'rxjs';

import { RegisterService } from 'src/app/Services/register.service';
import { CatalogsService } from 'src/app/Services/catalogs.service';
import { ClientRegisterService } from 'src/app/Services/client-register.service';

import { ResponseDTO } from 'src/app/Models/ResponseDTO';
import { CompletarKyc } from 'src/app/Models/Lafise/Kyc';
import { CompletarDocument } from 'src/app/Models/Lafise/Document';
import { CompletarMedia, MediaLafise } from 'src/app/Models/Lafise/Media';

import * as moment from 'moment';

@Component({
    templateUrl: 'kyc.html',
    providers: [MessageService],
})
export class KycComponent implements OnInit {
    constructor(
        public messageService: MessageService,
        public registerService: RegisterService,
        public clientService: ClientRegisterService,
        private http: HttpClient,
        private config: PrimeNGConfig,
        private catalogService: CatalogsService,
        private router: Router
    ) {
      
    }
    
    currentLocation: string = this.router.url;
    userData: any;
    kycData: any;
    loading: boolean = true;
    submitted: boolean = false;

    IdentificationTypes: any;
    imageTypes: any[] = [
        { code: 'Selfie', description: 'Foto tomada a uno mismo', file: null, data: {name: '', size: 0, type: ''}  }, 
        { code: 'FrontalDocument', description: 'Documento de identificación con la cara del titular visible', file: null, data: {name: '', size: 0, type: ''} }, 
        { code: 'BackDocument', description: 'Documento de identificación con el reverso del documento visible', file: null, data: {name: '', size: 0, type: ''} }, 
        { code: 'Signature', description: 'Foto de la firma del titular del documento', file: null, data: {name: '', size: 0, type: ''}}
    ];

    ngOnInit() {
        this.http.get('assets/locales/es.json').subscribe((data: any) => {
            this.config.setTranslation(data); // Traduce a español.
        });

        this.IdentificationTypes = [];
        this.userData = this.registerService.createAccountInformation.registerInformation;
        this.kycData = this.registerService.createAccountInformation.personalInformation;
        if (this.userData.firstName === "") {
            this.userData.firstName = sessionStorage.getItem('firstname');
            this.userData.lastName = sessionStorage.getItem('lastname');
        }
        // Recupero tipo de identificación.
        this.loadIdentificationTypes();
    }

    async loadIdentificationTypes() {
        try {
            const res: any = await lastValueFrom(this.catalogService.GetCatalog("IdentificationType", "BLNI"));
            const responseDTO: ResponseDTO = res.response;

            if (responseDTO.success) {
                this.IdentificationTypes = responseDTO.result;
            }
        } catch (error) {
            this.handleError(error, 'Hubo un error al recuperar los tipos de identificación.');
        } finally {
            this.loading = false;
        }
    }

    onFileSelect(event: any, code: string) {
        let files = event.target.files;
        const fileList: File[] = Array.from(files);

        this.convertFilesToBase64(fileList, code);
    }

    convertFilesToBase64(files: File[], code: string): void {
        for (const file of files) {
            
            if (!this.ControlImageSize(file)) {
                continue;
            }

            const reader = new FileReader();
    
            reader.onload = (e) => {
                const base64String = e.target?.result as string;
                const foundType = this.imageTypes.find(type => type.code === code);
                if (foundType) {
                    foundType.file = base64String;
                    foundType.data.name = file.name;
                    foundType.data.size = file.size;
                    foundType.data.type = file.type;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    ControlImageSize(file: any): boolean {
        if (file.size > 256 * 1024) {
            this.messageService.add({ severity: 'warn',
                summary: 'Error', detail: 'El tamaño del archivo no debe superar los 256 KB.'
            });
            return false;
        }
        return true;
    }

    onDeleteImage(code: string) {
        const foundType = this.imageTypes.find(type => type.code === code);
        
        if (foundType) {
            foundType.file = "";
            foundType.data.name = "";
            foundType.data.size = 0;
            foundType.data.type = "";
        }
    }

    async nextPage() {

        this.kycData.files = this.imageTypes.filter(type => type.file).map(type => ({name: type.data.name, file: type.file }));
        
        this.registerService.createAccountInformation.registerInformation = this.userData;
        this.registerService.createAccountInformation.personalInformation = this.kycData;

        const fullName = `${this.userData.firstName} ${this.kycData.middleName ? this.kycData.middleName + ' ' : ''}${this.userData.lastName}${this.kycData.secondSurname ? ' ' + this.kycData.secondSurname : ''}`;

        if (this.registerService.isValidPersonal()) {
            this.loading = true;
            const documentLafise = CompletarDocument(
                this.kycData.documentNumber, 
                this.kycData.documentType,
                moment(this.kycData.expiryDate).format("yyyy-MM-DD")
            );
            
            const mediaLafise = this.imageTypes.map(type => CompletarMedia(type.code, type.file));
                
            const kyc_data = CompletarKyc("BiometricCheck", fullName, documentLafise, mediaLafise);

            try {
                const res: any = await  lastValueFrom(this.clientService.KYCCheck(kyc_data, 'BLNI'));
                const responseDTO = res.response.value;

                if (responseDTO.success) {
                    const redirectTo = this.currentLocation.replace('/kyc', '/customer');
                    this.router.navigate([redirectTo]);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: responseDTO.message
                    });
                }
            } catch (error) {
                this.handleError(error, 'Hubo un error al grabar datos.')
            } finally {
                this.loading = false;
            }
            
            return;
        }
        else {
            let errorMessage = this.registerService.verifyPersonal();
            this.messageService.add({severity: 'warn', life: 5000,
                        summary: 'Faltan datos', detail: errorMessage});
        }

        this.submitted = true;
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