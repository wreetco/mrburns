// wreetco libs
var Errors = require('./../../lib/errors');
var Wlog = require('./../../lib/wlog');
var Wregx = require('./../../lib/wregx');
// required models
var User = require("./../models/user");
// supporting controllers
var SessionCtrl = require("./session_ctrl");


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
  }, // end new

  login: function(req, res) {
    // some basic safety checks
    if (!req.body.email || !req.body.passwd)
      return res.send(Errors.missingParams());
    if (!Wregx.isEmail(req.body.email))
      return res.send(Errors.invalidEmail());
    if (!Wregx.injSafe(req.body.passwd))
      return res.send(Errors.notSafe());
    // otherwise we're cool to move forward
    var u = User();
    u.email = req.body.email;
    u.getByEmail().then(function(user) {
      if (user) {
        u.created_date = user.created_date;
        // see if the password matches
        if (u.hashPassword(req.body.passwd) == user.password) {
          // looks good, let's get this dude a session
          res.send({
            user: u,
            session: SessionCtrl.new()
          });
        }
      }
      // either email or pass was wrong if exec falls out to this line
      res.send({error: Errors.loginError});
    });
  } // end login

};

exports.UserCtrl = UserCtrl;
