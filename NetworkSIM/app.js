// ------------------- MODULE DEPENDENCIES ---------------

var express = require('express');
var http = require('http');
var path = require('path');
// var favicon = require('favicon');
var morgan = require('morgan'); // formerly logger
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
var mongo = require("mongojs");
var nodemailer = require("nodemailer"); // added to distribute token by e-mail
										// in registerMobileDevice
//var expressMail = require('express-mail'); // NOT WORKING
var indexroutes = require('./routes/index_routes');
var userroutes = require('./routes/user');
var nsroutes = require('./routes/network_settings_routes');
var rmdroutes = require('./routes/registerMobileDevice_routes');
var cApproutes = require('./routes/counterApp_routes');


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
// Might need to adjust
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'gmail.user@gmail.com',
        pass: 'userpass'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});



app.get('/', indexroutes.adminHomeRoute);
app.get('/users', indexroutes.userHomeRoute);

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
});
// NOT WORKING
/*expressMail.extend(app, {
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
});*/

// -------------------- ROUTING ----------------------------

app.get('/', indexroutes.indexRoute);
app.get('/userHome', indexroutes.userHomeRoute);
app.get('/adminHome', indexroutes.adminHomeRoute);
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

// counter app
app.get("/counterApp", cApproutes.counterAppRoute);
app.post("/increment", cApproutes.incrementRoute);
app.post("/decrement", cApproutes.decrementRoute);

// ----------------------- SERVER --------------------------------------

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
