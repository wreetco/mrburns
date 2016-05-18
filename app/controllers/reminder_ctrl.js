var Reminder = require("./../models/reminder.js");

var ReminderCtrl = {
  demo: function() {
    var r = Reminder({
      event_time: Date.now() + 100000000,
      target: "some target",
      pollection: "some_collection"
    });
    return r;
  }
};

exports.ReminderCtrl = ReminderCtrl;
