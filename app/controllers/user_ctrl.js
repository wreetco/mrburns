var User = require("./../models/user.js");

var UserCtrl = {
  demo: function() {
    var u = User({
      email: "some_user@wreet.co",
      password: "thisbehashedlolfyck",
      roles: ["admin"],
      managers: [{instance_of: "manager"}]
    });
    return u;
  },

  new: function(req) {
    var email = req.body.email;
    var passwd = req.body.passwd;
    // validate the deals

    var u = User({
      email: email,
      password: passwd
    });
    return u;
  }

};

exports.UserCtrl = UserCtrl;
