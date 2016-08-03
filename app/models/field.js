var mongoose = require("mongoose");

var field_schema = mongoose.Schema({
  tab: {type: String, required: true},
  section: {type: String, required: true},
  name: {type: String, required: true},
  db_name: {type: String, required: true},
  type: {type: String, required: true},
  visibility: String,
  order: Number
});

field_schema.statics.types = function() {
  return [
    "string",
    "int",
    "date",
    "email"
  ];
};


var Field = mongoose.model('Field', field_schema);


// send it out there
module.exports = Field;
