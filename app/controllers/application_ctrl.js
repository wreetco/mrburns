/*
	* it's another railsism, fucking deal with it jon
  * basically there are some things that are best left to the big man, homer
*/

var Session = require("./../models/session");

var Homer = {
  isAuthd: function(req, next) {
    // check if they have a valid session
    // use the session key from the Auth header
    var sess = req.get('Authorization');
    Session.getById(sess).then(function(session) {
      if (session) {
        req.session = session;
        next();
      }
    }, function(e) {
      // rejected
      next(new Error(401));
    });
  } // end isAuthd method
};

module.exports = ApplicationCtrl = Homer;

