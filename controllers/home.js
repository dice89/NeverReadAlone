/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
    res.json({message:"HelloWorld"});

};
