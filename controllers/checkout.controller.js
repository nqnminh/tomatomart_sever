const Stripe = require('stripe');
const moment = require('moment');
const Order = require('../models/order.model');
const nodemailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars');

const stripe = new Stripe(process.env.STRIPE_SECRET);

module.exports.index = async (req, res) => {
  const order = await Order.find({ orderId: req.query.orderId });
  res.json(order);
}

module.exports.postCheckout = async (req, res) => {

  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "db9c6073da7870",
      pass: "7f1cc40ab16568"
    }
  });

  transport.use('compile', hbs({
    viewEngine: 'express-handlebars',
    viewPath: './'
  }));

  var mailOptions = {
    from: '"Tomato Mart" <no-reply@tomatomart.com>',
    to: 'user@gmail.com',
    subject: '#Tomato8437598743 - Thông báo đơn đặt hàng thành công từ Tomato Mart',
    text: 'Cảm ơn bạn đã đặt hàng',
    template: 'index',
    context: {
      name: 'Name'
  }
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });


  // const { order } = req.body;
  // moment.locale('vi');   
  // const date = moment().format('l');  
  // const orderTime = moment().format('lll');
  // const newOrder = new Order({
  //   userId: order.id,
  //   userName: order.name,
  //   email: order.email,
  //   address: order.address,
  //   city: order.city,
  //   district: order.district,
  //   phone: order.phone,
  //   cart: order.cartItems,
  //   payment: order.payment,
  //   totalPrice: order.totalPrice,
  //   date: date,
  //   orderTime: orderTime,
  //   status: 1,
  //   orderId: order.orderId
  // })

  // try {
  //   const savedOrder = await newOrder.save();
  //   res.status(200).json({order: savedOrder});
  // } catch(err) {
  //   res.status(400).send(err);
  // }


}