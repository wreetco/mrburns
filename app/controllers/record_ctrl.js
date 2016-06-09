var async = require("async");

var Wregx = require("./../../lib/wregx");
var Wlog = require("./../../lib/wlog");
var Errors = require("./../../lib/errors");

var Record = require("./../models/record");
var Manager = require("./../models/manager");
var Tag = require("./../models/tag");

var RecordCtrl = {
  demo: function() {
    var c = "sdfds";
    return c;
  },

  new: function(req, res, next) {
    /*
      post a new record to the db
    */
    // we will want to verify each field the user requested is allowed and safe
    // easy first thing to check, is the provided manager id good
    var manager;
    if (!Wregx.isHexstr(req.body.manager))
      return next(Errors.invalidId());
    async.waterfall([
      // first collect the manager ID the record will belong to, make sure it is
      // safe and that the user attached to this token has permission to work there
      function(callback) {
        Manager.getById(req.body.manager, 'modules').then(function(m) {
          if (m)
            callback(null, m);
          else
            callback(Errors.invalidId(), null);
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
        for (k in in_r) {
          // check each key, must exists and have valid data
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].db_name == k) {
              // we found it, verify type
              switch (fields[i].type) {
                case "string":
                  // customer string
                  if (!Wregx.allowedStr(in_r[k]))
                    callback(Errors.notSafe(), null);
                  break;
                case "int":
                  // customer int
                  if (!Wregx.isNum(in_r[k]))
                    callback(Errors.notSafe(), null);
                  break;
                case "date":
                  // customer date
                  if (!Wregx.isDate(in_r[k]))
                    callback(Errors.notSafe(), null);
                  break;
                case "email":
                  // customer date
                  if (!Wregx.isEmail(in_r[k]))
                    callback(Errors.notSafe(), null);
                  break;
                default:
                  // fields require (valid) types, so we have a fucking problem
                  callback(Errors.notSafe(), null);
              }
              // if we're through with all that the field must match its type
              r[k] = in_r[k];
              // next key
              break;
            }
          } // end field lookup loop
        } // end in_r key it
        // if we're about done here...
        manager = m;
        callback(null, r);
      }
    ], function(e, r) {
      // end of the line
      if (e) // kill us off if we had an error somewhere
        return next(e);
      // basically we're cool here. pass the r to the flexfield and save it
      r = Record({x: r});
      r.manager = manager._id;
      manager.records.push(r);
      manager.save();
      r.save().then(function(record) {
        if (record)
          res.send(record);
        else
          next(Errors.saveError());
      });
    });
  }, // end new method

  addTags: function(req, res, next) {
    // add one or more tags to a record. tags should come in as a list of t_ids
    // because we already retrieved and created tags as needed while user defined
    // them on the front end
    // first though, does the specified record live in a manager this user is on
    if (!Wregx.isHexstr(req.body.record))
      return next(Errors.invalidId());
    // let's check the ID
    Record.getById(req.body.record, '').then(function(record) {
      return new Promise(function(resolve, reject) {
        // tags already in the DB should be clean, let's just verify they are indeed that
        for (var i = 0; i < req.body.tags.length; i++) {
          (function (t_id, i) { // ignore lint error, what am I gonna do, name it and break it out? psh
            // skip a bad id
            if (!Wregx.isHexstr(t_id))
              throw Errors.invalidId();
            // otherwise run the check
            Tag.getById(t_id).then(function(tag) {
              // seems like the tag exists, add it to the record
              record.tags.push(tag);
              if (i == req.body.tags.length -1)
                resolve(record);
            }).catch(function(e) {
              // failed
              throw e;
            });
          })(req.body.tags[i], i);
        } // end tag iteration
      }); // end promise
    }).catch(function(e) {
      // rebbradcted
      Wlog.log(e, "error");
      return next(Errors.saveError());
    }).then(function(record) {
      // final record after the shit
      // save it
      record.save().then(function(r) {
        if (r)
          res.send(r);
        else
          next(Errors.saveError());
      });
    });
  } // end addTag method

}; // end RecordCtrl

module.exports = RecordCtrl;




