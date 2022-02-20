import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// * Environment
import { environment } from '../../../environments/environment';

// * Jquery
declare var $: any;

// * Define variable for use openpay
declare const OpenPay: any;

@Component({
  selector: 'app-openpay',
  templateUrl: './openpay.component.html',
  styleUrls: []
})
export class OpenpayComponent {

  // * Varibales
  private PUBLIC_KEY = environment.openpay.public_key;
  private PRIVATE_KEY = environment.openpay.private_key;
  private authorizationData = 'Basic ' + btoa(this.PRIVATE_KEY + ':' + this.PRIVATE_KEY);
  private deviceSessionId: string = '';
  private idComerce: string = environment.openpay.idComerce;

  private URL_openpay = `https://sandbox-api.openpay.mx/v1/${this.idComerce}/charges`;
  private URL_openpay_test_openpay = 'http://localhost:8080/api/payments/pay-openpay';
  private URL_openpay_test_openpay_miapi = 'http://localhost:8080/api/payments/pay-openpay-miapi';

  credentials = {
    token_id: '',
    deviceSessionId: '',
    holder_name: '',
    card_number: '',
    expiration_month: '',
    expiration_year: '',
    cvv2: '',
  };

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.initOpenPay();
  }

  private initOpenPay() {
    OpenPay.setId(this.idComerce);
    OpenPay.setApiKey(this.PUBLIC_KEY);
    OpenPay.setSandboxMode(true);
    // * Device id is generated
    this.deviceSessionId = OpenPay.deviceData.setup("payment-form", "deviceIdHiddenFieldName");
  }

  public pay() {
    console.log('pay');
    $("#pay-button").prop("disabled", true);
    OpenPay.token.extractFormAndCreate('payment-form', (response: any) => {
      var token_id = response.data.id;
      $('#token_id').val(token_id);
      this.credentials.token_id = token_id;
      this.credentials.deviceSessionId = this.deviceSessionId;
      this.requestHTTP();
    }, (response: any) => {
      console.log('Error: ', response);
      $("#pay-button").prop("disabled", false);
    });
  }

  private requestHTTP() {
    // * order_id is generated
    const order_id = `${(Math.floor(Math.random() * (999999 - 100000)) + 100000)}-${Date.now()}`;
    const amount = Math.floor(Math.random() * (5000 - 0)) + 0;

    // * Data for the payment
    const data = {
      source_id: this.credentials.token_id,
      method: "card",
      amount,
      currency: "MXN",
      description: "Cargos de prueba con OpenPay",
      order_id,
      device_session_id: this.credentials.deviceSessionId,
      customer: {
        name: this.credentials.holder_name,
        last_name: this.credentials.holder_name,
        phone_number: "6141234567",
        email: "prueba@mail.com"
      }
    };

    console.log('Información para el server: ', data);

    // * Headers for request with authorization
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorizationData
      }),
    };

    // * Request to create a payment
    // this.URL_openpay
    // this.URL_openpay_test
    // this.URL_openpay_test_miapi
    this.http.post(this.URL_openpay_test_openpay_miapi, data, headerOptions).subscribe(
      (response: any) => {
        console.log('Respuesta: ', response);
      },
      (error: any) => {
        console.log('Error: ', error);
      }
    );
  }

  redirectTo(url: string) {
    window.location.href = url;
  }

}
