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
  }
};

exports.UserCtrl = UserCtrl;
