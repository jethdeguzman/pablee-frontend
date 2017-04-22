var express = require('express');
var router = express.Router();

router.use('/products', require('./product'))

router.get('/', function(request, response) {
  return response.render('merchant');
});

module.exports = router;
