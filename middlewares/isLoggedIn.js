module.exports = function(request, response, next) {
  if(!request.user) {
    return response.redirect('/login');
  }

  return next()
}
