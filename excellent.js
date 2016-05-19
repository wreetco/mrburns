// excellent.js

// app includes
var express = require("express");
var app = express();
var methodOverride = require("method-override");
var fs = require('fs');
var Wlog = require('./lib/wlog.js');

// app information
var app_info = {
	name: "mrburns",
	version: "0"
};

// database setup
var database = "mrburns_v1";
var pwd = process.env.MRBURNSDB;
var db = require("./config/db")(database, pwd);

// set the port to listen on
var port = 1337;

// routes
require("./routes")(app); // include route handlers

// start our app at http://localhost:4321
app.listen(port);

// let them know where to find the app
console.log(app_info.name + " " + app_info.version);
console.log("[+] App can be found at localhost:" + port + "...");
// include a quote
var quotes = JSON.parse(fs.readFileSync('./quotes.json', 'utf8'));
setTimeout(function() {
	var q = quotes[Math.floor(Math.random()*quotes.length)];
	console.log(q.quote);
}, 500);


// expose app
exports = module.exports = app;
