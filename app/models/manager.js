var Wregx = require("../../lib/wregx");
var Errors = require("../../lib/errors");
var Wlog = require("../../lib/wlog");

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
  custom_fields: [Field.schema]
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
      fields.push(m.fields[j]);
    // end inner field iteration
  } // end module iteration
  // there is also the matter of custom fields
  for (i = 0; i < this.custom_fields.length; i++)
    fields.push(this.custom_fields[i]);
  // good to go
  return fields;
};

manager_schema.methods.new = function(m, user) {
  // User.findById('573e589432178b732c4b9a0d').then(function(user){u = user})
  // new Manager().new({organization:"wreetco",account:"573f7c8c8f8894643e3ad8b0"},u).then(function(r){m = r}).catch(function(err){e = err})
  return new Promise(function(resolve, reject) {
    // make sure the organization is good
    if (!Wregx.isSafeName(m.organization)) {
      Wlog.log("rejected unsafe organization name: " + m.organization, "security");
      return reject(Errors.notSafe());
    }
    // and that the account id exists and belongs to them
    if (!Wregx.isHexstr(m.account))
      return reject(Errors.invalidId());
    // adding a manager is serious shit, is this user allowed to? let's find out
    Account.findById(m.account).then(function(a) {
      if (!a)
       return reject('invalid_account');
      // so let's see about this user
      if (a.users.indexOf(user.id) == -1) { // user in acc users arr?
        Wlog.log(user.email + " tried to violate AC on account " + a.id, "security");
        return reject(Errors.unauthorized());
      }
      // looks like they are allowed to add to this account, set the ref
      m.account = a;
      return m;
    }).then(function(m) {
      // does account exist already?
      Manager.find({organization:m.organization}).then(function(res) {
        if (res.length !== 0) {
          resolve(res);
          return false;
        }
        // otherwise pass to save
        return m;
      }).then(function(m) {
        if (!m)
          return;
        // save it
        new Manager(m).save().then(function(manager) {
          if (manager)
            resolve(manager);
          else
            reject(Errors.saveError());
        }).catch(function(e) {
          reject(e);
        });
      });
    }); // end account lookup
  }); // end promise
}; // end new method

manager_schema.methods.addField = function(field) {
  var manager = this;
  // verify the data, add the field
  return new Promise(function(resolve, reject) {
    if (!Wregx.isSafeLabel(field.tab)) {
      Wlog.log("rejected unsafe field tab name: " + field.tab, "security");
      return reject(Errors.notSafe());
    }
    if (!Wregx.isSafeLabel(field.section)) {
      Wlog.log("rejected unsafe field section name: " + field.section, "security");
      return reject(Errors.notSafe());
    }
    if (!Wregx.isSafeLabel(field.name)) {
      Wlog.log("rejected unsafe field label name: " + field.name, "security");
      return reject(Errors.notSafe());
    }
    if (!Wregx.isSafeName(field.db_name)) {
      Wlog.log("rejected unsafe field db name: " + field.db_name, "security");
      return reject(Errors.notSafe());
    }
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
  populate = populate || "";
  return new Promise(function(resolve, reject) {
    // first make sure it is not evil
    if (!Wregx.isHexstr(m_id))
      return reject(Errors.notSafe());
    // it's probably coo
    Manager.findById(m_id).populate(populate).then(function(manager) {
      if (manager)
        resolve(manager);
      else
        throw Errors.noMatch();
    }).catch(function(e) {
      reject(e);
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
