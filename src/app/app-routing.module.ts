import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// * Components
import { PasarelaPagoComponent } from './pages/pasarela-pago/pasarela-pago.component';
import { OpenpayComponent } from './pages/openpay/openpay.component';
import { ConektaComponent } from './pages/conekta/conekta.component';

const routes: Routes = [
  { path: '', redirectTo: 'payment-gateways', pathMatch: 'full' },
  { path: 'payment-gateways', component: PasarelaPagoComponent },
  { path: 'openpay', component: OpenpayComponent },
  { path: 'conekta', component: ConektaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
