var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var record_schema = mongoose.Schema({
  x: Schema.Types.Mixed, // flexfield all in their face
  manager: {type: Schema.ObjectId, ref: 'Manager'},
  tags: [{type: Schema.ObjectId, ref: 'Tag'}]
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

record_schema.methods.demo = function() {
  console.log(this);
};

var Record = mongoose.model('Record', record_schema);


// export it
module.exports = Record;
