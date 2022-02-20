const { Router } = require('express')

// * Ctrl openpay
const { payOpenPay, apiOpenPay } = require('../controllers/openpayCtrl');

// * Ctrl conekta
const { generateToken, generateCliente, createPayOrder } = require('../controllers/conektaCtrl');

const router = Router();

// * Routes to pay with openpay
router.post('/pay-openpay', payOpenPay);
router.post('/pay-openpay-miapi', apiOpenPay);

// * Routes to pay with conekta
router.get('/generateToken-conekta', generateToken);
router.post('/generateCliente-conekta', generateCliente);
router.post('/createPayOrder-conekta', createPayOrder);

module.exports = router;