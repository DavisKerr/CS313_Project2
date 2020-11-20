const bcrypt = require('bcryptjs');

exports.createAccount = function(pool, fname, lname, username, password, res, saltRounds)
{

  pool.query("SELECT username FROM public.user WHERE username = $1", [username], (req, resultNames) => {
    if(!resultNames.rows[0])
    {
      insertAccount(pool, fname, lname, username, password, res, saltRounds);
    }
    else
    {
      res.redirect('/familyGameNight/register?error=Error: Username is already in use');
    }
  });

  
}

function insertAccount(pool, fname, lname, username, password, res, saltRounds)
{
  
  bcrypt.hash(password, 1, function(err, hash) {
    pool.query("INSERT INTO public.user \
    ( first_name \
    , last_name \
    , username \
    , password \
    , date_created \
    ) \
    VALUES \
    ( $1 \
    , $2 \
    , $3 \
    , $4 \
    , (SELECT CURRENT_TIMESTAMP) \
    )", [fname, lname, username, hash], (err, result) => {
      if (err) {
        throw err;
      }
      res.redirect('/familyGameNight/login');
    });
});
  
}