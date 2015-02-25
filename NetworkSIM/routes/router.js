/**
 * All routing functions/request handlers.
 * 
 */

// Note about the database
/*
 * After we connected we can query or update the database just how we would
 * using the mongo API with the exception that we use a callback. The format for
 * callbacks is always callback(error, value) where error is null if no
 * exception has occured. The update methods save, remove, update and
 * findAndModify also pass the lastErrorObject as the last argument to the
 * callback function.
 */

var mongojs = require('mongojs');
var db = mongojs('simdb', [ 'administrators', 'devices', 'networks' ]);
db.administrators.ensureIndex(
	{ username : 1 },
	{ unique : true });
db.networks.ensureIndex(
	{ networkName : 1 },
	{ unique : true });
db.devices.ensureIndex(
	{ deviceName : 1 },
	{ unique : true });
var network_topology = require('../simulation/network_topology');
var Network = network_topology.Network;
var Device = network_topology.Device;
var Administrator = network_topology.Administrator;

// ----------- Helper --------------------------

function hogan(res)
{
	// If you provide a callback to find or any cursor config operation mongojs
	// will call toArray for you
	// db.mycollection.find({}, function(err, docs) { ... });
	// is the same as
	// db.mycollection.find({}).toArray(function(err, docs) { ... });
	db.networks.find({}, function(err, networks)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			var networkArray = networks;
			var nTotal = networkArray.length;
			for (var i = 0; i < nTotal; i++)
			{
				var n = networkArray[i];
				n.numDev = "DUMMYVALUE";
			}
			db.devices.find({}, function(err, devices)
			{
				if (err)
				{
					console.log(err);
				}
				else
				{
					var deviceArray = devices;
					var dTotal = deviceArray.length;
					var partials =
						{ "networkTotal" : nTotal,
						"networks" : networkArray,
						"deviceTotal" : dTotal,
						"devices" : deviceArray,
						"appTotal" : 1,
						"apps" : [
							{ appName : "Counter" } ] };
					console.log("The partials object: ");
					console.log(partials);
					res.render('networkSettings', partials);
				}
			});
		}
	});
}

// ----------- Serving Pages --------------------

exports.indexRoute = function(req, res)
{
	res.render('index');
};

exports.userHomeRoute = function(req, res)
{
	res.render('userHome');
};

exports.adminHomeRoute = function(req, res)
{
	res.render('adminHome');
};

exports.networkSettingsRoute = function(req, res)
{
	hogan(res);
};

exports.tokenDeliveryRoute = function(req, res)
{
	res.render('tokenDelivery');
};

// ---- Login and Registration (from index.html)

exports.adminLoginRoute = function(req, res)
{
	console.log("inside adminLoginRoute");
	console.log('req.body is: ');
	console.log(req.body);
	db.administrators.findOne(
		{ username : req.body.username,
		password : req.body.password }, function(err, doc)
	{
		if (err)
		{
			console.log(err);
			res.status(400);
			res.end();
		}

		else
		{
			if (doc)
			{
				console.log("Found the following matching object in the db");
				console.log(doc);
				res.status(200);
				res.end();
			}

			else
			{
				console.log("findOne returned null doc");
				res.status(400);
				res.end();
			}
		}
	});
};

exports.registerWithTokenRoute = function(req, res)
{
	console.log('inside registerWithTokenRoute');
	console.log('req.body is: ');
	console.log(req.body);

	var unassignedDeviceWithThisToken = db.devices
	    .findOne(
		        { _id : mongojs.ObjectId(req.body.token),
		        assigned : false },
	        function(err, doc)
	        {
		        if (err)
		        {
			        console.log(err);
		        }

		        else
		        {
			        if (!doc)
			        {
				        console
				            .log("doc is null, so no unassigned device with this token");
				        res.status(400);
				        res.end();
			        }

			        else
			        {
				        console.log("Will assign the following device:");
				        console.log(doc);
				        doc.assigned = true;
				        db.devices.save(doc, function(err, doc)
				        {
					        if (err)
					        {
						        console.log(err);
					        }
				        });
				        res.status(200);
				        res.end();
			        }
		        }
	        });
};

