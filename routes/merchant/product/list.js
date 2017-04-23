var express = require('express');
var router = express.Router();
var Product = require('./../../../models/product');

router.get('/', function(request, response) {
  request.user = request.session.shopify
  Product.find({merchant: request.user}, function(err, products){
    return response.render('product/list', {products: products});
  });
});

module.exports = router;
