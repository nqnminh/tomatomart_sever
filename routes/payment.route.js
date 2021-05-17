
const controller = require('../controllers/payment.controller');

var express = require('express');
var router = express.Router();

router.get('/momo_pay', controller.index);

router.post('/momo_notify', function (req, res, next) {
    console.log('Ok nhaaaaa');
    console.log(req.body);
})

module.exports = router;