var mongoose = require("mongoose");
var Example = require('./../models/example');

exports.show = function(req, res) {
	var e = Example({
		name: "Example Model", 
		age: 33
	});
	res.send(e);
};