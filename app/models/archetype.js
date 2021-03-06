var mongoose = require("mongoose");

var Errors = require("./../../lib/errors");
var Wregx = require("./../../lib/wregx");

var Schema = mongoose.Schema;

var archetype_schema = mongoose.Schema({
  name: {type: String, required: true},
  oddities: {type: {}, default: {}}
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

// statics

var Archetype = mongoose.model('Archetype', archetype_schema);


// export it
module.exports = Archetype;
