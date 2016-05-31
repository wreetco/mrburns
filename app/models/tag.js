var q = require("q");

var Wregx = require("./../../lib/wregx");
var Errors = require("./../../lib/errors");

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
};

tag_schema.methods.new = function(t) {
  // let's verify and add this new one
  var d = q.defer();
  if (!Wregx.isSafeName(t.name)) {
    d.resolve(false);
    return d.promise;
  }
  // or
  var tag = new Tag();
  tag.name = t.name;
  tag.save().then(function(r) {
    d.resolve(r);
  });
  return d.promise;
};

// statics

tag_schema.statics.getById = function(t_id) {
  // grab a tag by id for malevolent use
  return new Promise(function(resolve, reject) {
    // first make sure it is not evil
    if (!Wregx.isHexstr(t_id))
      reject(Errors.invalidId());
    // it's probably coo
    Tag.findById(t_id).populate('').then(function(tag) {
      if (tag)
        resolve(tag);
      else
        reject(Errors.invalidId());
    });
  }); // end promise
}; // end getById method

var Tag = mongoose.model('Tag', tag_schema);


// send it out there
module.exports = Tag;
