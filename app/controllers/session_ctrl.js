var Session = require("./../models/session.js");

var SessionCtrl = {
  demo: function() {
    return Session({
      user: {'email': 'lol@attack.com'}
    });
  }
};

module.exports = SessionCtrl;
