
// const express = require('express');
// const controller =require('../controllers/payment.controller');
// const router = express.Router();

// router.post('/create_payment_url', controller.createPayment);

// router.get('/vnpay_return', controller.vnpayReturn);

// router.get('/vnpay_ipn', controller.vnpayIpn);

// module.exports = router;


var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
var orderId = uuidv4();
var requestId = uuidv4();
const crypto = require('crypto');

const https = require('https');

// var sha256 = require('sha256');

router.get('/momo_pay', function (req, res, next) {

    //parameters send to MoMo get get payUrl
    var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
    var hostname = "https://test-payment.momo.vn"
    var path = "/gw_payment/transactionProcessor"
    var partnerCode = "MOMO9NYV20210516"
    var accessKey = "iXGFBRWzmypYCl45"
    var serectkey = "TkJiyJKrTB7n2Ds9qAHl5EusiuAoE2PA"
    var orderInfo = "thanh toan don hang Tomato Mart"
    var returnUrl = "http://localhost:3000"
    var notifyurl = "http://localhost:5000/payment/momo_done"
    var amount = "1876000"
    var requestType = "captureMoMoWallet"
    var extraData = "merchantName=;merchantId=" //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store

    //before sign HMAC SHA256 with format
    //partnerCode=$partnerCode&accessKey=$accessKey&requestId=$requestId&amount=$amount&orderId=$oderId&orderInfo=$orderInfo&returnUrl=$returnUrl&notifyUrl=$notifyUrl&extraData=$extraData
    var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&amount=" + amount + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&returnUrl=" + returnUrl + "&notifyUrl=" + notifyurl + "&extraData=" + extraData
    //signature
    var signature = crypto.createHmac('sha256', serectkey)
        .update(rawSignature)
        .digest('hex');
    var body = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        returnUrl: returnUrl,
        notifyUrl: notifyurl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
    })
    //Create the HTTPS objects
    var options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/gw_payment/transactionProcessor',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    //Send the request and get the response
    var req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (body) => {
            // res.redirect(JSON.parse(body).payUrl);
            // console.log(JSON.parse(body).payUrl);
        });
        // res.redirect(JSON.parse(body).payUrl);
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });
    

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(body);
    req.end();
});

router.post('/momo_done', function (req, res, next) {
    console.log('Ok nha');
})
// router.post('/create_payment_url', function (req, res, next) {
//     var ipAddr = req.headers['x-forwarded-for'] ||
//         req.connection.remoteAddress ||
//         req.socket.remoteAddress ||
//         req.connection.socket.remoteAddress;

//     var config = require('config');
//     var dateFormat = require('dateformat');


//     var tmnCode = config.get('vnp_TmnCode');
//     var secretKey = config.get('vnp_HashSecret');
//     var vnpUrl = config.get('vnp_Url');
//     var returnUrl = config.get('vnp_ReturnUrl');

//     var date = new Date();

//     var createDate = dateFormat(date, 'yyyymmddHHmmss');
//     var orderId = dateFormat(date, 'HHmmss');
//     var amount = req.body.amount;
//     var bankCode = req.body.bankCode;

//     var orderInfo = req.body.orderDescription;
//     var orderType = req.body.orderType;
//     var locale = "";
//     if(locale === null || locale === ''){
//         locale = 'vn';
//     }
//     var currCode = 'VND';
//     var vnp_Params = {};
//     vnp_Params['vnp_Version'] = '2';
//     vnp_Params['vnp_Command'] = 'pay';
//     vnp_Params['vnp_TmnCode'] = tmnCode;
//     // vnp_Params['vnp_Merchant'] = ''
//     vnp_Params['vnp_Locale'] = locale;
//     vnp_Params['vnp_CurrCode'] = currCode;
//     vnp_Params['vnp_TxnRef'] = orderId;
//     vnp_Params['vnp_OrderInfo'] = orderInfo;
//     vnp_Params['vnp_OrderType'] = orderType;
//     vnp_Params['vnp_Amount'] = amount * 100;
//     vnp_Params['vnp_ReturnUrl'] = returnUrl;
//     vnp_Params['vnp_IpAddr'] = ipAddr;
//     vnp_Params['vnp_CreateDate'] = createDate;
//     if(bankCode !== null && bankCode !== ''){
//         vnp_Params['vnp_BankCode'] = bankCode;
//     }
//     console.log("CCCC",vnp_Params);

//     vnp_Params = sortObject(vnp_Params);

//     var querystring = require('qs');
//     var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

//     var sha256 = require('sha256');

//     var secureHash = sha256(signData);

//     vnp_Params['vnp_SecureHashType'] =  'SHA256';
//     vnp_Params['vnp_SecureHash'] = secureHash;
//     vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

//     //Neu muon dung Redirect thi dong dong ben duoi
//     res.status(200).json({code: '00', data: vnpUrl})
//     //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
//     // res.redirect(vnpUrl)
// });

// router.get('/vnpay_return', function (req, res, next) {
//     var vnp_Params = req.query;

//     var secureHash = vnp_Params['vnp_SecureHash'];

//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];

//     vnp_Params = sortObject(vnp_Params);

//     var config = require('config');
//     var tmnCode = config.get('vnp_TmnCode');
//     var secretKey = config.get('vnp_HashSecret');

//     var querystring = require('qs');
//     var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

//     var sha256 = require('sha256');

//     var checkSum = sha256(signData);

//     if(secureHash === checkSum){
//         //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

//         res.render('success', {code: vnp_Params['vnp_ResponseCode']})
//     } else{
//         res.render('success', {code: '97'})
//     }
// });

// router.get('/vnpay_ipn', function (req, res, next) {
//     var vnp_Params = req.query;
//     var secureHash = vnp_Params['vnp_SecureHash'];

//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];

//     vnp_Params = sortObject(vnp_Params);
//     var config = require('config');
//     var secretKey = config.get('vnp_HashSecret');
//     var querystring = require('qs');
//     var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });



//     var checkSum = sha256(signData);

//     if(secureHash === checkSum){
//         var orderId = vnp_Params['vnp_TxnRef'];
//         var rspCode = vnp_Params['vnp_ResponseCode'];
//         //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
//         res.status(200).json({RspCode: '00', Message: 'success'})
//     }
//     else {
//         res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
//     }
// });


function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}



module.exports = router;