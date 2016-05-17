var mongoose = require("mongoose");

var account_schema = mongoose.Schema({
	email: String,
	password: String,
	billing: String,
	managers: []
});

account_schema.methods.demo = function() {
  console.log(this);
}

var Account = mongoose.model('Account', account_schema);


// send it out there
module.exports = Account;
