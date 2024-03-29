let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let uploadRouter = require('./routes/upload');

let app = express();

// 域名白名单
const ALLOW_ORIGIN = [
  'http://localhost:3000',
  'http://localhost:3001'
];

app.all('*', function (req, res, next) {
  let reqOrigin = req.headers.origin; // request响应头的origin属性
  let isAllowed = reqOrigin === undefined;

  ALLOW_ORIGIN.forEach(function (origin) {
    if(origin === reqOrigin){
      isAllowed = true;
    }
  });

  if(isAllowed){
    res.header("Access-Control-Allow-Origin", reqOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", ' 3.2.1');
    if (req.method === "OPTIONS") {
      /*让options请求快速返回*/
      res.send(200);
    }
    else{
      next();
    }
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
