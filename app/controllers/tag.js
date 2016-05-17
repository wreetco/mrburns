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


var t = new Tag({
  name: "example",
  predef: false
});

t.demo();

// send it out there
module.exports = {
  Tag: Tag
}
