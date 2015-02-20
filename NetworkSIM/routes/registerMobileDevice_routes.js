var registerMobileDevice = require('./simulation/registerMobileDevice');

exports.distributeTokenRoute = function(req, res) {
	registerMobileDevice.distributeToken(req.body.emailAddress);
	res.status(200);
	res.end();
};

exports.registerWithTokenRoute = function(req, res) {
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
	var valid = registerMobileDevice.adminLogin(req.body.username,
			req.body.password);
	if (valid) {
		res.status(200);
		res.end();
	} else {
		res.status(400);
		res.end();
	}
}
