var mongoose = require("mongoose");

var reminder_schema = mongoose.Schema({
  created_date: {type: Date, default: Date.now},
  event_time: Date,
  target: String,
  pcollection: String
});

reminder_schema.methods.demo = function() {
  console.log(this);
}

var Reminder = mongoose.model('Reminder', reminder_schema);


// send it out there
module.exports = Reminder;
