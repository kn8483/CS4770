// Put your code to regiser mobile devices here.

var nt = require('./network_topology');
var admin = require('./admin');
var mongo = require("mongojs");
var db = mongo('simdb');
var ncoll = db.collection('networks');
var dcoll = db.collection('devices');
var acoll = db.collection('administrators');
var app = require('../app').app; // use app.mailer to send e-mail

acoll.insert(new nt.Administrator("fiech", "encapsulation")); // the only
// administrator
// !

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
		token : hexstring
	// for Hogan
	}, function(err) {
		if (err) {
			console.log('There was an error sending the token e-mail');
			return;
		}
	});
}

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

function validateToken(token) {

	var doc = dcoll.findOne({
		"_id.str" : token,
		assigned : true
	});

	var valid;

	if (doc) { // found an assigned Device with this token
		valid = true;
	}

	else {
		valid = false;
	}

	return valid;
}

function adminLogin(uName, pWord) {
	var doc = acoll.findOne({
		username : uName,
		password : pWord
	});
	if (doc)
		return true;
	else
		return false;
}

exports.registerWithToken = registerWithToken;
exports.distributeToken = distributeToken;
exports.validateToken = validateToken;
exports.adminLogin = adminLogin;