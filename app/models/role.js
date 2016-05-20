var mongoose = require("mongoose");

var role_schema = mongoose.Schema({
  name: String,
  desc: String,
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

var Role = mongoose.model('Role', role_schema);


// send it out there
module.exports = Role;
