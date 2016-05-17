var mongoose = require("mongoose");

var user_schema = mongoose.Schema({
	email: String,
	password: String,
	roles: [],
	managers: []
});

user_schema.methods.demo = function() {
  console.log(this);
}

var User = mongoose.model('User', user_schema);


// send it out there
module.exports = User;
