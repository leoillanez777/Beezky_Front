import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { LoginWith2FA } from './Components/login/loginWith2FA';

import { ClientRegisterComponent } from './Components/client-register/client-register.component';
import { ClientAccountsComponent } from './Components/accounts/client-accounts/client-accounts.component';
import { RouteguardGuard } from './routeguard.guard';
import { TransferenciasComponent } from './Components/transferencias/transferencias.component';
import { TransferOwnaccountsComponent } from './Components/transfer-ownaccounts/transfer-ownaccounts.component';
import { AccountRegisterComponent } from './Components/accounts/account-register/account-register.component';
import { AccountsSummaryComponent } from './Components/accounts/accounts-summary/accounts-summary.component';
import { ProductComponent } from './Components/products/product.component';

import { CreateUserComponent } from './Components/create-user/create-user.component';
import { AccountComponent } from './Components/create-user/steps/account';
import { KycComponent } from './Components/create-user/steps/kyc';
import { CustomerComponent } from './Components/create-user/steps/customer';
import { ConfirmationComponent } from './Components/create-user/steps/confirmation';

import { VerifyEmailComponent } from './Components/create-user/verify-email.component'
import { SendCodeToEmailComponent } from './Components/create-user/confirm/send-code'
import { ValidateCodeComponent } from './Components/create-user/confirm/validate-code'
import { ConfirmationCodeComponent } from './Components/create-user/confirm/confirmation-code'

import { UserSetting } from './Components/settings/setting'


const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login-2FA', component: LoginWith2FA, pathMatch: 'full' },
  { path: 'create-user', component: CreateUserComponent,
    children: [
      { path: 'account', component: AccountComponent },
      { path: 'kyc', component: KycComponent, canActivate: [RouteguardGuard] },
      { path: 'customer', component: CustomerComponent, canActivate: [RouteguardGuard] },
      { path: 'confirmation', component: ConfirmationComponent, canActivate: [RouteguardGuard] },
      { path: '', redirectTo: 'account', pathMatch: 'full' },
    ]
  },
  { path: 'verify-email', component: VerifyEmailComponent,
    children: [
      { path: 'send-code', component: SendCodeToEmailComponent },
      { path: 'validate-code', component: ValidateCodeComponent },
      { path: 'confirmation-code', component: ConfirmationCodeComponent },
      { path: '', redirectTo: 'send-code', pathMatch: 'full' },
    ]
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [RouteguardGuard],
    children: [
      { path: 'user-setting', component: UserSetting, pathMatch: 'full', canActivate: [RouteguardGuard] },
      { path: 'products', component: ProductComponent, pathMatch: 'full', canActivate: [RouteguardGuard] },
      { path: 'client-register', component: ClientRegisterComponent, canActivate: [RouteguardGuard],
        children: [
          { path: 'kyc', component: KycComponent, canActivate: [RouteguardGuard] },
          { path: 'customer', component: CustomerComponent, canActivate: [RouteguardGuard] },
          { path: 'confirmation', component: ConfirmationComponent, canActivate: [RouteguardGuard] },
          { path: '', redirectTo: 'kyc', pathMatch: 'full' },
        ]  
      },
      { path: 'client-accounts',        component: ClientAccountsComponent,       pathMatch: 'full', canActivate: [RouteguardGuard] },
      { path: 'transferencias',         component: TransferenciasComponent,       pathMatch: 'full', canActivate: [RouteguardGuard] },
      { path: 'transfer-ownaccounts',   component: TransferOwnaccountsComponent,  pathMatch: 'full', canActivate: [RouteguardGuard] },
      { path: 'account-register',       component: AccountRegisterComponent,      pathMatch: 'full', canActivate: [RouteguardGuard] },
      { path: 'account-summary',        component: AccountsSummaryComponent,      pathMatch: 'full', canActivate: [RouteguardGuard] },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
