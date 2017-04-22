var express = require('express');
var router = express.Router();
var passport = require('passport');
var config = require('config');
var ShopifyStrategy = require('passport-shopify').Strategy;
var User = require('./../../models/user');

router.get('/callback', 
  function (request, response, next) {
    return passport.authenticate('shopify', { failureRedirect: '/'})(request, response, next);
  }, 
  function (request, response) {
    passport.unuse('shopify');
    return response.redirect('/merchant/products');
  }
);

router.get('/', function (request, response, next) {
  passport.use('shopify', new ShopifyStrategy({
    clientID: config.get('Shopify.clientId'),
    clientSecret: config.get('Shopify.clientSecret'),
    callbackURL: config.get('Shopify.callbackUrl'),
    shop: request.query.shop
  }, function (accessToken, refreshToken, profile, cb) {
    User.findOne({ shopify: {id: profile.id } }).then(function(user) {
      if(!user) {
        var data = {
          name: profile.displayName,
          type: 'MERCHANT',
          shopify: {
            id: profile.id,
            accessToken: accessToken,
            shop: {
              name: profile._json.shop.name,
              country: profile._json.shop.country,
            }
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

  }));
  
  return passport.authenticate('shopify', {
    scope: ['read_products'],
    shop: request.query.shop
  })(request, response, next);
});

module.exports = router;

//http://localhost:3000/auth/shopify?shop=jethshop
