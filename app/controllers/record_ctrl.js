var async = require("async");

var Wregx = require("./../../lib/wregx");
var Wlog = require("./../../lib/wlog");
var Errors = require("./../../lib/errors");

var Record = require("./../models/record");
var Tag = require("./../models/tag");

var RecordCtrl = {
  demo: function() {
    var c = "sdfds";
    return c;
  },

  new: function(req, res, next) {
    /*
      * post a new record to the db
    */
    // we will want to verify each field the user requested is allowed and safe
    // easy first thing to check, is the provided manager id good
    if (!Wregx.isHexstr(req.body.manager))
      return next(Errors.invalidId());
    Record.new(req.body.record, req.body.manager, req.session.user).then(function(r) {
      res.send(r);
    }).catch(function(err) {
      // errmergerd
      next(err);
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
  }, // end addTag method

  removeRecord: function(req, res, next) {
    // delete a record from the db
    Record.delete(req.params.r_id, req.params.m_id, req.session.user).then(function(r) {
      if (r)
        res.send({deleted: true});
      else
        throw Errors.saveError();
    }).catch(function(err) {
      next(err);
    });
  } // end removeRecord

}; // end RecordCtrl

module.exports = RecordCtrl;




