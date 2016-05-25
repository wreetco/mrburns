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
    /*new Record.new(req.body.record, req.body.manager).then(function(r) {
      // add it, then
    });*/
    // we will want to verify each field the user requested is allowed and safe
    async.waterfall([
      // first collect the manager ID the record will belong to, make sure it is
      // safe and that the user attached to this token has permission to work there
      function(callback) {
        var m = Manager();
        m.getById(req.body.manager, 'modules').then(function(m) {
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
      function(m, callback) {
        // so if we're cool with it then let's build this object
        var r = {};
        var in_r = req.body.record;
        // get a list of approved fields for this record
        var fields = m.fields();
        // iterating only what the user gives us gives us a chance to save on passes
        for (k in in_r)
          if (fields.indexOf(k) != -1)
            r[k] = in_r[k];
        // if we're about done here...
        callback(null, r);
      }
    ], function(e, r) {
      // end of the line
      if (e) // kill us off if we had an error somewhere
        res.send(e);
      // basically we're cool here. pass the r to the flexfield and save it
      r = Record({x: r});
      //r.save();
      res.send(r);
    });
  } // end new method
};

module.exports = RecordCtrl;
