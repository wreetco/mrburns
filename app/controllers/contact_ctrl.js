var Contact = require("./../models/contact.js");

var ContactCtrl = {
  demo: function() {
    var c = Contact({
      first_name: "Jean",
      last_name: "Cron",
      phone_num: "3034441234",
      email: "jean@crean.co.fr",
      manager: {man: "instance"},
      tags: ['tag_id_1', 'tag_id_2']
    });
    return c;
  }
};

exports.ContactCtrl = ContactCtrl;
