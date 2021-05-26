
const controller = require('../controllers/payment.controller');


var express = require('express');
var router = express.Router();

router.post('/', controller.index);

router.post('/momo_notify', controller.momo_notify)

module.exports = router;