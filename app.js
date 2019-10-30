var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');

var index = require('./routes/index');
var users = require('./routes/users');
var customers = require('./routes/customers');
var item = require('./routes/item');
var supplier = require('./routes/supplier');

var connection  = require('express-myconnection'); 
var mysql = require('mysql');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"secretpass123456"}));
app.use(flash());
app.use(expressValidator());
app.use(methodOverride(function(req, res){
 if (req.body && typeof req.body == 'object' && '_method' in req.body) 
  { 
      var method = req.body._method;
      delete req.body._method;
      return method;
    } 
  }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root', 
        password : '', 
        port : 3306, 
        database:'nodejs' 
    },'pool') 
);

app.use('/', index);
app.use('/customers', customers);
app.use('/item', item);
app.use('/supplier', supplier);
app.use('/users', users);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;