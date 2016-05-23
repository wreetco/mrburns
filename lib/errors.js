var Errors = {
  // avoid repeating this shit every time
  buildError: function(mess) {
    return JSON.stringify({
      error: mess
    });
  },
  // error message functions
  invalidEmail: function() {
    var e = "input error: the provided email address does not look valid";
    return this.buildError(e);
  },
  notSafe: function() {
    var e = "input error: prevented potentially unsafe input";
    return this.buildError(e);
  },
  missingParams: function() {
    var e = "input error: one or more expected fields missing";
    return this.buildError(e);
  },
	loginError: function() {
    var e = "username/password is invalid or another login error has occured";
    return this.buildError(e);
  },

  unauthorized: function() {
    var e = "you must be logged in to perform this action";
    return this.buildError(e);
  }
}

module.exports = Errors;
