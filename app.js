//https://affilae.com/fr/api-v2/
//
//
//
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const basicAuth = require('express-basic-auth')
var cors = require('cors')
var bodyParser = require('body-parser');

require = require("esm")(module/* , options */)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var affilaeRouter = require('./routes/affilaeRouter');
var idRouter = require('./routes/idRouter');

var app = express();
app.use(cors())
console.log("__dirname:", __dirname);

app.use(function(req, res, next) {
  console.log("cors....")
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

function getUnauthorizedResponse(req) {
  return req.auth
      ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
      : 'No credentials provided'
}
app.use(basicAuth({
  users: { 'admin': 'supersecret',
            'jpl': 'jpl',
  },
  unauthorizedResponse: getUnauthorizedResponse
}))



app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/service/backend/affilae', affilaeRouter);
app.use('/service/backend/form', idRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err.message)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
