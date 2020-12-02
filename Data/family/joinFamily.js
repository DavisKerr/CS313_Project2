exports.joinFamily = function(pool, famName, famCode, res, sess)
{
  pool.query("SELECT * FROM public.family WHERE family_name = $1 AND family_code = $2", [famName, famCode], (req, familyRows) => {
    if(familyRows.rows[0])
    {
      insertIntoFamily(pool, res, sess, familyRows.rows[0]);
    }
    else
    {
      res.send({success : false});
    }
  });
  
}

function insertIntoFamily(pool, res, sess, familyRow)
{
  pool.query("INSERT INTO public.family_relationship \
  ( user_id \
  , family_id \
  , date_joined \
  ) \
  VALUES \
  ( $1 \
  , $2 \
  , (SELECT CURRENT_TIMESTAMP) \
  )", [sess.uid, familyRow.id], (err, result) => {
    if (err) {
      throw err;
    }
    sess.isPartFam = true;
    sess.famId = familyRow.id;
    res.send({success : true});
  });
  
}