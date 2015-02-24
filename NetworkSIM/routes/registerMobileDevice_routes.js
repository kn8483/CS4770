var registerMobileDevice = require('../simulation/registerMobileDevice');
var mongojs = require('mongojs');
var db = mongojs('simdb', ['administrators', 'devices', 'networks']);

exports.distributeTokenRoute = function(req, res) {
	registerMobileDevice.distributeToken(req.body.emailAddress);
	res.status(200);
	res.end();
};

exports.registerWithTokenRoute = function(req, res) {
	console.log('inside registerWithToken route');
	console.log('req.body is: ');
	console.log(req.body); 
	var success = registerMobileDevice.registerWithToken(req.body.token);
	if (success) {
		res.status(200);
		res.end();
	} else {
		res.status(400);
		res.end();
	}
};

exports.validateTokenRoute = function(req, res) {
	var valid = registerMobileDevice.validateToken(req.body.token);
	if (valid) {
		res.status(200);
		res.end();
	} else {
		res.status(400);
		res.end();
	}
}

exports.adminLoginRoute = function(req, res) {
	console.log("inside adminLoginRoute ");
	console.log('req.body is: ');
	console.log(req.body);
	db.administrators.findOne({
		username : req.body.username,
		password : req.body.password
	}, function (err, doc){
		if (err) {
			console.log(err);
			res.status(400);
			res.end();			
		}
		
		else {
			console.log("Found the following matching object in the db"); 
			console.log(doc);
			res.status(200);
			res.end();
		}
	}); 
}
