var express = require('express');
var router = express.Router();
var config = require('config');
var shopifyAPI = require('shopify-node-api');
var Product =  require('./../../../models/product');
var shopifyConfig = {
  shop: '',
  shopify_api_key: config.get('Shopify.clientId'),
  shopify_shared_secret: config.get('Shopify.clientSecret'),
  access_token: '',
}

router.get('/', function(request, response) {
  request.user = request.session.shopify
  var shopName = request.user.shopify.shop.name.toLowerCase();
  shopifyConfig.shop = shopName.replace(/\s/g , "-")
  shopifyConfig.access_token = request.user.shopify.accessToken;

  var Shopify = new shopifyAPI(shopifyConfig);
                                                                                                               
  Shopify.get('/admin/products.json', {}, function(err, data, headers){
    if(err) {
      console.log(err);
      return response.redirect('/merchant/products');
    }
    
    var products = JSON.parse(JSON.stringify(data.products));
    for (index in products) {
      var product = products[index];
      var data = {
        shopifyId: product.id,
        title: product.title,
        description: product.body_html,
        imageUrl: product.image.src,
        price: product.variants[0].price || 0.00,
        merchant: request.user
      }

      Product.findOneAndUpdate(
        {shopifyId: product.id}, 
        data, 
        {upsert: true, setDefaultsOnInsert: true}, 
        function(err) {
          console.log(err);
        }
      );
    }

    return response.redirect('/merchant/products');
  });
});

module.exports = router;
