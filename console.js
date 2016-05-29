var repl = require("repl");

var mongoose = require("mongoose");
var AppCtrl = require("./app/controllers/application_ctrl");
var AccountCtrl = require("./app/controllers/account_ctrl.js").AccountCtrl;
var TagCtrl = require("./app/controllers/tag_ctrl");
var RecordCtrl = require("./app/controllers/record_ctrl");
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
	// libs
	replServer.context.Wregx = require("./lib/wregx");
	// controllers
	replServer.context.AppCtrl = AppCtrl;
	replServer.context.AccountCtrl = AccountCtrl;
	replServer.context.TagCtrl = TagCtrl;
	replServer.context.RecordCtrl = RecordCtrl;
	replServer.context.FieldCtrl = FieldCtrl;
	replServer.context.UserCtrl = UserCtrl;
	replServer.context.ReminderCtrl = ReminderCtrl;
	replServer.context.SessionCtrl = SessionCtrl;
	replServer.context.ManagerCtrl = require("./app/controllers/manager_ctrl.js");
	// modesl for direct use, won't be provided by controller
	replServer.context.Module = require("./app/models/module");
	replServer.context.Account = require("./app/models/account");
	replServer.context.Manager = require("./app/models/manager");
	replServer.context.Record = require("./app/models/record");
	replServer.context.Field = require("./app/models/field");
	replServer.context.Tag = require("./app/models/tag");
	replServer.context.User = require("./app/models/user");	
	replServer.context.Session = require("./app/models/session");
	replServer.context.Role = require("./app/models/role");
});
