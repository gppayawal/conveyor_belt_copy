var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var account = require('./routes/account');
var session = require('client-sessions');
var pg = require('pg');
var io = require('socket.io');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'src'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
	cookieName: 'session',
	secret: 'R4nd0m 5tr1ng6s',
	duration: 30*60*1000,
	activeDuration: 5*60*1000,
	httpOnly: true,
	secure: true,
	ephemeral: true
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/materialize-css', express.static(path.join(__dirname, 'node_modules/materialize-css/dist')));
app.use('/materialize', express.static(path.join(__dirname, 'node_modules/materialize/dist')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/icons', express.static(path.join(__dirname, 'public/icons/iconfont')));
app.use('/api/account', account);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile('error.html', { root: __dirname + '/src/'} );
});

module.exports = app;

