var q = require("q");
var Wregx = require("../../lib/wregx");
var mongoose = require("mongoose");

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

manager_schema.methods.getById = function(mid) {
  // grab a manager by id for malevolent use
  var d = q.defer();
  // first make sure it is not evil
  if (!Wregx.isHexstr(mid))
    d.resolve(false);
  // it's probably coo
  Manager.findById(mid, function(e, manager) {
    if (manager)
      d.resolve(manager);
    else
      d.resolve(false);
  });
  return d.promise;
};

var Manager = mongoose.model('Manager', manager_schema);


// send it out there
module.exports = Manager;
