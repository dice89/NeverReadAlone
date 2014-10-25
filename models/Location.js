var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
	fb_id:String,
  	street: String,
    city: String,
    state: String,
    country: String,
    zip: String,
    latitude: String,
    longitude: String
});

module.exports = mongoose.model('Location', locationSchema);