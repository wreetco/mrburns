// excellent.js
var app_info = {
	name: "MEAN Wreed",
	version: "0.3.0"
};

// app includes
var express = require("express");
var app = express();
var methodOverride = require("method-override");
var fs = require('fs');

// database setup
var database = "test";
var db = require("./config/db")(database);

// set the port to listen on
var port = 8787;

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + "/public")); 

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
