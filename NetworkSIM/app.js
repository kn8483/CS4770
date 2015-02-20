// ------------------- MODULE DEPENDENCIES ---------------
var express = require('express');
var http = require('http');
var path = require('path');
// var favicon = require('favicon');
var morgan = require('morgan'); // formerly logger
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
var mongo = require("mongojs");
var expressMail = require('express-mail'); // NOT WORKING

// route modules
var indexroutes = require('./routes/index');
var userroutes = require('./routes/user');
var nsroutes = require('./routes/network_settings_routes');
var rmdroutes = require('./routes/registerMobileDevice_routes');

// ------------------- SET UP ------------------------------

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
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
// NOT WORKING
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

// -------------------- ROUTING ----------------------------

app.get('/', indexroutes.indexRoute);
app.get('/users', userroutes.list);

// network_settings
app.post('/importRDT', nsroutes.importRDTRoute);
app.post('/removeRDT', nsroutes.removeRDTRoute);
app.post('/importApp', nsroutes.importAppRoute);
app.post('/removeApp', nsroutes.removeAppRoute);
app.post('/addNetwork', nsroutes.addNetworkRoute);
app.post('/removeNetwork', nsroutes.removeNetworkRoute);
app.post('/addDevice', nsroutes.addDeviceRoute);
app.post('/removeDevice', nsroutes.removeDeviceRoute);
app.post('/addDeviceToNetwork', nsroutes.addDeviceToNetworkRoute);
app.post('/removeDeviceFromNetwork', nsroutes.removeDeviceFromNetworkRoute);
app.post('/connectTwoNetworks', nsroutes.connectTwoNetworksRoute);
app.post('/disconnectTwoNetworks', nsroutes.disconnectTwoNetworksRoute);
app.post('/removeDeviceFromCurrentNetwork',
		nsroutes.removeDeviceFromCurrentNetworkRoute);
app.post('/returnDeviceToPreviousNetwork',
		nsroutes.returnDeviceToPreviousNetworkRoute);

// registerMobileDevice
app.post('/distributeToken', rmdroutes.distributeTokenRoute);
app.post('/registerWithToken', rmdroutes.registerWithTokenRoute);
app.post('/validateToken', rmdroutes.validateTokenRoute);

// ----------------------- SERVER --------------------------------------

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
