var Session = require("./../models/session.js");

var SessionCtrl = {
  demo: function() {
    return Session({
      user: {'email': 'lol@attack.com'}
    });
  }, // end demo

  new: function() {
    var s = Session({});
    return s;
  }, // end new session

  save: function(sess, user) {
    /*
      * Save a given session to a specified user
      * note users may have multiple sessions
    */
    sess.user = user;
    sess.save();
  } // end save

};

module.exports = SessionCtrl;
