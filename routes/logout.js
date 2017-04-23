var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
  request.session.destroy();
  request.logout();
  return response.redirect('/login');
});

module.exports = router;

