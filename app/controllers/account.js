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


var t = new Account({
  email: "test@hello.com",
  password: "some_hash_val",
  billing: "encrypted_string",
  managers: [{
    man_prop: "value"
  }]
});

t.demo();

// send it out there
module.exports = {
  Account: Account
}
