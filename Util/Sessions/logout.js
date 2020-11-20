exports.logout = function(req)
{
  var sess = req.session;
  sess.loggedIn = false;
  sess.username = '';
  sess.fname = '';
  sess.lname = '';
  sess.date_created = '';
  sess.profilePicture = '';
}