require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var path = require('path');
const mongoose = require('mongoose');

const productRoute = require('./routes/product.route');
const userRoute = require('./routes/user.route');
const checkoutRoute = require('./routes/checkout.route');
const orderRoute = require('./routes/order.route');
const adminRoute = require('./routes/admin.route');
const promotionRoute = require('./routes/promotion.route');
const paymentRoute=require('./routes/payment.route');
const categoryRouter= require('./routes/category.route');
const areaRouter= require('./routes/area.route');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(
  process.env.MONGO_URL, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    dbName: 'tomatomart',
    useFindAndModify: false
  }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/products', productRoute);
app.use('/user', userRoute);
app.use('/checkout', checkoutRoute);
app.use('/order', orderRoute);
app.use('/admin', adminRoute);
app.use('/promotion', promotionRoute);
app.use('/category', categoryRouter);
app.use('/area', areaRouter);

app.use('/payment', paymentRoute);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});