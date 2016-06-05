var Wregx = require("./../../lib/wregx");
var Errors = require("./../../lib/errors");
var Wlog = require("../../lib/wlog");

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
  // new Tag().new({name:"wret"}).then(function(r){t = r}).catch(function(err){e = err})
  // let's verify and add this new one
  return new Promise(function(resolve, reject) {
    if (!Wregx.isSafeName(t.name)) {
      // log and reject
      Wlog.log("rejected unsafe tag name: " + t.name, "security");
      return reject(Errors.notSafe());
    }
    // check if the tag is already defined
    Tag.find({name:t.name}).then(function(tag) {
      if (tag.length !== 0)
        return tag[0];
      else
        return false;
    }).then(function(tag) {
      if (tag)
        return resolve(tag); // already exists
      // save it
      new Tag(t).save().then(function(tag) {
        if (tag)
          resolve(tag);
        else
          throw Errors.saveError();
      });
    }).catch(function(e) {
      reject(e);
    });
  }); // end promise
}; // end new tag

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
