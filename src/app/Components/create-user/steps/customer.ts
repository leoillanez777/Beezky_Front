import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService, PrimeNGConfig } from "primeng/api";
import { lastValueFrom } from "rxjs";
import { CatalogsService} from 'src/app/Services/catalogs.service';
import { ClientRegisterService } from 'src/app/Services/client-register.service';

import { ResponseDTO } from "src/app/Models/ResponseDTO";

import * as moment from 'moment';

interface DefaultList {
  code: string
  description: string
}

@Component({
  templateUrl: 'customer.html',
  providers: [MessageService],
})
export class CustomerComponent implements OnInit {
  currentLocation: string = this.router.url;
  clientForm: FormGroup;
  submitted: boolean = false;
  loading: boolean[] = [true, true];

  personTypeList: DefaultList[] = [
    { code: 'NAT', description: 'Persona Natural' }, 
    { code: 'JSA', description: 'Persona Jurídica' }
  ];
  sexList: DefaultList[] = [
    { code: 'M', description: 'Masculino' }, 
    { code: 'F', description: 'Femenino' }
  ];
  idTypeList:         DefaultList[] = [];
  countriesList:      DefaultList[] = [];
  geoLocationList:    DefaultList[] = [];
  maritalStatusList:  DefaultList[] = [];
  titleList:          DefaultList[] = [];
  occupationList:     DefaultList[] = [];
  economyActList:     DefaultList[] = [];

  constructor(
    public messageService: MessageService,
    private router: Router,
    private catService: CatalogsService,
    private clientService: ClientRegisterService,
    private fb: FormBuilder,
    private http: HttpClient,
    private config: PrimeNGConfig,
  ) {
    const email = sessionStorage.getItem('user');
    this.clientForm = this.fb.group({
      FirstName:              ['', [Validators.required, Validators.maxLength(15)]],
      MiddleName:             ['', [Validators.maxLength(15)]],
      LastName:               ['', [Validators.required, Validators.maxLength(15)]],
      SecondSurname:          ['', [Validators.maxLength(15)]],
      DateOfBirth:            [null, [Validators.required]],
      IdentificationType:     ['', [Validators.required]],
      Identification:         ['', [Validators.required, Validators.maxLength(16)]],
      IdentificationExpirationDate: [null, [Validators.required]],
      MobilePhoneNumber:      ['', [Validators.pattern("[0-9]*"), Validators.required, Validators.maxLength(11)]],
      Email:                  [email, [Validators.email, Validators.required, Validators.maxLength(100)]],
      CountryOfBirth:         ['', [Validators.required]],
      Nationality:            ['', [Validators.required]],
      CountryOfResidence:     ['', [Validators.required]],
      SecondNationality:      [''],
      GeographicLocation:     ['', [Validators.required]],
      HomeAddressLine1:       ['', [Validators.required, Validators.maxLength(35)]],
      HomeAddressLine2:       ['', [Validators.maxLength(35)]],
      HomeAddressLine3:       ['', [Validators.maxLength(35)]],
      PersonType:             ['NAT', [Validators.required]],
      Sex:                    ['', [Validators.required]],
      MaritalStatus:          ['', [Validators.required]],
      Title:                  ['', [Validators.required]], // Profesión
      EconomicActivity:       ['', [Validators.required]], //WORK
      Employer:               ['', [Validators.maxLength(30)]], //WORK
      Salary:                 [0, [Validators.min(1)]], //WORK
      Occupation:             [''], //WORK
      WorkPhoneNumber:        ['', [Validators.maxLength(11)]], //WORK
      IsPep:                  [false],
      IsPnp:                  [false],
    });
  }

