/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  
    if(req.user){
          res.json({message:"Logged In"});
    }else{
          res.json({message:"Logged Out"});
    }
};
