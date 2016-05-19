var mongoose = require("mongoose");
var uuid = require("uuid");

var session_schema = mongoose.Schema({
  expires: {type: Date, default: Date.now() + (7*24*60*60*1000)},// let's try default one week
	token: {type: String, default: uuid.v4()},
	user: {}
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});


var Session = mongoose.model('Session', session_schema);


// send it out there
module.exports = Session;
