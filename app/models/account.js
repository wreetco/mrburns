var mongoose = require("mongoose");

var account_schema = mongoose.Schema({
	billing: String,
	managers: [],
  users: []
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

account_schema.methods.demo = function() {
  console.log(this);
}

var Account = mongoose.model('Account', account_schema);


// send it out there
module.exports = Account;
