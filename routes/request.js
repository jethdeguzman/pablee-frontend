var express = require('express');
var router = express.Router();
var Product = require('./../models/product');

router.get('/:productId', function(request, response) {
  request.user = request.session.facebook
  Product.findOne({id: request.param.productId}).populate('merchant').then(function(product) {
    return response.render('request', {user: request.user, product: product});
  });
});

router.post('/', function(request, response) {

});

module.exports = router;

