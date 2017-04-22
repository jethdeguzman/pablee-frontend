var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(request, response) {
    return response.redirect('/shop');
  }
);

router.get('/', passport.authenticate('facebook'));

module.exports = router;