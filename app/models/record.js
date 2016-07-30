var mongoose = require("mongoose");

var Errors = require("./../../lib/errors");
var Wregx = require("./../../lib/wregx");
var Tag = require("./tag");
var Manager = require("./manager");

var Schema = mongoose.Schema;

var record_schema = mongoose.Schema({
  x: Schema.Types.Mixed, // flexfield all in their face
  archetype: {type: Schema.ObjectId, ref: 'Archetype'},
  manager: {type: Schema.ObjectId, required: true, ref: 'Manager'},
  tags: [{type: Schema.ObjectId, ref: 'Tag', unique: true}]
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

// statics

record_schema.statics.getById = function(r_id, populate) {
  // grab a record by id for malevolent use
  populate = populate || "";
  return new Promise(function(resolve, reject) {
    // first make sure it is not evil
    if (!Wregx.isHexstr(r_id))
      reject(Errors.invalidId());
    // it's probably coo
    Record.findById(r_id).populate(populate).then(function(record) {
      if (record)
        resolve(record);
      else
        reject(Errors.invalidId());
    });
  }); // end promise
};

// new record
record_schema.statics.new = function(record_in, m_id, user) {
  return new Promise(function(resolve, reject) {
    // first let's get this manager and check if this user can post there
    var m;
    Manager.getById(m_id, 'modules').then(function(manager) {
      if (manager)
        return manager;
      else
        throw Errors.invalidId();
    }).then(function(manager) {
      // essentially if this user does not appear in m.users he is not allowed
      if (manager.users.indexOf(user.id) == -1)
        throw Errors.unauthorized();
      else // we good
        return manager;
    }).then(function(manager) {
      // list of in keys to skip
      var skip = ["tags", "id"];
      // let's try and build the final record croduct
      var r = {};
      // get a list of approved fields for this record
      var fields = manager.fields();
      // iterating only what the user gives us gives us a chance to save on passes
      for (var k in record_in) {
        if (skip.indexOf(k) !== -1)
          continue;
        // check each key, must exists and have valid data
        for (var i = 0; i < fields.length; i++) {
          (function(field, key) {
          if (field.db_name == key) {
            // we found it, verify type
            switch (field.type) {
              case "string":
                // customer string
                if (!Wregx.allowedStr(record_in[key]))
                  throw Errors.notSafe();
                break;
              case "int":
                // customer int
                if (!Wregx.isNum(record_in[key]))
                  throw Errors.notSafe();
                break;
              case "date":
                // customer date
                if (!Wregx.isDate(record_in[key]))
                  throw Errors.notSafe();
                break;
              case "email":
                // customer date
                if (!Wregx.isEmail(record_in[key]))
                  throw Errors.notSafe();
                break;
              default:
                // fields require (valid) types, so we have a fucking problem
                throw Errors.notSafe();
            }
            // if we're through with all that the field must match its type
            r[key] = record_in[key];
            record_in[key] = "matched";
            // next key
            return;
          }
          })(fields[i], k);
        } // end field lookup loop
      } // end record_in key it
      // check real quick we matched the fields
      for (var k in record_in) {
        if (skip.indexOf(k) == -1 && record_in[k] != "matched")
          throw Errors.notSafe();
      }
      // if we're about done here...
      m = manager;
      return new Record({x: r}); // pass on a new record with flexfield set
    }).then(function(r) {
      return new Promise(function(res, rej) {
        // really the last thing to do is walk the tags, set the refs
        Tag.resolveTags(record_in.tags).then(function(tags) {
          r.tags = tags;
          res(r);
        }).catch(function(err) {
          rej(err);
        });
      });
    }).then(function(r) {
      console.log('record in');
      console.log(record_in);
      console.log('----');
      if (record_in.id && Wregx.isHexstr(record_in.id)) r._id = record_in.id;
      r.manager = m._id;
      if (m.records.indexOf(r._id) === -1) m.records.push(r);
      m.save();
      console.log('record');
      console.log(r);
      //r.save().then(function(record) {
      Record.update({_id: r.id}, r, {
        upsert: true,
        setDefaultsOnInsert: true
      }).then(function(record) {
        if (record)
          resolve(record);
        else
          throw Errors.saveError();
      });
    }).catch(function(err) {
      reject(err);
    }); // end 'the chain'
  }); // end promiseus
};

var Record = mongoose.model('Record', record_schema);


// export it
module.exports = Record;
