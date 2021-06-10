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
    var returnUrl = "https://tomatomart.netlify.app/order-received"
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
    if (data.errorCode === '0') {
        var order = JSON.parse(data.extraData);
        moment.locale('vi');
        const date = moment().format('l');
        const orderTime = moment().format('lll');
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
        const formatNumber = (value) => {
          value += '';
          const list = value.split('.');
          const prefix = list[0].charAt(0) === '-' ? '-' : '';
          let num = prefix ? list[0].slice(1) : list[0];
          let result = '';
          while (num.length > 3) {
            result = `.${num.slice(-3)}${result}`;
            num = num.slice(0, num.length - 3);
          }
          if (num) {
            result = num + result;
          }
          return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
        }
        try {
            const savedOrder = await newOrder.save();
              //send mail order
              var transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD
                }
              });
              transport.use('compile', hbs({
                viewEngine: {
                  extName: ".hbs",
                  partialsDir: path.resolve("./views"),
                  defaultLayout: false
                },
                viewPath: path.resolve("./views"),
                extName: ".hbs"
              }));
          
              var mailOptions = {
                from: '"Tomato Mart" <no-reply@tomatomart.com>',
                to: order.email,
                subject: '#Tomato8437598743 - Thông báo đơn đặt hàng thành công từ Tomato Mart',
                text: 'Cảm ơn bạn đã đặt hàng',
                template: 'main',
                context: {
                  orderId: order.orderId,
                  totalPrice: formatNumber(order.totalPrice),
                  address: order.address,
                  city: order.city,
                  district: order.district,
                  orderTime: orderTime
                }
              };
              transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return console.log(error);
                }
              });
              //end
            res.status(200).json('ok');
        } catch (err) {
            res.status(400).send(err);
        }
    }
}