var mongoose = require("mongoose");

module.exports = function(db, pwd) {
	mongoose.connect('mongodb://mrburns:'+pwd+'@db.ioblog.xyz/' + db, {}, function(err) {
		if (err)	{
			console.log("[!] Database error: " + err);	
		}
		else {
			console.log('[+] Connected to database: ' + db);	
		}
	});
};