exports.validateTokenRoute = function(req, res)
{
	console.log("inside validateTokenRoute");
	console.log("req.body:");
	console.log(req.body);
	db.devices.findOne(
		{ _id : mongojs.ObjectId(req.body.token) }, function(err, doc)
	{
		if (err)
		{
			console.log(err);
			res.status(400);
			res.end();
		}

		else
		{
			if (doc)
			{
				console.log("Device with this token found.");
				res.status(200);
				res.end();
			}

			else
			{
				res.status(400);
				res.end();
			}
		}
	});
};

exports.distributeTokenRoute = function(req, res)
{
	console.log("inside distributeTokenRoute");
	console.log("req.body is:");
	console.log(req.body);
	var email = req.body.email;

	db.devices.findOne(
		{ assigned : false }, function(err, doc)
	{

		if (err)
		{
			console.log(err);
		}

		else
		{

			if (doc)
			{
				console.log("Found an unassigned device:");
				console.log(doc);
				console.log("The id/token of this device is : "
				    + doc._id.valueOf());
				console.log("e-mailing token");
				res.mailer.send('token_email',
					{ to : email,
					bcc : 'xx1100@mun.ca',
					subject : 'Network Simulation Registration',
					registerURL : 'http://sc-4.cs.mun.ca/',
					token : doc._id.valueOf() }, function(err)
				{
					if (err)
					{
						console.log("error sending email");
						console.log(err);
					}
				});
				res.status(200);
				res.end();
			}

			else
			{
				console.log("No unassigned device found");
				res.status(400);
				res.end();
			}
		}
	});
};

// ------ Modify Simulation (networkSettings.html)

exports.addNetworkRoute = function(req, res)
{
	console.log("req.body:");
	console.log(req.body);
	var n = new Network(req.body.networkName, req.body.networkKind);
	db.networks.save(n, function(err, doc)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("The following network object was saved:");
			console.log(n);
			// var template = getHoganTemplate();
			// console.log(template);
			res.status(200);
			res.end();
		}
	});
};

exports.removeNetworkRoute = function(req, res)
{
	console.log("inside removeNetworkRoute");
	console.log("req.body:");
	console.log(req.body);
	db.networks.remove(
		{ networkName : req.body.networkName }, function(err, doc)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("The following network object was removed:");
			console.log(doc);
			// var template = getHoganTemplate();
			// console.log(template);
			res.status(200);
			res.end();
			// res.render('networkSettings', template);
		}
	});
};

exports.addDeviceRoute = function(req, res)
{
	console.log("inside addDeviceRoute");
	console.log("req.body:");
	console.log(req.body);
	var d = new Device(req.body.name);
	db.devices.save(d, function(err, doc)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("The following device object was saved:");
			console.log(doc);
			// var template = getHoganTemplate();
			// console.log(template);
			res.status(200);
			res.end();
			// res.render('networkSettings', template);
		}
	});
};

exports.removeDeviceRoute = function(req, res)
{
	console.log("inside removeDeviceRoute");
	console.log("req.body:");
	console.log(req.body);
	db.devices.remove(
		{ deviceName : req.body.name }, function(err, doc)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("The following device object was removed:");
			console.log(doc);
			// var template = getHoganTemplate();
			// console.log(template);
			res.status(200);
			res.end();
			// res.render('networkSettings', template);
		}
	});
};

exports.addDeviceToNetworkRoute = function(req, res)
{
	console.log("inside addDeviceToNetworkRoute");
	console.log("req.body:");
	console.log(req.body);
	db.networks
	    .findOne(
		        { networkName : req.body.networkName },
	        function(err, n)
	        {
		        if (err)
		        {
			        console.log(err);
		        }
		        else
		        {
			        db.devices
			            .findOne(
				                { deviceName : req.body.deviceName },
			                function(err, d)
			                {
				                if (err)
				                {
					                console.log(err);
				                }
				                else
				                {
					                if (!d)
					                {
						                d = new Device(req.body.deviceName);
					                }
					                if (n.deviceList)
					                {
						                n.deviceList.push(d);
					                }
					                else
					                {
						                n.deviceList = [];
						                n.deviceList.push(d);
					                }
					                db.networks
					                    .save(
					                        n,
					                        function(err, n)
					                        {
						                        if (err)
						                        {
							                        console.log(err);
						                        }
						                        else
						                        {
							                        console
							                            .log("The following device object was saved to the following network object:");
							                        console.log(d);
							                        console.log(n);
							                        res.status(200);
							                        res.end();
						                        }
					                        });
				                }
			                });
		        }
	        });
};

