var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var manager_schema = mongoose.Schema({
  organization: String,
  account: {type: Schema.ObjectId, ref: 'Account'},
  modules: {type: Schema.ObjectId, ref: 'Module'},
  contacts: [{type: Schema.ObjectId, ref: 'Contact'}],
  users: {type: Schema.ObjectId, ref: 'User'},
  custom_fields: {type: Schema.ObjectId, ref: 'Field'},
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

manager_schema.methods.demo = function() {
  console.log(this);
}

var Manager = mongoose.model('Manager', manager_schema);


// send it out there
module.exports = Manager;
