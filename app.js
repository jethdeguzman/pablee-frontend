var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
var mongoose = require('mongoose');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var ShopifyStrategy = require('passport-shopify').Strategy;
var User = require('./models/user');
var middlewares = require('./middlewares');

//Mongoose config
mongoose.connect(config.get('MongoDB.connectionString'));
mongoose.Promise = require('bluebird');

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  User.findOne({ id: user.id }).then(function(user) {
    cb(null, user);
  });

});

passport.use(new FacebookStrategy({
    clientID: config.get('Facebook.appId'),
    clientSecret: config.get('Facebook.appSecret'),
    callbackURL: config.get('Facebook.callbackUrl'),
    profileFields: ['id', 'displayName', 'name', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({ facebook: {id: profile.id} }).then(function(user) {
      if(!user) {
        var data = {
          name: profile.displayName,
          type: 'CUSTOMER',
          facebook:  {
            id: profile.id,
            accessToken: accessToken,
            profilePicture: profile.photos[0].value
          }
        }

        User(data).save().then(function(user) {
          cb(null, user);
        }, function(error) {
          cb(error, null);
        });
      
      }else{
        cb(null, user);  
      }
    });
  }
));

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));


//Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', require('./routes/login'));
app.use('/auth', require('./routes/auth'));

app.use('/shop', middlewares.isLoggedIn, require('./routes/shop'));
app.use('/merchant', middlewares.isLoggedIn, require('./routes/merchant'));
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
