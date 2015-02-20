var cApp = require('./simulation/counterApp.js')

exports.counterAppRoute = function(req, res) {
	res.render('counterApp', {
		localCount : "just testing hogan",
		globalCount : "hi from david"
	});
};

exports.incrementRoute = function(req, res) {
	cApp.increment(req.body.token);
	res.end();
}

exports.decrementRoute = function(req, res) {
	cApp.increment(req.body.token);
	res.end();
}