var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var contact_schema = mongoose.Schema({
  organization: String,
  first_name: String,
  last_name: String,
  phone_num: String,
  email: String,
  manager: {type: Schema.ObjectId, ref: 'Manager'},
  tags: [{type: Schema.ObjectId, ref: 'Tag'}]
}, {
  timestamps: {
    createdAt: "created_date",
    updatedAt: "updated_at"
  }
});

contact_schema.methods.demo = function() {
  console.log(this);
}

var Contact = mongoose.model('Contact', contact_schema);


// export it
module.exports = Contact;
