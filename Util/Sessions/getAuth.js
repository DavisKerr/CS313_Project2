const session = require('express-session')

exports.isLoggedIn = function(req)
{
  if(typeof(req.session.loggedIn) == 'undefined')
  {
    req.session.loggedIn = false;
    return false;
  }
  else if(req.session.loggedIn == false)
  {
    return false;
  }
  else if(req.session.loggedIn == true)
  {
    return true;
  }
}