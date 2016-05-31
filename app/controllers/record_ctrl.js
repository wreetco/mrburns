var async = require("async");

var Wregx = require("./../../lib/wregx");
var Errors = require("./../../lib/errors");

var Record = require("./../models/record");
var Manager = require("./../models/manager");
var Tag = require("./../models/tag");

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
    // easy first thing to check, is the provided manager id good
    if (!Wregx.isHexstr(req.body.manager))
      return res.send(Errors.invalidId());
    async.waterfall([
      // first collect the manager ID the record will belong to, make sure it is
      // safe and that the user attached to this token has permission to work there
      function(callback) {
        Manager.getById(req.body.manager, 'modules').then(function(m) {
          if (m)
            callback(null, m);
          else
            callback("invalid manager", null);
        });
      },
      // take a look at it
      function(m, callback) {
        // essentially if this user does not appear in m.users he is not allowed
        if (m.users.indexOf(req.session.user.id) == -1)
          callback(Errors.unauthorized(), null);
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
      r.save().then(function(record) {
        if (record)
          res.send(record);
        else
          res.send(Errors.saveError());
      });
    });
  }, // end new method

  addTags: function(req, res) {
    // add one or more tags to a record. tags should come in as a list of t_ids
    // because we already retrieved and created tags as needed while user defined
    // them on the front end
    // first though, does the specified record live in a manager this user is on
    if (!Wregx.isHexstr(req.body.record))
      return res.send(Errors.invalidId());
    // let's check the ID
    Record.getById(req.body.record, '').then(function(record) {
      return new Promise(function(resolve, reject) {
        // tags already in the DB should be clean, let's just verify they are indeed that
        for (var i = 0; i < req.body.tags.length; i++) {
          (function (t_id, i) { // ignore lint error, what am I gonna do, name it and break it out? psh
            // skip a bad id
            if (!Wregx.isHexstr(t_id))
              return;
            // otherwise run the check
            Tag.getById(t_id).then(function(tag) {
              // seems like the tag exists, add it to the record
              record.tags.push(tag);
              if (i == req.body.tags.length -1)
                resolve(record);
            }, function(e) {
              // failed
              console.log(e);
              return;
            });
          })(req.body.tags[i], i);
        } // end tag iteration
      }); // end promise
    }, function(e) {
      // rebbradcted
      res.send(e);
    }).then(function(record) {
      // final record after the shit
      // save it
      record.save().then(function(r) {
        if (r)
          res.send(r);
        else
          res.send(Errors.saveError());
      });
    });
  } // end addTag method

}; // end RecordCtrl

module.exports = RecordCtrl;