  async ngOnInit() {
    this.http.get('assets/locales/es.json').subscribe((data: any) => {
      this.config.setTranslation(data); // Traduce a español.
    });

    await this.getIdType();
    await this.getCountries();
    await this.getGeographicLocation();
    await this.getMaritalStatus();
    await this.getTitles();
    this.loading[0] = false;
    
    await this.getOccupation();
    await this.getEconomyAct();
    this.loading[1] = false;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.clientForm.valid) {
      const properties = [
        'first_name', 'middle_name', 'last_name', 'second_surname',
        'identification_type', 'identification', 'mobile_phone_number',
        'email', 'date_of_birth', 'country_of_residence', 'home_address_line1',
        'home_address_line2', 'home_address_line3', 'geographic_location',
        'person_type', 'sex', 'identification_expiration_date', 'employer',
        'position_in_company', 'country_of_birth', 'nationality',
        'work_phone_number', 'title', 'marital_status', 'salary', 'occupation',
        'economic_activity', 'is_pep', 'is_pnp', 'second_nationality'
      ];

      const clientData: { [key: string]: any } = {};      
      properties.forEach(property => {
        const formattedProperty = property.replace(/_./g, match => match.charAt(1).toUpperCase()); // Capitalizar palabras y eliminar guiones bajos
        const control = this.clientForm.get(formattedProperty.charAt(0).toUpperCase() + formattedProperty.slice(1));
        let value = control ? control.value : null;

        if (property === 'mobile_phone_number' || property === 'work_phone_number') {
          if (value === "") { value = 0; }
          else { value = parseInt(value, 10); }
        }

        if (property === 'date_of_birth' || property === 'identification_expiration_date') {
          value = moment(value).format("yyyy-MM-DD");
        }

        clientData[property] = value;
      });

      const res: any = await lastValueFrom(this.clientService.CreateCustomer(clientData));
      const respDto = res.response as ResponseDTO;
      if (respDto.success) { 
        const redirectTo = this.currentLocation.replace('/customer', '/confirmation');
        this.router.navigate([redirectTo]);
      }
      else {
        this.messageService.add({ severity: "error", summary: "Error al crear el cliente", detail: respDto.message, life: 5000 });
      }

    } else {
      this.messageService.add({ severity: 'warn', summary: 'Falta completar datos', life: 5000,
        detail: 'Asegúrate de llenar todos los campos correctamente, tanto en Personal y Laboral.'
      })
    }
  }

  async getTypeResponse(code: string) {
    const res: any = await lastValueFrom(this.catService.GetCatalog(code, 'BLNI'));
    return res.response as ResponseDTO;
  }

  async getIdType() {
    const res: ResponseDTO = await this.getTypeResponse("IdentificationType");
    if (res.success) {
      this.idTypeList = res.result;
    }
  }
  
  async getCountries() {
    const res: ResponseDTO = await this.getTypeResponse("Country");
    if (res.success) {
      this.countriesList = res.result;
    }
  }

  async getGeographicLocation() {
    const res: ResponseDTO = await this.getTypeResponse("GeographicLocation");
    if (res.success) {
      this.geoLocationList = res.result;
    }
  }

  async getMaritalStatus() {
    const res: ResponseDTO = await this.getTypeResponse("MaritalStatus");
    if (res.success) {
      this.maritalStatusList = res.result;
    }
  }

  async getTitles() {
    const res: ResponseDTO = await this.getTypeResponse("Title");
    if (res.success) {
      this.titleList = res.result;
    }
  }

  async getOccupation() {
    const res: ResponseDTO = await this.getTypeResponse("Occupation");
    if (res.success) {
      this.occupationList = res.result;
    }
  }

  async getEconomyAct() {
    const res: ResponseDTO = await this.getTypeResponse("EconomicActivity");
    if (res.success) {
      this.economyActList = res.result;
    }
  }

  get LoadingAll() { return this.loading.some((isLoading: boolean) => isLoading);}
  get FirstName() { return this.clientForm.get('FirstName'); }
  get MiddleName() { return this.clientForm.get('MiddleName'); }
  get LastName() { return this.clientForm.get('LastName'); }
  get SecondSurname() { return this.clientForm.get('SecondSurname'); }
  get DateOfBirth() { return this.clientForm.get('DateOfBirth'); }
  get IdentificationType() { return this.clientForm.get('IdentificationType'); }
  get Identification() { return this.clientForm.get('Identification'); }
  get IdentificationExpirationDate() { return this.clientForm.get('IdentificationExpirationDate'); }
  get MobilePhoneNumber() { return this.clientForm.get('MobilePhoneNumber'); }
  get Email() { return this.clientForm.get('Email'); }
  get CountryOfBirth() { return this.clientForm.get('CountryOfBirth'); }
  get Nationality() { return this.clientForm.get('Nationality'); }
  get CountryOfResidence() { return this.clientForm.get('CountryOfResidence'); }
  get GeographicLocation() { return this.clientForm.get('GeographicLocation'); }
  get HomeAddressLine1() { return this.clientForm.get('HomeAddressLine1'); }
  get HomeAddressLine2() { return this.clientForm.get('HomeAddressLine2'); }
  get HomeAddressLine3() { return this.clientForm.get('HomeAddressLine3'); }
  get Sex() { return this.clientForm.get('Sex'); }
  get MaritalStatus() { return this.clientForm.get('MaritalStatus'); }
  get Title() { return this.clientForm.get('Title'); }
  get Employer() { return this.clientForm.get('Employer'); }
  get Salary() { return this.clientForm.get('Salary'); }
  get WorkPhoneNumber() { return this.clientForm.get('WorkPhoneNumber'); }
  get EconomicActivity() { return this.clientForm.get('EconomicActivity'); }
}