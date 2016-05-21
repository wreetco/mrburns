var mongoose = require("mongoose");

var tag_schema = mongoose.Schema({
  name: String,
  predef: {type: Boolean, default: false},
  sticky: {type: String, default: ""}
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

tag_schema.methods.demo = function() {
  console.log(this);
}

var Tag = mongoose.model('Tag', tag_schema);


// send it out there
module.exports = Tag;
