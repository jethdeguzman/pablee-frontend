var express = require('express');
var router = express.Router();
var Product = require('./../models/product');
var requests = require('request');

router.get('/:productId', function(request, response) {
  request.user = request.session.facebook
  Product.findOne({_id: request.params.productId}).populate('merchant').then(function(product) {
    return response.render('request', {user: request.user, product: product});
  });
});

router.post('/', function(request, response) {
  request.user = request.session.facebook
  var requestData = {
    uuid: request.user.uuid,
    title: request.body.title, 
    description: request.body.description,
    image_url: request.body.imageUrl,
    quantity: 1, 
    currency: 'USD',
    price: request.body.price,
    reward: request.body.reward,
    deliver_from: request.body.deliverFrom,
    deliver_to: request.body.deliverTo
  }

  let options = {
    method: 'POST',
    url: 'http://pablee-api:8000/api/v1/requests',
    headers: {
      'content-type': 'application/json'
    },
    body: requestData,
    json: true
  }

  requests(options, function(error, resp, body) {
    if(!error && resp.statusCode == 201){
      return response.redirect('/shop');
    }
  });
});

module.exports = router;

