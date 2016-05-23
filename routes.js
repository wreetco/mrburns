var Errors = require("./lib/errors");

var AppCtrl = require("./app/controllers/application_ctrl");
var AccountCtrl = require("./app/controllers/account_ctrl.js").AccountCtrl;
var TagCtrl = require("./app/controllers/tag_ctrl.js").TagCtrl;
var RecordCtrl = require("./app/controllers/record_ctrl");
var FieldCtrl = require("./app/controllers/field_ctrl.js").FieldCtrl;
var UserCtrl = require("./app/controllers/user_ctrl.js").UserCtrl;
var ReminderCtrl = require("./app/controllers/reminder_ctrl.js").ReminderCtrl;
var SessionCtrl = require("./app/controllers/session_ctrl.js");

module.exports = function(app) {
  /*
    * Session fuckshit
  */
  // GET /auth (session)
  app.post('/auth', function(req, res) {
    //res.send(UserCtrl.login(req));
		UserCtrl.login(req, res);
  });
  // end get /auth

  // anything above the app.all can be accessed with no auth key
  app.all("*", function(req, res, next) {
    AppCtrl.isAuthd(req.body.key, next);
  });
  // anything below the app.all will first check for a valid auth token before performing its action

  /*
    * Account actions
  */
  // GET /account
  app.get('/account', function(req, res) {
    res.send(AccountCtrl.demo());
  });
  // end get /account
  // end account actions

  /*
    * Manager actions
  */
  // GET /managers
  app.get('/managers', function(req, res) {
    // sup brad
  });
  // end get /managers
  // end manager actions

  /*
    * Record actions
  */
  // POST /
  app.post('/record', function(req, res) {
    RecordCtrl.new(req, res);
  });
  // end post /record
  // end record actions

  /*
    * Tag actions
  */
  // GET /tag
  app.get('/tag', function(req, res) {
    res.send(TagCtrl.demo());
  });
  // end get /tag
  // end tag actions

  /*
    * Field actions
  */
  // GET /field
  app.get('/field', function(req, res) {
    res.send(FieldCtrl.demo());
  });
  // end get /field
  // end field actions

  /*
    * User actions
  */
  // GET /user
  app.get('/user/:user_id', function(req, res) {
    res.send(UserCtrl.demo());
  });
  // end get /user
  // POST /user
  app.post('/user', function(req, res) {
    res.send(UserCtrl.new(req));
  });
  // end post /user
  // end user actions

  /*
    * Reminder actions
  */
  // GET /reminder
  app.get('/reminder', function(req, res) {
    res.send(ReminderCtrl.demo());
  });
  // end get /reminder
  // end reminder actions

  // errors
  app.use(function(err, req, res, next){
    if(err instanceof Error){
      if(err.message === '401'){
        res.send(Errors.unauthorized());
      }
    }
  });

};
