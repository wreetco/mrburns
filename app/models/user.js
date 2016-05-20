var mongoose = require("mongoose");
var crypto = require("crypto");
var q = require("q");

var user_schema = mongoose.Schema({
	email: String,
	password: String,
	roles: []
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

user_schema.methods.demo = function() {
  console.log(this);
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
