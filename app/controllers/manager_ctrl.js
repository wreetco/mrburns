var Wregx = require("./../../lib/wregx");
var Errors = require("./../../lib/errors");
var Manager = require("./../models/manager");
var User = require("./../models/user");

var ManagerCtrl = {
  new: function(req, res) {
    new Manager().new(req.body.manager, req.session.user).then(function(m) {
      res.send(m);
    }, function(e) {
      res.send(e);
    });
  }, // end new manager

  addCustomField: function(req, res) {
    // add a new custom field to a manager instance
    User.findById(req.session.user).then(function(u) {
      return new Promise(function(resolve, reject) {
        if (!u) // weird, session obj should never present this
          reject(Errors.loginError());
        else
          resolve(u);
      }); // end promise
    }, function(e) {
      // rejected!
      res.send(e);
    }).then(function(u) {
      return new Promise(function(resolve, reject) {
        // we found the user
        if (!u.authdForManager(req.body.manager))
          reject(Errors.unauthorized());
        // looks like we're good to move forward
        // get the manager and add the field to it
        if (!Wregx.isHexstr(req.body.manager))
          reject(Errors.notSafe());
        // we coo
        Manager.findById(req.body.manager).then(function(m) {
          // what it brad
          if (!m)
            reject('bad brad');
          // add the field
          m.addField(req.body.field).then(function(updated_manager) {
            // saved and updated
            resolve(updated_manager);
          }, function(e) {
            // probably some sort of DB save issue
            reject(e);
          });
        });
      }); // end promise
    }, function(e) {
      // rejected
      res.send(e);
    }).then(function(manager) {
      res.send(manager);
    }, function(e) {
      res.send(e);
    });
  }, // end addCustomField

};

module.exports = ManagerCtrl;
