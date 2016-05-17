var Account = require("./../models/account.js");

var AccountCtrl = {
  demo: function() {
    var a = Account({
      email: "montgomery@wreet.co",
      password: "hashashhash",
      billing: "crypcrypcyrp",
      managers: [{instance_of: "manager"}]
    });
    return a;
  }
};

exports.AccountCtrl = AccountCtrl;
