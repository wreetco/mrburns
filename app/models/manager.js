var q = require("q");
var Wregx = require("../../lib/wregx");
var mongoose = require("mongoose");

var Module = require("./module");

var Schema = mongoose.Schema;

var manager_schema = mongoose.Schema({
  organization: String,
  account: {type: Schema.ObjectId, ref: 'Account'},
  modules: [{type: Schema.ObjectId, ref: 'Module'}],
  records: [{type: Schema.ObjectId, ref: 'Record'}],
  users: [{type: Schema.ObjectId, ref: 'User'}],
  custom_fields: [{type: Schema.ObjectId, ref: 'Field'}],
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

manager_schema.methods.getById = function(mid, populate) {
  // grab a manager by id for malevolent use
  var d = q.defer();
  // first make sure it is not evil
  if (!Wregx.isHexstr(mid))
    d.resolve(false);
  if (!Wregx.isAlpha(populate))
    populate = "";
  // it's probably coo
  Manager.findById(mid).populate(populate).exec(function(e, manager) {
    if (manager)
      d.resolve(manager);
    else
      d.resolve(false);
  });

  return d.promise;
};

manager_schema.methods.fields = function() {
  // probably pretty expensive, otherwise I would make a isValidField or something
  // generate the json object representation of this beast
  // we'll need to ask every module what it has provided as a Record key
  var fields = [];
  for (var i = 0; i < this.modules.length; i++) {
    var m = this.modules[i];
    for (var j = 0; j < m.fields.length; j++)
      fields.push(m.fields[j].db_name);
    // end inner field iteration
  } // end module iteration
  return fields;
};

var Manager = mongoose.model('Manager', manager_schema);


// send it out there
module.exports = Manager;
