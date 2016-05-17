var mongoose = require("mongoose");

var contact_schema = mongoose.Schema({
  first_name: String,
  last_name: String,
  phone_num: String,
  email: String,
  manager: {},
  tags: []
});

contact_schema.methods.demo = function() {
  console.log(this);
}

var Contact = mongoose.model('Contact', contact_schema);


// export it
module.exports = Contact;
