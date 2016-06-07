Error.prototype.code = ""; // probably not the best thing to do but whatevs

var Errors = {
  // avoid repeating this shit every time
  buildError: function(mess, code) {
    code = code || "";
    if (code === "") {
      // compatibility mode
      return JSON.stringify({
        error: mess
      });
    } // end old error handling method
    // new error handling
    var e = new Error();
    e.code = code;
    e.message = JSON.stringify({
      error: mess
    });
    return e;
  },
  // error message functions
  invalidEmail: function() {
    var e = "input error: the provided email address does not look valid";
    return this.buildError(e, "invalid_email");
  },

  invalidId: function() {
    var e = "input error: one or more object ids provided appear invalid";
    return this.buildError(e, "invalid_id");
  },

  notSafe: function() {
    var e = "input error: prevented potentially unsafe input";
    return this.buildError(e, "not_safe");
  },
  missingParams: function() {
    var e = "input error: one or more expected fields missing";
    return this.buildError(e, "missing_params");
  },
	loginError: function() {
    var e = "username/password is invalid or another login error has occured";
    return this.buildError(e, 401);
  },

  unauthorized: function() {
    var e = "you do not have permission to perform this action";
    return this.buildError(e, 401);
  },

  saveError: function() {
    var e = "document could not be saved, please try again";
    return this.buildError(e, "save_error");
  },

	getError: function() {
		var e = "encountered an error retrieving the requested document";
		return this.buildError(e, "get_error");
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
