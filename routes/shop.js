var express = require('express');
var router = express.Router();
var Product = require('./../models/product');

router.get('/', function(request, response) {
  request.user = request.session.facebook
  var query = {title: new RegExp(request.query.q, 'i')};
  if (request.query.cn) {
    query['merchant.shopify.shop.country'] = request.query.cn;
  }

  Product.find(query).populate('merchant').then(function(products) {
    console.log(products);
    console.log(request.query.q);
    return response.render('shop', {user: request.user, q: request.query.q, products: products});  
  });
  
});

module.exports = router;
