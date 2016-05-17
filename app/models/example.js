var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var exampleSchema = mongoose.Schema({
	name:String,
	age:Number,
});

exampleSchema.methods.exampleMethod = function() {
	console.log('ExampleModel.name: ' + this.name);
}; // end example method

var ExampleModel = mongoose.model('ExampleModel', exampleSchema);

// make this available to our users in our Node applications
module.exports = ExampleModel;
