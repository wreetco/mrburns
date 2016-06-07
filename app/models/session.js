var Wregx = require("../../lib/wregx");
var Errors = require("../../lib/errors");
var Wlog = require('./../../lib/wlog');

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

// statics

session_schema.statics.getById = function(s_id) {
  // grab a session by id for malevolent use
  return new Promise(function(resolve, reject) {
    // first make sure it is not evil
    if (!Wregx.isHexstr(s_id)) {
      Wlog.log("caught invalid hex str in auth header", "security");
      return reject(Errors.loginError());
    }
    // it's probably coo
    Session.findById(s_id).populate('user').then(function(session) {
      if (session && (Date.now() < session.expires.getTime()))
        resolve(session);
      else
        reject(Errors.loginError());
    }).catch(function(e) {
      reject(Errors.loginError());
    });
  }); // end promise
};

session_schema.statics.new = function(user) {
  return new Promise(function(resolve, reject) {
    // first, let's not make users another session if they already have one
    // thing is, sometimes you might want to for more fine-grained control
    // over a sessions, but we'll save that for another day
    Session.find({user:user.id}).then(function(s) {
      if (s.length > 0)
        return s[0];
      else
        return false;
    }).then(function(s) {
      if (s)
        return resolve(s);
      new Session({user: user}).save().then(function(s) {
        resolve(s);
      }).catch(function(e) {
        throw Errors.saveError();
      });
    }).catch(function(e) {
      reject(e);
    });
  }); // end promise
};

var Session = mongoose.model('Session', session_schema);


// send it out there
module.exports = Session;
