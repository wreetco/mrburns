var Errors = require("./lib/errors");

var AppCtrl = require("./app/controllers/application_ctrl");
var AccountCtrl = require("./app/controllers/account_ctrl").AccountCtrl;
var TagCtrl = require("./app/controllers/tag_ctrl");
var RecordCtrl = require("./app/controllers/record_ctrl");
var FieldCtrl = require("./app/controllers/field_ctrl").FieldCtrl;
var UserCtrl = require("./app/controllers/user_ctrl").UserCtrl;
var ReminderCtrl = require("./app/controllers/reminder_ctrl").ReminderCtrl;
var SessionCtrl = require("./app/controllers/session_ctrl");
var ManagerCtrl = require("./app/controllers/manager_ctrl");
var EmailCtrl = require("./app/controllers/email_ctrl");


module.exports = function(app) {
  /*
    * Session fuckshit
  */
  // GET /auth (session)
  app.post('/auth', function(req, res, next) {
    //res.send(UserCtrl.login(req));
		UserCtrl.login(req, res, next);
  });
  // end get /auth

  /*
    * no-auth email actions
  */
  // GET /t.gif
  app.get('/t.gif', function(req, res, next) {
    EmailCtrl.markRead(req, res, next);
  });
  // end get /t.gif
  // end email actions

  // anything above the app.all can be accessed with no auth key
  app.all("*", function(req, res, next) {
    AppCtrl.isAuthd(req, next);
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
    console.log('get /managers');
  });
  // GET /manager/records
  // end get /managers
  app.get('/manager/:m_id/records', function(req, res, next) {
    ManagerCtrl.getRecords(req, res, next);
  });
  // end get /manager/records
  // POST /manager
  app.post('/manager', function(req, res) {
    ManagerCtrl.new(req, res);
  });
  // end POST /manager
  // POST /manager/field
  app.post('/manager/field', function(req, res, next) {
    ManagerCtrl.addCustomField(req, res, next);
  });
  // end POST /manager/field
  // GET /manager/interface
  app.get('/manager/:m_id/interface', function(req, res, next) {
    ManagerCtrl.buildInterface(req, res, next);
  });
  // end get /manager/interface
  // end manager actions

  /*
    * Record actions
  */
  // POST /
  app.post('/record', function(req, res, next) {
    RecordCtrl.new(req, res, next);
  });
  // end post /record
  // POST /record/tag
  app.post('/record/tag', function(req, res, next) {
    // push tag into record's tag array
    RecordCtrl.addTags(req, res, next);
  });
  // end post /record/tag
  // end record actions

  /*
    * Tag actions
  */
  // GET /tag
  app.get('/tag', function(req, res) {
    res.send(TagCtrl.demo());
  });
  // end get /tag
  // POST /tag
  app.post('/tag', function(req, res, next) {
    TagCtrl.new(req, res, next);
  });
  // end post /tag
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
  app.post('/user', function(req, res, next) {
    UserCtrl.new(req, res, next);
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
      var status;
      switch (err.code) {
        case "401":
          status = 401;
          break;
        case "no_match":
          status = 400;
          break;
        case "not_safe":
          status = 400;
          break;
        case "save_error":
          status = 500;
          break;
        default:
          // generic error
          status = 400;
      } // end error switch
      res.status(status).send(err.message);
    }
  });

};
