// shit we need
var mongoose = require("mongoose");
var crypto = require("crypto");
// wreetco libs
var Errors = require('./../../lib/errors');
var Wregx = require('./../../lib/wregx');

var Schema = mongoose.Schema;

var user_schema = mongoose.Schema({
	email: {type: String, required: true, index: true, unique: true},
	password: String,
  account: {type: Schema.ObjectId, ref: 'Account'},
  managers: [{type: Schema.ObjectId, ref: 'Manager'}],
	roles: [{type: Schema.ObjectId, ref: 'Role'}]
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

user_schema.methods.new = function(u) {
  //new User({email:"lsdol@attack.com",password:"lol"}).save().then(function(res){user = res}, function(err){e = err})
  // add a new user to the database
  return new Promise(function(resolve, reject) {
    // first let's clean up the user
    if (!Wregx.isEmail(u.email)) {
      return reject(Errors.invalidEmail());
    }
    // really the only things to clean, the process of hashing cleans password up
    // let's make the new user and save it
    // seems this is a place where our created_date hash hurts as and was not so clever
    // as we will have to make two save calls, or race the save, neither great options
    new User(u).save().then(function(user) {
      if (!user)
        throw Errors.saveError();
      else
        return user;
    }).then(function(user) {
      // do the annoying re-save, sigh
      user.password = user.hashPassword(u.passwd);
      user.save().then(function(user) {
        resolve(user);
      }).catch(function(e) {
        throw Errors.saveError();
      });
    }).catch(function(e) {
      reject(e);
    });

  }); // end promise
};

user_schema.methods.hashPassword = function(passwd) {
  // we'll use created_date for salt, more entropy might be nice but
  // that should be good enough, a unique val is what's really important
  return crypto.createHash("sha1").update(passwd + this.created_date + process.env.WREETSALT).digest('hex');
};

user_schema.methods.getByEmail = function() {
  return new Promise(function(resolve, reject) {
    User.findOne({email: this.email}, function(err, u) {
      if (u)
        resolve(u);
      else
        reject(Errors.noMatch());
    });
  }); // end promise
};

// statics

user_schema.statics.authdForManager = function(m_id, user) {
  // for speed improvements we only take the ID, could change in the future
  if (user.managers.indexOf(m_id) != -1)
    return true;
  else
    return false;
}; // end authdForManager method

var User = mongoose.model('User', user_schema);


// send it out there
module.exports = User;
