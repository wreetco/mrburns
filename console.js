var repl = require("repl");

var mongoose = require("mongoose");

var AccountCtrl = require("./app/controllers/account_ctrl.js").AccountCtrl;
var TagCtrl = require("./app/controllers/tag_ctrl.js").TagCtrl;
var ContactCtrl = require("./app/controllers/contact_ctrl.js").ContactCtrl;
var FieldCtrl = require("./app/controllers/field_ctrl.js").FieldCtrl;
var UserCtrl = require("./app/controllers/user_ctrl.js").UserCtrl;
var ReminderCtrl = require("./app/controllers/reminder_ctrl.js").ReminderCtrl;
var SessionCtrl = require("./app/controllers/session_ctrl.js");

var database = "mrburns_v1";
var pwd = process.env.MRBURNSDB;
mongoose.connect("mongodb://mrburns:"+pwd+"@db.ioblog.xyz/"+database+"?authdb=admin");
var db = mongoose.connection;
db.on('error', console.error.bind(console, '[!] connection error:'));
db.on('open', function() {
  console.log('[+] connected to remote db');
	replServer = repl.start({ 
		prompt: "mrburns> "
	});
	// controllers
	replServer.context.AccountCtrl = AccountCtrl;
	replServer.context.TagCtrl = TagCtrl;
	replServer.context.ContactCtrl = ContactCtrl;
	replServer.context.FieldCtrl = FieldCtrl;
	replServer.context.UserCtrl = UserCtrl;
	replServer.context.ReminderCtrl = ReminderCtrl;
	replServer.context.SessionCtrl = SessionCtrl;
	// modesl for direct use, won't be provided by controller
	replServer.context.User = require("./app/models/user.js");	
});
