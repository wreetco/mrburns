/*
	* it's another railsism, fucking deal with it jon
  * basically there are some things that are best left to the big man, homer
*/

var Session = require("./../models/session");

var Homer = {
  isAuthd(sess, next) {
    // check if they have a valid session
    var s = Session();
    s.getById(sess).then(function(session) {
      if (session)
        next();
      else
        next(new Error(401));
    });
  } // end isAuthd method
};

module.exports = ApplicationCtrl = Homer;

