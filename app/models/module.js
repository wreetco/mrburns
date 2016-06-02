var mongoose = require("mongoose");
var uuid = require("uuid");

var Field = require("./field");

var Schema = mongoose.Schema;

var module_schema = mongoose.Schema({
  fields: [Field.schema],
  tabs: [],
  name: {type: String, default: ""},
  description: {type: String, default: ""},
  settings: {},
  tags: [{type: Schema.ObjectId, ref: 'Tag'}] // predef'd tags
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});


var Module = mongoose.model('Module', module_schema);


// send it out there
module.exports = Module;
