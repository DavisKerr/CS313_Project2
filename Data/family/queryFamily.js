exports.queryFamily = function(pool, sess, res)
{
  pool.query('SELECT f.family_name, f.family_code, u.first_name, u.last_name, u.username, u.id, fr.date_joined, f.date_created, f.owner_id \
  FROM public.family_relationship fr \
  JOIN public.family f \
  ON fr.family_id = f.id \
  JOIN public.user u \
  ON fr.user_id = u.id \
  WHERE fr.family_id = $1', [sess.famId], (err, result) => {
    if (err) {
      throw err
    }
    if(result.rows[0])
    {
      res.render('pages/family', {login: false, page:'family', members : result.rows});
    }
    else
    {
      res.render('pages/family', {login: false, page:'family', members : [{family_name : "No family Found!"}]});
    }
  });
}