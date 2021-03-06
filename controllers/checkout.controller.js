const Stripe = require('stripe');
const moment = require('moment');
const Order = require('../models/order.model');
const nodemailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars');
const path = require('path');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET);

module.exports.index = async (req, res) => {
  const order = await Order.find({ orderId: req.query.orderId });
  res.json(order);
}

module.exports.postCheckout = async (req, res) => {

  var { order } = req.body;
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

  try {
    const savedOrder = await newOrder.save();
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
      subject: '#Tomato8437598743 - Th??ng b??o ????n ?????t h??ng th??nh c??ng t??? Tomato Mart',
      text: 'C???m ??n b???n ???? ?????t h??ng',
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
    res.status(200).json({ order: savedOrder });
  } catch (err) {
    res.status(400).send(err);
  }


}