const session = require('express-session')

exports.queryIsInFamily = function(pool, res, sess)
{
  pool.query('SELECT * FROM public.family_relationship WHERE user_id = $1', [sess.uid], (err, result) => {
    if (err) {
      throw err
    }
    if(result.rows[0])
    {
      sess.famId = result.rows[0].family_id;
      sess.isPartFam = true;
      res.redirect("/familyGameNight/home");
    }
    else
    {
      res.render('pages/home', {login: false, page:'home', isPartFam: false})
    }
  });
}