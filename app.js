
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var indexRouter = require('./routes/index');
var animalsRouter = require('./routes/animals');
var speciesRouter = require('./routes/species');
var temperamentRouter = require('./routes/temperament');
var authRouter = require('./routes/auth');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

var app = express();
var db = require('./models');
db.sequelize.sync({ force: false })

//#region Setup
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'services')));
app.use('/bootstrap', express.static(path.resolve(__dirname, './node_modules/bootstrap/dist')));
app.use('/bootstrap-icons', express.static(path.resolve(__dirname, './node_modules/bootstrap-icons/font')))
app.use('/candy-log', express.static(path.resolve(__dirname, './node_modules/candy-log')));
//#endregion

app.use(session({
  secret: 'dab ca',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore()
}));

app.use(passport.authenticate('session'));  

app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/animals', animalsRouter);
app.use('/species', speciesRouter);
app.use('/temperament', temperamentRouter);

//#region Error Handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//#endregion
module.exports = app;

