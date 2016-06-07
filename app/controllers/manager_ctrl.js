var Wregx = require("./../../lib/wregx");
var Errors = require("./../../lib/errors");
var Manager = require("./../models/manager");
var User = require("./../models/user");

var ManagerCtrl = {
  new: function(req, res) {
    new Manager().new(req.body.manager, req.session.user).then(function(m) {
      res.send(m);
    }).catch(function(e) {
      res.send(e);
    });
  }, // end new manager

  addCustomField: function(req, res, next) {
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
      //res.send(e);
      next(e);
    }).then(function(u) {
      return new Promise(function(resolve, reject) {
        // we found the user
        if (!User.authdForManager(req.body.manager, u))
          return reject(Errors.unauthorized());
        // looks like we're good to move forward
        // get the manager and add the field to it
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
            return reject(e);
          });
        });
      }); // end promise
    }, function(e) {
      // rejected
      next(e);
    }).then(function(manager) {
      res.send(manager);
    }, function(e) {
      next(e);
    });
  }, // end addCustomField

  getRecords: function(req, res, next) {
    // grab all the records for the manager m_id given options opts
    var m_id = req.params.m_id;
    // make sure it is safe
    if (!Wregx.isHexstr(m_id))
      return next(Errors.invalidId());
    // does the user have permission to read this manager
    if (!User.authdForManager(m_id, req.session.user))
      return next(Errors.unauthorized());
    Manager.getById(m_id, 'records').then(function(m) {
      return res.send(m.records);
    }).catch(function(e) {
      return next(Errors.noMatch());
    });
  }, // end getRecords method


  buildInterface: function(req, res, next) {
    // build the interface for a given manager id
    var m_id = req.params.m_id;
    // make sure it is safe
    if (!Wregx.isHexstr(m_id))
      return next(Errors.invalidId());
    // does the user have permission to read this manager
    if (!User.authdForManager(m_id, req.session.user))
      return next(Errors.unauthorized());
    Manager.getById(m_id, 'modules').then(function(m) {
      if (!m)
        throw Errors.noMatch();
      else
        return m;
    }).then(function(m) {
      // get the interface
      Manager.buildInterface(m).then(function(interface) {
        res.send(interface);
      }).catch(function(e) {
        throw Errors.getError();
      });
    }).catch(function(e) {
      return next(e);
    });
  } // end buildInterface method

};

module.exports = ManagerCtrl;







