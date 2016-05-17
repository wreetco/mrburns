var mongoose = require("mongoose");

module.exports = function(db) {
	mongoose.connect('mongodb://localhost/' + db, {}, function(err) {
		if (err)	{
			console.log("[!] Database error: " + err);	
		}
		else {
			console.log('[+] Connected to database: ' + db);	
		}
	});
};