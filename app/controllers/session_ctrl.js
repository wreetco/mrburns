/*
	TODO: perhaps save the user's avail managers at session create
			* in order to speed manager lookup narrowed by smaller session lookup
*/
var Session = require("./../models/session.js");

var SessionCtrl = {
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
