// ------------------- MODULE DEPENDENCIES ---------------
var express = require('express');
var http = require('http');
var path = require('path');
// var favicon = require('favicon');
var morgan = require('morgan'); // formerly logger
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
var db = require('mongojs').connect('mongodb', ['administrators']);
var nodemailer = require("nodemailer");
var errorhandler = require("errorhandler");

// route modules
var indexroutes = require('./routes/index_routes');
var adminroutes = require('./routes/admin_routes');
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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
	app.use(errorhandler());
}

// ---------------------- DATABASE -----------------------

function administrator(email, password){
	this.email = email;
	this.password = email;
}
/*
function network(networkName, networkKind){
	this.networkName = networkName;
	this.networkKind = networkKind;
}
*/

db.administrators.ensureIndex( { email: 1 }, { unique: true } );

var administrator1 = new administrator("cpgd76@mun.ca", "encapsulation");


db.administrators.save(administrator1, function(err, savedAdmin){
	if( err || !savedAdmin) console.log("Adminstrator " + administrator.email + " not saved because of error " + err);
	else console.log("Administrator " + savedAdmin.email + " saved");
});
/*
db.administrators.find(admin1, function(err, administrators){
	if( err || !administrators.length) console.log("Administraor " + administrator.email + " not found.");
	else administrators.forEach( function(administrator){
		console.log("Administrator found! - " + administrator.email);
	} );
});
*/

/*
var admin2 = new administrator("Chris", "Doyle", "cpgd76@mun.ca");

db.administrators.save(admin2, function(err, savedUser){
	if( err || !savedUser) console.log("Adminstrator " + administrator.email + " not saved because of error " + err);
	else console.log("Administrator " + savedUser.email + " saved");
});
*/

//var nt = require('./simulation/network_topology.js');
/*
var db = mongojs('db', new Server('localhost', 27017));
var networks = db.collection('networks');
var devices = db.collection('devices');
var administrators = db.collection('administrators');
*/
/*
var f = new nt.Administrator("fiech", "encapsulation"); 
if (f) {
	console.log("f exists. f.username = " + f.username + ", f.password = " + f.password); 
}
db.administrators.insert(f, function(err, doc){
	console.log(doc);
});
var fFromCollection = db.administrators.find({username:"fiech"}, function(err, doc){
	console.log(doc);
});
*/
/*
if (fFromCollection) {
	console.log("fFromCollection exists. fFromCollection.next() = " + fFromCollection.next());
	//console.log(fFromCollection); 
}
else { console.log("fFromCollection does not exist"); }
*/

/*
// Copied and pasted from express-mailer example
// Might need to adjust
var transporter = nodemailer.createTransport({
	service : 'Gmail',
	auth : {
		user : 'gmail.user@gmail.com',
		pass : 'userpass'
	}
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
	from : 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
	to : 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
	subject : 'Hello ✔', // Subject line
	text : 'Hello world ✔', // plaintext body
	html : '<b>Hello world ✔</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info) {
	if (error) {
		console.log(error);
	} else {
		console.log('Message sent: ' + info.response);
	}
});
*/

// -------------------- ROUTING ----------------------------
app.get('/', indexroutes.indexRoute);
app.get('/userHome', indexroutes.userHomeRoute);
app.get('/adminHome', indexroutes.adminHomeRoute);
app.get('/users', userroutes.list);
app.get('/networkSettings', adminroutes.networkSettingsRoute);
app.get('/tokenDelivery', adminroutes.tokenDeliveryRoute);

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
app.post('/adminLogin', rmdroutes.adminLoginRoute);

// counter app
app.get("/counterApp", cApproutes.counterAppRoute);
app.post("/increment", cApproutes.incrementRoute);
app.post("/decrement", cApproutes.decrementRoute);

// ----------------------- SERVER --------------------------------------

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
