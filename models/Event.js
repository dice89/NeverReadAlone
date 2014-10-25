var mongoose = require('mongoose');


var eventSchema = new mongoose.Schema({
  name: String,
  description: String, 
  fbid: String,
  geo: { 'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} },
  location : { type: mongoose.Schema.ObjectId, ref: 'Location' }
});

module.exports = mongoose.model('Event', eventSchema);