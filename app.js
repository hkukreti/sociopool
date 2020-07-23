var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var userViewsRouter = require('./routes/views');
var mongoose = require('mongoose');
var Database =require('./config/db');

mongoose.connect(Database.database,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => { // if all is ok we will be here
	console.log('MongoDB Connected...');
  })
  .catch(err => { // if error we will be here
	  console.error('App starting error:', err.stack);
	  process.exit(1);
  });


var app = express();

app.use(function (req, res, next) {
  res.success = function (message, data) {
    this.send({
      code: this.statusCode || 200,
      message,
      data,
    })
    return this;
  }

  res.error = function (message, errors) {
    this.send({
      code: this.statusCode || 404,
      message,
      errors
    });

    return this;
  }

  next();
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/userTravel', userViewsRouter);

module.exports = app;
