import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
    
    @Injectable()
    export class RegisterService {
        createAccountInformation = {
            registerInformation: {
                firstName: '',
                lastName: '',
                password: '',
                confirmPassword: '',
                emailAddress: ''
            },
            personalInformation: {
                middleName: null,
                secondSurname: null,
                documentType: null,
                documentNumber: null,
                expiryDate: null,
                files: [],
            },
            customerInformation: {
                birthdate: '',
                phone: '',
                countryResidence: '',
                nationality: '',
                secondNationality: ''
            }
        };
    
        private registerComplete = new Subject<any>();
    
        registerComplete$ = this.registerComplete.asObservable();
    
        getInformation() {
            return this.createAccountInformation;
        }
    
        setInformation(createAccountInformation: any) {
            this.createAccountInformation = createAccountInformation;
        }

        isValidPersonal(): boolean {
            const { documentType, documentNumber, expiryDate, files } = this.createAccountInformation.personalInformation;

            return !!documentType && 
                !!documentNumber && 
                !!expiryDate && 
                Array.isArray(files) && 
                files.length > 3;
        }

        verifyPersonal(): string {
            const { documentType, documentNumber, expiryDate, files } = this.createAccountInformation.personalInformation;
            if (!documentType) {
                return "Debe seleccionar el tipo de identificación.";
            }
            if (!documentNumber) {
                return "El campo Identificador no puede estar vacío";
            }
            if (!expiryDate) {
                return "La fecha de vencimiento del documento es requerida.";
            }
            if (Array.isArray(files) && files.length < 4) {
                return "Debe cargar todas las imagenes.";
            }
            return "";
        }
    
        complete() {
            this.registerComplete.next(this.createAccountInformation.registerInformation);
        }
    }
    