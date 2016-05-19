var examples = require('./app/controllers/example.js');
var AccountCtrl = require("./app/controllers/account_ctrl.js").AccountCtrl;
var TagCtrl = require("./app/controllers/tag_ctrl.js").TagCtrl;
var ContactCtrl = require("./app/controllers/contact_ctrl.js").ContactCtrl;
var FieldCtrl = require("./app/controllers/field_ctrl.js").FieldCtrl;
var UserCtrl = require("./app/controllers/user_ctrl.js").UserCtrl;
var ReminderCtrl = require("./app/controllers/reminder_ctrl.js").ReminderCtrl;

module.exports = function(app) {
  // example model route
  app.get('/example/show', function(req, res) {
    examples.show(req, res);
  });

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
    * Tag actions
  */
  // GET /tag
  app.get('/tag', function(req, res) {
    res.send(TagCtrl.demo());
  });
  // end get /tag
  // end tag actions

  /*
    * Contact actions
  */
  // GET /contact
  app.get('/contact', function(req, res) {
    res.send(ContactCtrl.demo());
  });
  // end get /contact
  // end contact actions

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

};
