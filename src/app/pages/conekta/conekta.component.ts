import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// * Jquery
declare var $: any;

// * Define variable for use conekta
declare const window: any;

@Component({
  selector: 'app-conekta',
  templateUrl: './conekta.component.html',
  styleUrls: []
})
export class ConektaComponent {

  // * Varibales
  jsonConfig: any;

  private URL_conekta: string = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.initConekta();
  }

  private initConekta() {
    // * Request to create a token
    this.http.get(this.URL_conekta + '/generateToken-conekta').subscribe(
      (response: any) => {
        console.log('Token iframe: ', response.body);
        this.jsonConfig = response.body;
        this.initConektaForm();
      },
      (error: any) => {
        console.log('Error: ', error);
      }
    );
  }

  private initConektaForm() {
    window.ConektaCheckoutComponents.Card({
      targetIFrame: "#conektaIframeContainer",
      allowTokenization: true,
      checkoutRequestId: this.jsonConfig.checkout.id, // * Tokeen generate in the backend
      publicKey: "key_GzL2yJZqW47shx8AwgLax5Q", // Keys: https://developers.conekta.com/docs/como-obtener-tus-api-keys
      options: {
        styles: {
          // inputType modifica el diseño del Web Checkout Tokenizer
          //        inputType: 'basic' // 'basic' | 'rounded' | 'line'
          inputType: 'rounded',
          // buttonType modifica el diseño de los campos de llenado de información del  Web Checkout Tokenizer
          //        buttonType: 'basic' // 'basic' | 'rounded' | 'sharp'
          buttonType: 'rounded',
          //Elemento que personaliza el borde de color de los elementos         
          states: {
            empty: {
              borderColor: '#FFAA00' // Código de color hexadecimal para campos vacíos
            },
            invalid: {
              borderColor: '#FF00E0' // Código de color hexadecimal para campos inválidos
            },
            valid: {
              borderColor: '#0079c1' // Código de color hexadecimal para campos llenos y válidos
            }
          }
        },
        languaje: 'es', // 'es' Español | 'en' Ingles
        //Elemento que personaliza el botón que finzaliza el guardado y tokenización de la tarjeta
        button: {
          colorText: '#ffffff', // Código de color hexadecimal para el color de las palabrás en el botón de: Alta de Tarjeta | Add Card
          //text: 'Agregar Tarjeta***', //Nombre de la acción en el botón ***Se puede personalizar
          backgroundColor: '#301007' // Código de color hexadecimal para el color del botón de: Alta de Tarjeta | Add Card
        },
        //Elemento que personaliza el diseño del iframe
        iframe: {
          colorText: '#65A39B',  // Código de color hexadecimal para el color de la letra de todos los campos a llenar
          backgroundColor: '#FFFFFF' // Código de color hexadecimal para el fondo del iframe, generalmente es blanco.
        }
      },
      onCreateTokenSucceeded: (token: any) => {
        this.generatePayment(token);
      },
      onCreateTokenError: (error: any) => {
        console.log('Error: ', error);
      }
    });
  }

  private generatePayment(dataPayment: any) {
    console.log('Tokenización: ', dataPayment);
    
    const data = {
      token_id: this.jsonConfig.id
    };

    this.http.post(this.URL_conekta + '/generateCliente-conekta', data).subscribe(
      (response: any) => {
        console.log('Cliente: ', response);
        this.generatePaymentConekta(response);
      },
      (error: any) => {
        console.log('Error: ', error);
      }
    );
  }

  private generatePaymentConekta(dataPayment: any) {
    const data = {
      token_id: this.jsonConfig.id,
      cliente_id: dataPayment.id,
    };

    this.http.post(this.URL_conekta + '/createPayOrder-conekta', data).subscribe(
      (response: any) => {
        console.log('Pago: ', response);
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
