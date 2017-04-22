var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
  console.log(request.user);
  return response.render('shop', {user: request.user});
});

module.exports = router;
