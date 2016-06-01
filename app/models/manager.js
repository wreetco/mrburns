var async = require("async");

var q = require("q");
var Wregx = require("../../lib/wregx");
var mongoose = require("mongoose");

var Module = require("./module");
var Account = require("./account");
var Field = require("./field");

var Schema = mongoose.Schema;

var manager_schema = mongoose.Schema({
  organization: String,
  account: {type: Schema.ObjectId, ref: 'Account'},
  modules: [{type: Schema.ObjectId, ref: 'Module'}],
  records: [{type: Schema.ObjectId, ref: 'Record'}],
  users: [{type: Schema.ObjectId, ref: 'User'}],
  custom_fields: [],
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

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
  // there is also the matter of custom fields
  for (i = 0; i < this.custom_fields.length; i++)
    fields.push(this.custom_fields[i].db_name);
  // good to go
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
        reject('invalid_account');
      // so let's see about this user
      if (a.users.indexOf(user.id) == -1) // user in acc users arr?
        reject('not_authd');
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

manager_schema.methods.addField = function(field) {
  var manager = this;
  // verify the data, add the field
  return new Promise(function(resolve, reject) {
    if (!Wregx.isSafeLabel(field.tab))
      reject(Errors.notSafe());
    if (!Wregx.isSafeLabel(field.section))
      reject(Errors.notSafe());
    if (!Wregx.isSafeLabel(field.name))
      reject(Errors.notSafe());
    if (!Wregx.isSafeName(field.db_name))
      reject(Errors.notSafe());
    // aight
    manager.custom_fields.push(new Field(field));
    manager.save().then(function(r) {
      if (r)
        resolve(r);
      else
        reject("save err");
    });
  }); // end promise
};

// statics

manager_schema.statics.getById = function(m_id, populate) {
  // grab a manager by id for malevolent use
  return new Promise(function(resolve, reject) {
    // first make sure it is not evil
    if (!Wregx.isHexstr(m_id))
      resolve(false);
    if (!Wregx.isAlpha(populate))
      populate = "";
    // it's probably coo
    Manager.findById(m_id).populate(populate).exec(function(e, manager) {
      if (manager)
        resolve(manager);
      else
        resolve(false);
    });
  }); // end promise
};

manager_schema.statics.buildInterface = function(m) {
  // Manager.findOne({}).populate('modules').then(function(r){Manager.buildInterface(r).then(function(inf){i = inf})})
  // build the interface for the manager
  return new Promise(function(resolve, reject) {
    var interface = {
      organization: m.organization,
      tabs: []
    };
    this.addField = function(field) {
      // find the right tab
      for (var i = 0; i < interface.tabs.length; i++) {
        if (interface.tabs[i].name == field.tab) {
          // we have found the right tab, now the section
          for (var j = 0; j < interface.tabs[i].sections.length; j++) {
            if (interface.tabs[i].sections[j].name == field.section) {
              // this is the right section
              interface.tabs[i].sections[j].fields.push(field);
              return 1;
            }
          }  // end j
          // if we get out here we have a new section to make
          interface.tabs[i].sections.push({
            name: field.section
          });
          return 1;
        }
      } // end i
      // we have a tab to add
      interface.tabs.push({
        name: field.tab,
        sections: [{
          name: field.section,
          fields: [field]
        }]
      });
      return 1;
    }; // end addField helper

    // we need to add the fields from all sources
    for (var i = 0; i < m.custom_fields.length; i++)
      this.addField(m.custom_fields[i]);
    // and for the modules, slightly more complex
    for (var i = 0; i < m.modules.length; i++) {
      var mod = m.modules[i];
      for (var j = 0; j < mod.fields.length; j++)
        this.addField(mod.fields[j]);
    }
    // turn the resolve brad
    resolve(interface);
  }); // end promise
}; // end builditnerface method


var Manager = mongoose.model('Manager', manager_schema);


// send it out there
module.exports = Manager;
