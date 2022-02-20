import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConektaComponent } from './pages/conekta/conekta.component';
import { OpenpayComponent } from './pages/openpay/openpay.component';
import { PasarelaPagoComponent } from './pages/pasarela-pago/pasarela-pago.component';

@NgModule({
  declarations: [
    AppComponent,
    ConektaComponent,
    OpenpayComponent,
    PasarelaPagoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
