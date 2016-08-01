// wreetco libs
var Errors = require('./../../lib/errors');
var Wlog = require('./../../lib/wlog');
var Wregx = require('./../../lib/wregx');
// required models
var User = require("./../models/user");
// supporting controllers
var Session = require("./../models/session");


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

  new: function(req, res, next) {
    new User().new(req.body.user).then(function(r) {
      // see what we get
      if (!r)
        throw Errors.saveError();
      res.send(r);
    }).catch(function(e) {
      next(e);
    });
  }, // end new

  login: function(req, res, next) {
    // some basic safety checks
    if (!req.body.email || !req.body.passwd)
      return next(Errors.missingParams());
    if (!Wregx.isEmail(req.body.email))
      return next(Errors.invalidEmail());
    if (!Wregx.injSafe(req.body.passwd)) {
      Wlog.log("rejected suspicious password '" + req.body.password + "' for user " + req.body.email, "security");
      return next(Errors.notSafe());
    }
    // otherwise we're cool to move forward
    var u = new User();
    u.email = req.body.email;
    u.getByEmail().then(function(user) {
      if (user) {
        u.created_date = user.created_date;
        // see if the password matches
        if (u.hashPassword(req.body.passwd) == user.password) {
          // looks good, let's get this dude a session
          Session.new(user).then(function(s) {
            Wlog.log("created session for " + user.email, "security");
            return res.send(s);
          }).catch(function(e){
            throw Errors.loginError();
          });
        }
      }
    }).catch(function(e) {
      // we only catch a bad login, so log that
      Wlog.log("rejected login attempt for user " + req.body.email, "security");
      next(e);
    });
  }, // end login

  logout: function(req, res, next) {
    // delete the session from the collection by ID
    Session.findById(req.session.id).then(function(s) {
      // remove it
      s.remove();
      return res.send({
        logged_out: true
      });
    }).catch(function(e) {
      // brad
      next(Errors.saveError());
    });
  }, // end logout method

  modifySettings: function(req, res, next) {
    // update settings based on the user's passed settings list
    req.session.user.modifySettings(req.body.settings).then(function(r) {
      // we did it yay
      if (r) res.send(r); // should return an updated copy of the settings obj
    }).catch(function(err) {
      // wtf?!
      next(err);
    });
  } // end modifySettings method

};

exports.UserCtrl = UserCtrl;
