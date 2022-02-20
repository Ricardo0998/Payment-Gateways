const { response, request } = require("express");
const axios = require('axios');
var Openpay = require('openpay');

const MERCHANT_ID = process.env.MERCHANT_ID_OPEMPAY;
const URL = 'https://sandbox-api.openpay.mx/v1/' + MERCHANT_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY_OPEMPAY;
const PRIVATE_KEY_BASE64 = process.env.PRIVATE_KEY_BASE64_OPEMPAY;

const authorizationData = 'Basic ' + PRIVATE_KEY_BASE64;

const payOpenPay = async (req = request, res = response) => {

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            'Authorization': authorizationData
        }
    };

    axios.post(URL + '/charges', JSON.stringify(req.body), axiosConfig).then(function (response) {
        res.send({
            status: 200,
            ok: true,
            body: response.data
        });
    }).catch(function (error) {
        console.log(error);
        res.send({
            status: 500,
            ok: false,
            error: error
        });
    });

};

const apiOpenPay = async (req = request, res = response) => {

    var openpay = new Openpay(MERCHANT_ID, PRIVATE_KEY);

    openpay.charges.create(
        req.body,
        function (error, body, response) {
            try {
                if (error) {
                    res.send({
                        status: 500,
                        ok: false,
                        error: error
                    });
                } else {
                    res.send({
                        status: 200,
                        ok: true,
                        body: body
                    });
                }
            } catch (error) {
                res.send({
                    error
                });
            }
        });

}

module.exports = {
    payOpenPay,
    apiOpenPay
};
