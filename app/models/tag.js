var mongoose = require("mongoose");

var tag_schema = mongoose.Schema({
  name: String,
  predef: Boolean,
  sticky: {type: String, default: ""}
});

tag_schema.methods.demo = function() {
  console.log(this);
}

var Tag = mongoose.model('Tag', tag_schema);


// send it out there
module.exports = Tag;
