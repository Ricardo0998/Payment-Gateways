import { Component } from '@angular/core';

@Component({
  selector: 'app-pasarela-pago',
  templateUrl: './pasarela-pago.component.html',
  styleUrls: []
})
export class PasarelaPagoComponent {

  constructor() { }

  // * Redirect to url
  redirectTo(url: string) {
    window.location.href = url;
  }

}
