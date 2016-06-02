var mongoose = require("mongoose");

var field_schema = mongoose.Schema({
  tab: {type: String, default: ""},
  section: {type: String, default: ""},
  name: {type: String, default: ""},
  db_name: {type: String, default: ""},
  type: String,
  visibility: String,
  order: Number
});


var Field = mongoose.model('Field', field_schema);


// send it out there
module.exports = Field;
