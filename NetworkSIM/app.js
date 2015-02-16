
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
var expressMail = require('express-mail'); // added to distribute token by e-mail
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
	  from: 'no-reply@example.com',
	  host: 'smtp.gmail.com', // hostname
	  secureConnection: true, // use SSL
	  port: 465, // port for secure SMTP
	  transportMethod: 'SMTP', // default is SMTP. Accepts anything that
								// nodemailer accepts
	  auth: {
	    user: 'gmail.user@gmail.com',
	    pass: 'userpass'
	  }
	});



app.get('/', routes.index);
app.get('/users', user.list);

// Move callbacks to routes
app.post('/addNetworkToSimulation', function (req, res) {
	admin.addNetwork(req.body.networkName, req.body.networkKind);
	res.status(200);
	res.end(); 
});
app.post('/removeNetworkFromSimulation', function (req, res) {
	admin.removeNetwork(req.body.networkName); 
	res.status(200);
	res.end(); 
});
app.post('/addDeviceToSimulation', function (req, res) {
	admin.addDevice(req.body.deviceName);
	res.status(200);
	res.end(); 
});
app.post('/removeDeviceFromSimulation', function (req, res) {
	admin.removeDevice(req.body.deviceName); 
	res.status(200);
	res.end(); 
});
app.post('/addDeviceToNetwork', function (req, res) {
	admin.addDeviceToNetwork(req.body.network, req.body.device); 
	res.status(200);
	res.end(); 
});
// etc. for removeFrom, connecting two networks, etc. Add after testing.

app.post('/distributeToken', function(req, res) {
	registerMobileDevice.distributeToken(req.body.emailAddress); 
	res.status(200);
	res.end(); 	
});

app.post('/submitToken', function(req, res) {
	var success = registerMobileDevice.registerWithToken(req.body.token); 
	if (success) {
		res.status(200); 
		res.end(); 
	}
	else {
		res.status(400);
		res.end(); 
	}
}); 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
//