exports.removeDeviceFromNetworkRoute = function(req, res)
{
	console.log("inside removeDeviceFromNetworkRoute");
	console.log("req.body:");
	console.log(req.body);
	db.networks
	    .findOne(
		        { networkName : req.body.networkName },
	        function(err, n)
	        {
		        if (err)
		        {
			        console.log(err);
		        }
		        else
		        {
			        if (n.deviceList)
			        {
				        for (var i = 0; i < n.deviceList.length; i++)
				        {
					        if (n.deviceList[i].deviceName === req.body.deviceName)
					        {
						        // use splice hack to remove
						        // first param is where new
						        // elements
						        // should be added
						        // second param is how many
						        // elements to
						        // delete
						        // other params (elements that
						        // would be
						        // added) omitted
						        n.deviceList.splice(i, 1);
						        db.networks
						            .save(
						                n,
						                function(err, n)
						                {
							                if (err)
							                {
								                console.log(err);
							                }
							                else
							                {
								                console
								                    .log("The following device was removed from the following network object:");
								                console.log(n);
								                console
								                    .log(req.body.deviceName);
								                res.status(200);
								                res.end();
							                }
						                });
					        }
				        }
			        }
		        }
	        });
};

exports.connectTwoNetworksRoute = function(req, res)
{
	console.log("inside connectTwoNetworksRoute");
	console.log("req.body:");
	console.log(req.body);
	console
	    .log("Need to implement transitive connections and represent in database");
	res.end();
};

exports.disconnectTwoNetworksRoute = function(req, res)
{
	console.log("inside disconnectTwoNetworksRoute");
	console.log("req.body:");
	console.log(req.body);
	console
	    .log("Need to implement transitive connections and represent in database");
	res.end();
};

exports.removeDeviceFromCurrentNetworkRoute = function(req, res)
{
	console.log("inside removeDeviceFromCurrentNetworkRoute");
	console.log("req.body:");
	console.log(req.body);
	console.log("Need to implement, low-priority");
	res.end();
};
exports.returnDeviceToPreviousNetworkRoute = function(req, res)
{
	console.log("inside removeDeviceFromCurrentNetworkRoute");
	console.log("req.body:");
	console.log(req.body);
	console.log("Need to implement, low-priority");
	res.end();
};
exports.importRDTRoute = function(req, res)
{
	res.render('networkSettings',
		{ networkTotal : 6 });
};
exports.removeRDTRoute = function(req, res)
{
	admin.removeRDT(req.body.name);
	res.render('network_settings');
};

exports.importAppRoute = function(req, res)
{
	admin.importApp(req.body.name);
	res.render('network_settings.hjs');
};

exports.removeAppRoute = function(req, res)
{
	admin.removeApp(req.body.name);
	res.render('network_settings.hjs');
};
// ------------ Counter App -----------------

exports.counterAppRoute = function(req, res)
{
	res.render('counterApp',
		{ localCount : "just testing hogan",
		globalCount : "hi from david" });
};

exports.incrementRoute = function(req, res)
{
	var device = dcoll.findOne(
		{ "_id.str" : token });
	if (!device.localCount)
	{
		device.localCount = -1;
	}
	else
	{
		device.localCount -= 1;
	}
	dcoll.save(device);
};

exports.decrementRoute = function(req, res)
{
	var device = dcoll.findOne(
		{ "_id.str" : token });
	if (!device.localCount)
	{
		device.localCount = -1;
	}
	else
	{
		device.localCount -= 1;
	}
	dcoll.save(device);
};
