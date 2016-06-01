var mongoose = require("mongoose");

var Errors = require("./../../lib/errors");
var Wregx = require("./../../lib/wregx");

var Schema = mongoose.Schema;

var record_schema = mongoose.Schema({
  x: Schema.Types.Mixed, // flexfield all in their face
  archetype: {type: Schema.ObjectId, ref: 'Archetype'},
  manager: {type: Schema.ObjectId, ref: 'Manager'},
  tags: [{type: Schema.ObjectId, ref: 'Tag'}]
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

// statics

record_schema.statics.getById = function(r_id, populate) {
  // grab a record by id for malevolent use
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

var Record = mongoose.model('Record', record_schema);


// export it
module.exports = Record;
