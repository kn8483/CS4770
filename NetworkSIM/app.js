// ------------------- MODULE DEPENDENCIES ---------------
var express = require('express');
var http = require('http');
var path = require('path');
// var favicon = require('favicon');
var morgan = require('morgan'); // formerly logger
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
var mongojs = require('mongojs');
var db = mongojs('simdb', [ 'administrators', 'devices', 'networks' ]);
var nodemailer = require("nodemailer");
var errorhandler = require("errorhandler");

// File with all the functions
var router = require('./routes/router');

var app = express();
// all environments
app.set('port', process.env.PORT || 3444);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
// app.enable('view cache');
app.set('view engine', 'html');
// app.set('view engine', 'hjs');
// app.use(favicon());
app.use(morgan("dev")); // (formerly known as 'logger')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' === app.get('env')) {
	app.use(errorhandler());
}

/*
 * // Copied and pasted from express-mailer example // Might need to adjust var
 * transporter = nodemailer.createTransport({ service : 'Gmail', auth : { user :
 * 'gmail.user@gmail.com', pass : 'userpass' } }); // NB! No need to recreate
 * the transporter object. You can use // the same transporter object for all
 * e-mails // setup e-mail data with unicode symbols var mailOptions = { from :
 * 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address to :
 * 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers subject :
 * 'Hello ✔', // Subject line text : 'Hello world ✔', // plaintext body html : '<b>Hello
 * world ✔</b>' // html body }; // send mail with defined transport object
 * transporter.sendMail(mailOptions, function(error, info) { if (error) {
 * console.log(error); } else { console.log('Message sent: ' + info.response); }
 * });
 */
// -------------------- ROUTING ----------------------------
app.get('/', router.indexRoute);
app.get('/userHome', router.userHomeRoute);
app.get('/adminHome', router.adminHomeRoute);

app.get('/networkSettings', router.networkSettingsRoute);
app.get('/tokenDelivery', router.tokenDeliveryRoute);
// network_settings
app.post('/importRDT', router.importRDTRoute);
app.post('/removeRDT', router.removeRDTRoute);
app.post('/importApp', router.importAppRoute);
app.post('/removeApp', router.removeAppRoute);
app.post('/addNetwork', router.addNetworkRoute);
app.post('/removeNetwork', router.removeNetworkRoute);
app.post('/addDevice', router.addDeviceRoute);
app.post('/removeDevice', router.removeDeviceRoute);
app.post('/addDeviceToNetwork', router.addDeviceToNetworkRoute);
app.post('/removeDeviceFromNetwork', router.removeDeviceFromNetworkRoute);
app.post('/connectTwoNetworks', router.connectTwoNetworksRoute);
app.post('/disconnectTwoNetworks', router.disconnectTwoNetworksRoute);
app.post('/removeDeviceFromCurrentNetwork',
		router.removeDeviceFromCurrentNetworkRoute);
app.post('/returnDeviceToPreviousNetwork',
		router.returnDeviceToPreviousNetworkRoute);
// registerMobileDevice
app.post('/distributeToken', router.distributeTokenRoute);
app.post('/registerWithToken', router.registerWithTokenRoute);
app.post('/validateToken', router.validateTokenRoute);
app.post('/adminLogin', router.adminLoginRoute);
// counter app
app.get("/counterApp", router.counterAppRoute);
app.post("/increment", router.incrementRoute);
app.post("/decrement", router.decrementRoute);
// ----------------------- SERVER --------------------------------------
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
