var express = require('express');
var router = express.Router();

router.use('/sync', require('./sync'));
router.use('/', require('./list'));

module.exports = router;
