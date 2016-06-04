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

  invalidId: function() {
    var e = "input error: one or more object ids provided appear invalid";
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
    var e = "you do not have permission to perform this action";
    return this.buildError(e);
  },

  saveError: function() {
    var e = "document could not be saved, please try again";
    return this.buildError(e);
  },

  noMatch: function() {
    var e = "search error: provided data matched no documents";
    return this.buildError(e);
  },

  mailAlreadyRead: function() {
    var e = "mail error: this email has already been marked read";
    return this.buildError(e);
  },

  mailMarkRead: function() {
    var e = "mail error: failed to mark mail as read";
    return this.buildError(e);
  }
};

module.exports = Errors;
