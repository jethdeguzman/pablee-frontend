var express = require('express');
var router = express.Router();

router.use('/facebook', require('./facebook'));

router.use('/shopify', require('./shopify'));

module.exports = router;

