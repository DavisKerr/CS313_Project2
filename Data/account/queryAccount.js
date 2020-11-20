const bcrypt = require('bcryptjs');
const session = require('express-session')

exports.queryAccounts = function(pool, username, password, res, sess)
{
  pool.query('SELECT * FROM public.user WHERE username = $1', [username], (err, result) => {
    if (err) {
      throw err
    }
    if(result.rows[0])
    {
      bcrypt.compare(password, result.rows[0].password, (err, match) => {
        if(match)
        {
          sess.loggedIn = true;
          sess.username = username;
          sess.fname = result.rows[0].first_name;
          sess.lname = result.rows[0].last_name;
          sess.date_created = result.rows[0].date_created;
          sess.profilePicture = result.rows[0].profile_picture;
          res.send({success : true});
        }
        else
        {
          sess.loggedIn = false;
          res.send({success : false});
        }
      });
      
    }
    else
    {
      sess.loggedIn = false;
      res.redirect('/familyGameNight/login?error=Invalid username or password');
    }
  });
}