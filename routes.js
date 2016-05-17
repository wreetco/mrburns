var examples = require('./app/controllers/example.js');

module.exports = function(app) {
// example model route
app.get('/example/show', function(req, res) {
	examples.show(req, res);
});

// routes to handle angular requests
app.get('/', function(req, res) {
	// index file and it's included angular app will be served
	res.sendfile('./public/index.html'); // load our public/index.html file
});

};
