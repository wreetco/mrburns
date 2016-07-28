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

tag_schema.statics.getByName = function(tag_str, opts) {
  // get a tag by name
  opts = opts || {};
  return new Promise(function(resolve, reject) {
    Tag.findOne({name: tag_str}).then(function(tag){
      if (tag)
        return resolve(tag);
      else {
        if (opts.ins_on_new)
          return false;
        else
          throw Errors.noMatch();
      }
    }).then(function(tag) {
      if (!tag) {
        // happens to be how we signify this stage should insert the new tag
        var t = new Tag({name: tag_str});
        new Tag().new(t).then(function(r) {
          resolve(r);
        }).catch(function(err) {
          throw Errors.saveError();
        });
      }
    }).catch(function(err) {
      reject(err);
    });
  });
}; // end getByName method

tag_schema.statics.resolveTags = function(tags, ins_on_new) {
  // take a list of tags and send back a list of them that correspond
  // it will do both ids and tag strings, adding completely new tags
  // to the db if needed
  return new Promise(function(resolve, reject) {
    var tasks = [];
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (Wregx.isHexstr(t))
        tasks.push(Tag.getById(t));
      else
        tasks.push(Tag.getByName(t, {ins_on_new: true}));
    }
    Promise.all(tasks).then(function(r) {
      // r is now a list of tag objs thanks to how promise.all works
      resolve(r);
    });
  });
}; // end resolveTags function

var Tag = mongoose.model('Tag', tag_schema);


// send it out there
module.exports = Tag;
