var express = require('express');
var path = require('path');
const mongoose= require('mongoose');
require('dotenv').config();
const cors= require('cors');
const bodyParser= require('body-parser')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const port = process.env.PORT || 8000;

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'tomatomart',
    useFindAndModify: false
  }
)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


//router
app.use('/admin', indexRouter);
app.use('/users', usersRouter);


//test
app.get('/',(req,res)=> res.send('Hi MInh'))

app.listen(port,()=>{
  console.log(`SEVER RUNING http://localhost::${port}`);
})

module.exports = app;
