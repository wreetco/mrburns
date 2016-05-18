var fs = require("fs");

var Wlog = {
  log_file: "./log/wlog",

  log: function(message, level) {
    try {
      var log_message;
      switch(level) {
        case "warning":
          log_message = "[-] warning: " + message + "\n";
          break;
        case "error":
          log_message = "[!] error: " + message + "\n";
          break;
        default:
          log_message = "[i] info: " + message + "\n";
      }
      fs.appendFile(this.log_file, log_message, function(err) {
        if (err) throw err;
        // otherwise...
      });
    } catch(e) {
      console.log(e);
    }
  } // end log method
};

exports.Wlog = Wlog;
