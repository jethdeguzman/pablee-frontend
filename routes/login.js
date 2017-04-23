var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
  console.log(request.user);
  return response.render('login');
});

module.exports = router;

