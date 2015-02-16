// Put your code to regiser mobile devices here.

var nt = require('./network_topology');
var admin = require('./admin');
var mongo = require("mongojs");
var db = mongo('simdb');
var ncoll = db.collection('networks');
var dcoll = db.collection('devices');
var app = require('../app').app; // use app.mailer to send e-mail

/**
 * Attempt to a find a device in the table whose id matches the token the user
 * has submitted --- see admin.addDevice comment for details. If found, set the
 * assigned attribute to true. Update returns a writeResult object. If a device
 * with this token was not found, the writeResult object's nModified field will
 * be 0.
 */
function registerWithToken(token) {

	var writeResult = dcoll.update({
		"_id.str" : token,
		assigned : false
	}, // WHERE id == token and unassigned
	{
		$set : {
			assigned : true
		}
	});

	if (writeResult.nModified === 1) {
		// inform router to send successful status code
		// router will tell browser
		// browser will run script to pop up alert store token
		return true; // 
	}

	else {
		// inform router to send unsuccessful status code
		// router will tell browser
		// browser will pop up alert saying invalid token
		return false;
	}
}

/**
 * 1. Get reference to one unassigned device 2. Get that device's token (id) 3.
 * User express-mailer module to send e-mail. The body is the token_email.hjs
 * template, configured to use the same view engine.
 */
function distributeToken(emailAddress) {
	var unassignedDevice = dcoll.findOne({
		assigned : false
	});
	var hexstring = unassignedDevice._id.valueOf(); // valueOf method returns
	// str attribute of ObjectId
	// object that is value of
	// _id attribute of device
	// object
	app.mailer.send('token_email', {
		to : emailAddress, // REQUIRED. This can be a comma delimited string
		// just like a normal email to field.
		bcc : 'db2763@mun.ca, kn8384@mun.ca, xx1100@mun.ca',
		subject : 'Network Simulation Registration', // REQUIRED.
		registerURL : 'http://sc-4.cs.mun.ca/register', // for Hogan!
		token : hexstring //for Hogan
	}, function(err) {
		if (err) {
			console.log('There was an error sending the token e-mail');
			return;
		}
	});
}

exports.registerWithToken = registerWithToken;
exports.distributeToken = distributeToken;

// From API
/*
 * Sending an email You can send an email by calling app.mailer.send(template,
 * locals, callback). To send an email using the template above you could write:
 * 
 * app.get('/', function (req, res, next) { app.mailer.send('email', { to:
 * 'example@example.com', // REQUIRED. This can be a comma delimited string just
 * like a normal email to field. subject: 'Test Email', // REQUIRED.
 * otherProperty: 'Other Property' // All additional properties are also passed
 * to the template as local variables. }, function (err) { if (err) { // handle
 * error console.log(err); res.send('There was an error sending the email');
 * return; } res.send('Email Sent'); }); }); You can also send an email by
 * calling mailer on an applications response object: res.mailer.send(template,
 * options, callback).
 * 
 * Nodemailer options It is also possible to change the options supplied to
 * nodemailers sendMail function. Instead of passing in the template name to
 * mailer.send or mailer.render you can pass an object with any of the following
 * fields:
 * 
 * template - REQUIRED - The name of the template to render from - The e-mail
 * address of the sender. All e-mail addresses can be plain sender@server.com or
 * formatted Sender Name <sender@server.com> to - Comma separated list or an
 * array of recipients e-mail addresses that will appear on the To: field cc -
 * Comma separated list or an array of recipients e-mail addresses that will
 * appear on the Cc: field bcc - Comma separated list or an array of recipients
 * e-mail addresses that will appear on the Bcc: field replyTo - An e-mail
 * address that will appear on the Reply-To: field inReplyTo - The message-id
 * this message is replying references - Message-id list subject - The subject
 * of the e-mail headers - An object of additional header fields {"X-Key-Name":
 * "key value"} (NB! values are passed as is, you should do your own encoding to
 * 7bit and folding if needed) attachments - An array of attachment objects.
 * alternatives - An array of alternative text contents (in addition to text and
 * html parts) envelope - optional SMTP envelope, if auto generated envelope is
 * not suitable messageId - optional Message-Id value, random value will be
 * generated if not set. Set to false to omit the Message-Id header date -
 * optional Date value, current UTC string will be used if not set encoding -
 * optional transfer encoding for the textual parts (defaults to
 * "quoted-printable") charset - optional output character set for the textual
 * parts (defaults to "utf-8") dsn - An object with methods success, failure and
 * delay. If any of these are set to true, DSN will be used For example you
 * could cc others with the previous example like this:
 * 
 * app.mailer.send( { template: 'email', // REQUIRED cc: 'cc@example.com' }, {
 * to: 'example@example.com', subject: 'Test Email', otherProperty: 'Other
 * Property' }, function (err) { if (err) { // handle error }; // mail sent! } );
 */
