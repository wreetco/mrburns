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


var t = new Contact({
  first_name: "Jean",
  last_name: "Cron",
  phone_num: "3034441234",
  email: "jean@crean.co.fr",
  manager: {man: "instance"},
  tags: ['tag_id_1', 'tag_id_2']
});

t.demo();

// export it
module.exports = {
  Contact: Contact
}
