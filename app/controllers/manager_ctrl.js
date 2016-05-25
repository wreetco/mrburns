var Wregx = require("./../../lib/wregx");
var Errors = require("./../../lib/errors");
var Manager = require("./../models/manager");

var ManagerCtrl = {

  new: function(req, res) {
    new Manager().new(req.body.manager, req.session.user).then(function(m) {
      res.send(m);
    }, function(e) {
      res.send(e);
    });
  } // end new manager


};

module.exports = ManagerCtrl;
