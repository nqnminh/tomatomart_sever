const { v4: uuidv4 } = require('uuid');
var requestId = uuidv4();
const crypto = require('crypto');
const moment = require('moment');
const Order = require('../models/order.model');


const https = require('https');
const axios = require('axios');
module.exports.index = async (req, res) => {
    const { order } = req.body;
    const orderData = JSON.stringify(order);
    var orderId = "" + order.orderId + ""
    var partnerCode = "MOMO9NYV20210516"
    var accessKey = "iXGFBRWzmypYCl45"
    var serectkey = "TkJiyJKrTB7n2Ds9qAHl5EusiuAoE2PA"
    var orderInfo = "thanh toan don hang Tomato Mart"
    var returnUrl = "http://localhost:3000/order-received"
    var notifyurl = "https://tomato-mart.herokuapp.com/payment/momo_notify"
    var amount = "" + order.totalPrice + ""
    var requestType = "captureMoMoWallet"
    var extraData = "" + orderData + ""
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
    var data = '';
    await axios.post('https://test-payment.momo.vn/gw_payment/transactionProcessor', body)
        .then(res => {
            data += JSON.stringify(res.data);
        })
    res.send(data);
}

module.exports.momo_notify = async (req, res) => {
    const data = req.body;
    if(data.resultCode === 0){
        const order = JSON.parse(data.extraData);
        const date = moment().format('LL');
        const orderTime = moment().format('LLL');
        const newOrder = new Order({
            userId: order.id,
            userName: order.name,
            email: order.email,
            address: order.address,
            city: order.city,
            district: order.district,
            phone: order.phone,
            cart: order.cartItems,
            payment: order.payment,
            totalPrice: order.totalPrice,
            date: date,
            orderTime: orderTime,
            status: 1,
            orderId: order.orderId
        })
        try {
            const savedOrder = await newOrder.save();
            res.status(200).json('ok');
        } catch (err) {
            res.status(400).send(err);
        }
    }   
}