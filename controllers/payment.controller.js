const { v4: uuidv4 } = require('uuid');
var orderId = uuidv4();
var requestId = uuidv4();
const crypto = require('crypto');

const https = require('https');
const axios = require('axios');
module.exports.index = async (req,res) => {
    const {order}=req.body;
    const orderData = JSON.stringify(order);
    
    var partnerCode = "MOMO9NYV20210516"
    var accessKey = "iXGFBRWzmypYCl45"
    var serectkey = "TkJiyJKrTB7n2Ds9qAHl5EusiuAoE2PA"
    var orderInfo = "thanh toan don hang Tomato Mart"
    var returnUrl = "http://localhost:3000"
    var notifyurl = "https://tomato-mart.herokuapp.com/payment/momo_notify"
    var amount = "" + order.totalPrice + ""
    var requestType = "captureMoMoWallet"
    var extraData = ""+ orderData + ""
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

module.exports.momo_notify= async (req,res) => {
    const data= req.body;
    console.log(data);
    const order=JSON.parse(data);
    console.log(order);
}