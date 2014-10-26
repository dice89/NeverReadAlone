/**
 * GET /
 * Home page.
 */
var User = require("../models/User");

exports.index = function(req, res) {
	console.log("Generating Dummy Data");

	var userNameList=['olcay','alex','sara','dominik','sergey','test1','test2','test3','test4'];

	userNameList.forEach(function(entry) {
		User.findOne({email:entry+'@test.com'}).remove().exec();
	});

	userNameList.forEach(function(entry) {
		var user = new User({ profile:{name:entry,gender:'male'},email:entry+'@test.com', password:'123456', expertise:'java nodejs', description:'Example description' });
		user.save(function (err, user) {
		  if (err) return console.error(err);
		 	 console.log(user +" user saved");
		});
	});

	console.log("Generated1 Dummy Data");
    res.json({message:"Dummy Data created"});
};
