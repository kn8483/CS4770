/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var admin = require('./simulation/admin');
var registerMobileDevice = require('./simulation/registerMobileDevice'); // added
// for
// token
// distribution
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// var favicon = require('favicon');
var morgan = require('morgan');// formerly logger
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
var mongo = require("mongojs");
var expressMail = require('express-mail'); // added to distribute token by
// e-mail
// in registerMobileDevice

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// app.set('simulation', path.join(__dirname, 'simulation'));
app.set('view engine', 'hjs');
// app.use(favicon());
app.use(morgan("dev")); // (formerly known as 'logger')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}
// Copied and pasted from express-mailer example
// Might need to adjust
expressMail.extend(app, {
	from : 'no-reply@example.com',
	host : 'smtp.gmail.com', // hostname
	secureConnection : true, // use SSL
	port : 465, // port for secure SMTP
	transportMethod : 'SMTP', // default is SMTP. Accepts anything that
	// nodemailer accepts
	auth : {
		user : 'gmail.user@gmail.com',
		pass : 'userpass'
	}
});

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/importRDT', function(req, res) {
	admin.importRDT(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/removeRDT', function(req, res) {
	admin.removeRDT(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/importApp', function(req, res) {
	admin.importApp(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/removeApp', function(req, res) {
	admin.removeApp(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/addNetwork', function(req, res) {
	admin.addNetwork(req.body.networkName, req.body.networkKind);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/removeNetwork', function(req, res) {
	admin.removeNetwork(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});
app.post('/addDevice', function(req, res) {
	admin.addDevice(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});
app.post('/removeDevice', function(req, res) {
	admin.removeDevice(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});
app.post('/addDeviceToNetwork', function(req, res) {
	admin.addDeviceToNetwork(req.body.networkName, req.body.deviceName);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/removeDeviceFromNetwork', function(req, res) {
	admin.removeDeviceFromNetwork(req.body.networkName, req.body.deviceName);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/connectTwoNetworks', function(req, res) {
	admin.connectTwoNetworks(req.body.network1Name, req.body.network1Name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/disconnectTwoNetworks', function(req, res) {
	admin.disconnectTwoNetworks(req.body.network1Name, req.body.network1Name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/removeDeviceFromCurrentNetwork', function(req, res) {
	admin.removeDeviceFromCurrentNetwork(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/returnDeviceToPreviousNetwork', function(req, res) {
	admin.returnDeviceToPreviousNetwork(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
});

app.post('/distributeToken', function(req, res) {
	registerMobileDevice.distributeToken(req.body.emailAddress);
	res.status(200);
	res.end();
});

app.post('/registerWithToken', function(req, res) {
	var success = registerMobileDevice.registerWithToken(req.body.token);
	if (success) {
		res.status(200);
		res.end();
	} else {
		res.status(400);
		res.end();
	}
});

app.post('/validateToken', function(req, res) {
	var valid = registerMobileDevice.validateToken(req.body.token);
	if (success) {
		res.status(200);
		res.end();
	} else {
		res.status(400);
		res.end();
	}
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
//