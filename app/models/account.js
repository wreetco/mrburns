var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var account_schema = mongoose.Schema({
	billing: String,
	managers: [{type: Schema.ObjectId, ref: 'Manager'}],
  users: [{type: Schema.ObjectId, ref: 'Course'}]
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
