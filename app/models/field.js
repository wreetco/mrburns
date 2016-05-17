var mongoose = require("mongoose");

var field_schema = mongoose.Schema({
  section: String,
  name: String,
  db_name: String,
  type: String,
  visibility: String,
  order: Number
});

field_schema.methods.demo = function() {
  console.log(this);
}

var Field = mongoose.model('Field', field_schema);


// send it out there
module.exports = Field;
