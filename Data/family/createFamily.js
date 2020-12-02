const { joinFamily } = require("./joinFamily");

exports.createFamily = function(pool, famName, famCode, res, sess, joinFamily)
{

  pool.query("SELECT * FROM public.family WHERE family_name = $1", [famName], (req, resultNames) => {
    if(!resultNames.rows[0])
    {
      insertFamily(pool, famName, famCode, res, sess, joinFamily);
    }
    else
    {
      res.send({success : false});
    }
  });

  
}

function insertFamily(pool, famName, famCode, res, sess, joinFamily)
{
  
  pool.query("INSERT INTO public.family \
  ( owner_id \
  , date_created \
  , family_name \
  , family_code \
  ) \
  VALUES \
  ( $1 \
  , (SELECT CURRENT_TIMESTAMP) \
  , $2 \
  , $3 \
  )", [sess.uid, famName.trim(), famCode.trim()], (err, result) => {
    if (err) {
      throw err;
    }

    joinFamily.joinFamily(pool, famName, famCode, res, sess);
    
  });
  
}