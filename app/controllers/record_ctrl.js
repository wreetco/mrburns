var async = require("async");

var Wregx = require("./../../lib/wregx");

var Record = require("./../models/record");
var Manager = require("./../models/manager");

var RecordCtrl = {
  demo: function() {
    var c = "sdfds";
    return c;
  },

  new: function(req, res) {
    /*
      post a new record to the db
    */
    // we will want to verify each field the user requested is allowed and safe
    async.waterfall([
      // first collect the manager ID the record will belong to, make sure it is
      // safe and that the user attached to this token has permission to work there
      function(callback) {
        var m = Manager();
        m.getById(req.body.manager).then(function(m) {
          if (m)
            callback(null, m);
          else
            callback("invalid manager", null);
        });
      },
      // take a look at it
      function(m, callback) {
        // essentially if this user does not appear in m.users he is not allowed
        if (m.users.indexOf(req.session.user) == -1)
          callback("user not authorized on this manager", null);
        else // we good
          callback(null, m);
      },
      function(r, callback) {
        // so if we're cool with it then let's build this object
        var rec = req.body.record;

        // if we're about done here...
        callback(null, rec);
      }
    ], function(e, r) {
      // end of the line
      if (e)
        res.send(e);
      res.send(r);
    });
    // if the data looks good let's put it on a record
    // get a new record

    // assign the record's fields to our user JSON

    // save the object and resolve the promise
  } // end new method
};

module.exports = RecordCtrl;
