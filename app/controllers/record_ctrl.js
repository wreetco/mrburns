var Wregx = require("./../../lib/wregx");

var Record = require("./../models/record");

var RecordCtrl = {
  demo: function() {
    var c = "sdfds";
    return c;
  },

  new: function(req, res) {
    /*
      post a new record to the db
    */
    res.send(req.body.key);

    // we will want to verify each field the user requested is allowed and safe
    // first collect the manager ID the record will belong to, make sure it is
    // safe and that the user attached to this token has permission to work there

    // if the data looks good let's put it on a record
    // get a new record

    // assign the record's fields to our user JSON

    // save the object and resolve the promise
  } // end new method
};

module.exports = RecordCtrl;
