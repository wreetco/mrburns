var Field = require("./../models/field.js");

var FieldCtrl = {
  demo: function() {
    var f = Field({
      section: "Details",
      name: "Custom Label",
      db_name: "custom_field",
      type: "alpha",
      visibility: "show",
      order: 2
    });
    return f;
  }
};

exports.FieldCtrl = FieldCtrl;
