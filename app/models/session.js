var q = require("q");
var Wregx = require("../../lib/wregx");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var session_schema = mongoose.Schema({
  expires: {type: Date, default: Date.now() + (7*24*60*60*1000)},// let's try default one week
	user: {type: Schema.ObjectId, ref: 'User'}
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});


session_schema.methods.getById = function(sess) {
  // grab a session by id for malevolent use
  var d = q.defer();
  // first make sure it is not evil
  if (!Wregx.isHexstr(sess))
    d.resolve(false);
  // it's probably coo
  Session.findById(sess, function(e, session) {
    if (session) {
      d.resolve(session);
    }
    else
      d.resolve(false);
  });
  return d.promise;
};

var Session = mongoose.model('Session', session_schema);


// send it out there
module.exports = Session;
