var async = require("async");

var q = require("q");
var Wregx = require("../../lib/wregx");
var mongoose = require("mongoose");

var Module = require("./module");
var Account = require("./account");

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

manager_schema.methods.getById = function(m_id, populate) {
  // grab a manager by id for malevolent use
  var d = q.defer();
  // first make sure it is not evil
  if (!Wregx.isHexstr(m_id))
    d.resolve(false);
  if (!Wregx.isAlpha(populate))
    populate = "";
  // it's probably coo
  Manager.findById(m_id).populate(populate).exec(function(e, manager) {
    if (manager)
      d.resolve(manager);
    else
      d.resolve(false);
  });
  d.resolve('dfdssf');
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

manager_schema.methods.new = function(m, user) {
  return new Promise(function(resolve, reject) {
    // make sure the organization is good
    if (!Wregx.isSafeName(m.organization))
      reject('bad_name');
    // and that the account id exists and belongs to them
    if (!Wregx.isHexstr(m.account))
      reject('bad_id');
    // adding a manager is serious shit, is this user allowed to? let's find out
    Account.findById(m.account).then(function(a) {
      console.log('account find cb');
      if (!a)
        return callback('invalid_account', null);
      // so let's see about this user
      if (a.users.indexOf(user) == -1) // user in acc users arr?
        return callback('not_authd', null);
      // looks like they are allowed to add to this account, so do it
      m.account = a;
      new Manager(m).save().then(function(manager) {
        if (manager)
          resolve(manager);
        else
          reject('not_saved');
      });
    }); // end account lookup
  }); // end promise
}; // end new method


var Manager = mongoose.model('Manager', manager_schema);


// send it out there
module.exports = Manager;
