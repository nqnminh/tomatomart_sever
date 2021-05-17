const { v4: uuidv4 } = require('uuid');
var orderId = uuidv4();
var requestId = uuidv4();
const crypto = require('crypto');

const https = require('https');
const axios = require('axios');
module.exports.index = async (req,res) => {
    //parameters send to MoMo get get payUrl
    
    var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
    var hostname = "https://test-payment.momo.vn"
    var path = "/gw_payment/transactionProcessor"
    var partnerCode = "MOMO9NYV20210516"
    var accessKey = "iXGFBRWzmypYCl45"
    var serectkey = "TkJiyJKrTB7n2Ds9qAHl5EusiuAoE2PA"
    var orderInfo = "thanh toan don hang Tomato Mart"
    var returnUrl = "http://localhost:3000"
    var notifyurl = "https://tomato-mart.herokuapp.com/payment/momo_notify"
    var amount = "43000"
    var requestType = "captureMoMoWallet"
    var extraData = "partnerCode:" + partnerCode + "accessKey:" + accessKey + "requestId:" + requestId + "amount=" + amount + "orderId=" + orderId + "orderInfo=" + orderInfo + "returnUrl=" + returnUrl
    var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&amount=" + amount + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&returnUrl=" + returnUrl + "&notifyUrl=" + notifyurl + "&extraData=" + extraData
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
    var data='';
    await axios.post('https://test-payment.momo.vn/gw_payment/transactionProcessor',body)
    .then(res => {
        data += JSON.stringify(res.data); 
    })
    res.send(data);
    


}