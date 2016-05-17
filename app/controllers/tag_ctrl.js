var Tag = require("./../models/tag.js");

var TagCtrl = {
  demo: function() {
    var t = Tag({
			name: "hello tag",
			predef: false
    });
    return t;
  }
};

exports.TagCtrl = TagCtrl;
