var mongoose = require("mongoose");
var crypto = require("crypto");

var user_schema = mongoose.Schema({
	created_date: {type: Date, default: Date.now},
	email: String,
	password: String,
	roles: [],
	managers: []
});

user_schema.methods.demo = function() {
  console.log(this);
};

user_schema.methods.hashPassword = function(passwd) {
  // we'll use created_date for salt, more entropy might be nice but
  // that should be good enough, a unique val is what's really important
  return crypto.createHash("sha1").update(passwd + this.created_date + process.env.WREETSALT).digest('hex');
};


var User = mongoose.model('User', user_schema);


// send it out there
module.exports = User;
