const { response, request } = require("express");
const axios = require('axios');
var conekta = require('conekta');

const PUBLIC_KEY = process.env.PUBLIC_KEY_CONEKTA;
const PRIVATE_KEY = process.env.PRIVATE_KEY_CONEKTA;
const PUBLIC_KEY_BASE64 = process.env.PUBLIC_KEY_BASE64_CONEKTA;
const PRIVATE_KEY_BASE64 = process.env.PRIVATE_KEY_BASE64_CONEKTA;
const URL_TOKEN = 'https://api.conekta.io/tokens';
const URL_CLIENTS = 'https://api.conekta.io/customers';

const NAME_CLIENT = 'Juan Perez';
const EMAIL_CLIENT = 'juanperez5@gmail.com';
const CELLPHONE_CLIENT = '55-5555-5555';

conekta.api_key = PRIVATE_KEY;
conekta.locale = 'es';

const generateToken = async (req = request, res = response) => {

    const options = {
        method: 'POST',
        url: URL_TOKEN,
        headers: {
            Authorization: 'Basic ' + PUBLIC_KEY_BASE64,
            Accept: 'application/vnd.conekta-v2.0.0+json',
            'Content-Type': 'application/json'
        },
        data: { checkout: { returns_control_on: 'Token' } }
    };

    axios.request(options).then(function (response) {
        res.send({
            status: 200,
            ok: true,
            body: response.data
        });
    }).catch(function (error) {
        res.send({
            status: 500,
            ok: false,
            error: error
        });
    });

};

// ! Validate in the future that if the customer pays with a different card than the one they have registered, the card is updated or a new one is added
const generateCliente = async (req = request, res = response) => {

    try {
        const clientes = await _existClient();
        if (clientes.length > 0) {
            const customer = clientes.find(cliente => cliente.email === EMAIL_CLIENT);
            if (customer) {
                try {
                    const cliente = await _getClients(customer);
                    if (cliente) {
                        res.send({
                            status: 200,
                            ok: true,
                            body: cliente
                        });
                    }
                } catch (error) {
                    res.send({
                        status: 500,
                        ok: false,
                        error
                    });
                }
            } else {
                res.send({
                    status: 200,
                    ok: true,
                    body: await _createClient(req.body)
                });
            }
        } else {
            res.send({
                status: 200,
                ok: true,
                body: await _createClient(req.body)
            });
        }
    } catch (error) {
        res.send({
            status: 500,
            ok: false,
            error
        });
    }

}

const createPayOrder = async (req = request, res = response) => {

    conekta.Order.create({
        "amount": 43280,
        "currency": "MXN",
        "amount_refunded": 0,
        "customer_info": {
            "name": NAME_CLIENT,
            "phone": CELLPHONE_CLIENT,
            "email": EMAIL_CLIENT,
            "customer_id": req.params.cliente_id
        },
        "charges": [{
            "payment_method": {
                "type": "card",
                "token_id": req.body.token_id
            }
        }],
        "shipping_lines": [
            {
                "amount": 5000, //Envio gratis = cero, de lo contrario, costo del envio
                "carrier": "Fedex",
                "method": "Airplane",
                "tracking_number": "TRACK000000000123",
                "object": "shipping_line"
            }
        ],
        "shipping_contact": {
            "receiver": "El Fulanito - The guy",
            "phone": "5555555555",
            "between_streets": "Entre la principal y la secundaria",
            "address": {
                "street1": "CALLE Y EXTERIOR",
                "city": "CDMX",
                "state": "CDMX",
                "country": "mx",
                "residential": true,
                "object": "shipping_address",
                "postal_code": "06100"
            }
        },
        "metadata": {
            "Integration": "API", //Nos indica que te has integrado por tu cuenta utilizando la API Conekta
            "Integration_Type": "NODEJS v16.14.0" //Nos menciona el lenguaje que utilizas para integrarte
            // Objeto de Metadatos para ingresar información de interés de tu comercio y después recuperarlo por Reporting, puedes ingresar máximo 100 elementos y puedes ingresar caracteres especiales
        },
        "line_items": [
            {
                "name": "Vasija de Cerámica",
                "unit_price": 33000,
                "quantity": 1,
                "description": "Description",
                "sku": "SKU",
                "tags": [
                    "tag1",
                    "tag2"
                ],
                "brand": "Brand",
                "metadata": { // Objeto de Metadatos para ingresar información de interés de tu comercio y después recuperarlo por Reporting, puedes ingresar máximo 100 elementos y puedes ingresar caracteres especiales
                    "Valor3": "South#23"
                }
            }
        ],
        "discount_lines": [{
            "code": "Cupón de descuento en orden sin cargo",
            "amount": 1000,
            "type": "loyalty"
        }],
        "tax_lines": [
            {
                "description": "IVA",
                "amount": 5280,
                "metadata": { // Objeto de Metadatos para ingresar información de interés de tu comercio y después recuperarlo por Reporting, puedes ingresar máximo 100 elementos y puedes ingresar caracteres especiales
                    "IEPS": "1800"
                }
            }
        ]
    }).then(function (result) {
        res.send({
            status: 200,
            ok: true,
            body: result.toObject()
        });
    }, function (error) {
        res.send({
            status: 500,
            ok: false,
            error
        });
    });
    
}

// Todo: Metodos privados
const _existClient = async () => {
    const options = {
        method: 'GET',
        url: URL_CLIENTS,
        headers: {
            Authorization: 'Basic ' + PRIVATE_KEY_BASE64,
            Accept: 'application/vnd.conekta-v2.0.0+json',
            'Content-Type': 'application/json'
        },
        data: {
            livemode: false,
            name: NAME_CLIENT,
            email: EMAIL_CLIENT,
            phone: CELLPHONE_CLIENT
        }
    };


    try {
        const resp = await axios.request(options);
        return resp.data.data;
    } catch (error) {
        return [];
    }
}

const _createClient = async (params) => {
    const options = {
        method: 'POST',
        url: URL_CLIENTS,
        headers: {
            Authorization: 'Basic ' + PRIVATE_KEY_BASE64,
            Accept: 'application/vnd.conekta-v2.0.0+json',
            'Content-Type': 'application/json'
        },
        data: {
            livemode: false,
            name: NAME_CLIENT,
            email: EMAIL_CLIENT,
            phone: CELLPHONE_CLIENT,
            payment_sources: [{
                type: "card",
                token_id: params.token_id
            }]
        }
    };

    try {
        const resp = await axios.request(options);
        return resp.data;
    } catch (error) {
        return null;
    }
}

const _getClients = async (cliente) => {
    const options = {
        method: 'GET',
        url: URL_CLIENTS + '/' + cliente.id,
        headers: {
            Authorization: 'Basic ' + PRIVATE_KEY_BASE64,
            Accept: 'application/vnd.conekta-v2.0.0+json',
            'Content-Type': 'application/json'
        },
        data: {
            livemode: false,
            name: cliente.name,
            email: cliente.email,
            phone: cliente.phone
        }
    };

    try {
        const resp = await axios.request(options);
        return resp.data;
    } catch (error) {
        return null;
    }
}

module.exports = {
    generateToken,
    generateCliente,
    createPayOrder
};