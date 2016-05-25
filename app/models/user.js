// shit we need
var mongoose = require("mongoose");
var crypto = require("crypto");
var q = require("q");
// wreetco libs
var Errors = require('./../../lib/errors');
var Wregx = require('./../../lib/wregx');

var Schema = mongoose.Schema;

var user_schema = mongoose.Schema({
	email: String,
	password: String,
  account: {type: Schema.ObjectId, ref: 'Account'},
  //managers: [{type: Schema.ObjectId, ref: 'Manager'}],
	roles: [{type: Schema.ObjectId, ref: 'Role'}]
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

user_schema.methods.new = function(u) {
  // add a new user to the database
  var d = q.defer();
  // first let's clean up the user
  if (!Wregx.isEmail(u.email)) {
    d.reject(Errors.invalidEmail());
    return d.promise;
  }
  //else if (!Wregx.isHexstr(u.account)) {
  //  d.reject(Errors.invalidId());
    //return d.promise;
  //}
  // really the only things to clean, the process of hashing cleans password up
  // let's make the new user and save it
  // seems this is a place where our created_date hash hurts as and was not so clever
  // as we will have to make two save calls, or race the save, neither great options
  try {
    new User(u).save().then(function(user) {
      // now hash and re-save, sigh
      user.password = user.hashPassword(u.password);
      user.save().then(function(user) {
        d.resolve(user);
      });
    });
  } catch(e) {
    d.reject(e);
  }
  return d.promise;
};

user_schema.methods.hashPassword = function(passwd) {
  // we'll use created_date for salt, more entropy might be nice but
  // that should be good enough, a unique val is what's really important
  return crypto.createHash("sha1").update(passwd + this.created_date + process.env.WREETSALT).digest('hex');
};

user_schema.methods.getByEmail = function() {
  var d = q.defer();
  User.findOne({email: this.email}, function(err, u) {
    if (u) {
      d.resolve(u);
    }
    else
      d.resolve(false);
  });
  return d.promise;
};


var User = mongoose.model('User', user_schema);


// send it out there
module.exports = User;
