var Errors = require("./../../lib/errors");

var Tag = require("./../models/tag.js");

var TagCtrl = {
  demo: function() {
    var t = Tag({
			name: "hello tag",
			predef: false
    });
    return t;
  },

  new: function(req, res) {
    // add a new tag to the db
    new Tag().new(req.body.tag).then(function(r) {
      // see what's good
      if (!r)
        res.send(Errors.notSafe());
      res.send(r);
    });
  } // end new method
};

module.exports = TagCtrl;
