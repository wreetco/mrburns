var fs = require("fs");

var Wlog = {
  log_file: "./log/wlog",

  log: function(message, level) {
    level = level || "";
    try {
      var log_message;
      switch(level) {
        case "warning":
          log_message = "[-] warning: " + message;
          break;
        case "error":
          log_message = "[!] error: " + message;
          break;
				case "security":
					log_message = "[*] security: " + message;
					break;
        default:
          log_message = "[i] info: " + message;
      }
      log_message = log_message + " " + Date().split(" ").slice(0,5).join(" ") + "\n";
      fs.appendFile(this.log_file, log_message, function(err) {
        if (err) throw err;
        // otherwise...
      });
    } catch(e) {
      console.log(e);
    }
  } // end log method
};

module.exports = Wlog;
