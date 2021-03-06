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
var mailer = require("express-mailer");
var errorhandler = require("errorhandler");

// File with all the functions
var router = require('./routes/router');

var app = express();
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.5.199.1";
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
// app.enable('view cache');
app.set('view engine', 'html');
// app.set('view engine', 'hjs');
// app.use(favicon());
app.use(morgan("dev")); // (formerly known as 'logger')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
	{ extended : true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' === app.get('env'))
{
	app.use(errorhandler());
}

mailer.extend(app,
	{ from : 'noreply.cs4770.4@gmail.com',
	host : 'smtp.gmail.com', // hostname
	secureConnection : true, // use SSL
	port : 465, // port for secure SMTP
	transportMethod : 'SMTP', // default is SMTP. Accepts anything that
	// nodemailer accepts
	auth :
		{ user : 'noreply.cs4770.4@gmail.com',
		pass : 'correcthorsebatterystaple1' } });

// -------------------- ROUTING ----------------------------
app.get('/', router.indexRoute);
app.get('/userHome', router.userHomeRoute);
app.get('/adminHome', router.adminHomeRoute);
app.get('/networkSettings', router.networkSettingsRoute);
app.get('/tokenDelivery', router.tokenDeliveryRoute);
app.get('/networkTopology', router.networkTopologyRoute);
app.get('/logger', router.loggerRoute);
app.get('/comingSoon', router.comingSoonRoute);

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

app.post('/distributeToken', router.distributeTokenRoute);
app.post('/registerWithToken', router.registerWithTokenRoute);
app.post('/validateToken', router.validateTokenRoute);
app.post('/adminLogin', router.adminLoginRoute);
app.post('/distributeToken', router.distributeTokenRoute);

// counter app
app.get("/counterApp", router.counterAppRoute);
app.post("/increment", router.incrementRoute);
app.post("/decrement", router.decrementRoute);

app.get('/getNetworkNames', function(req, res)
{
	db.networks.find({}, function(err, docs)
	{
		if (err)
		{
			console.log(err);
		}

		else if (docs)
		{
			var networkNames = [];
			for (var i = 0; i < docs.length; i++)
			{
				networkNames.push(docs[i].networkName);
			}
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(networkNames));
		}
	});
});

app.get('/getDeviceNames', function(req, res)
{
	db.devices.find({}, function(err, docs)
	{
		if (err)
		{
			console.log(err);
		}

		else if (docs)
		{
			var deviceNames = [];
			for (var i = 0; i < docs.length; i++)
			{
				deviceNames.push(docs[i].deviceName);
			}
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(deviceNames));
		}
	});
});

// ----------------------- SERVER --------------------------------------
http.createServer(app).listen(app.get('port'), function()
{
	console.log('Express server listening on port ' + app.get('port'));
});
