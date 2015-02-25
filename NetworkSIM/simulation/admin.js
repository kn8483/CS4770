/**
 * IMPORTANT: When mongo inserts the device in the devices table, it ADDS an _id
 * attribute. The VALUE of that attribute is an object called an ObjectID. That
 * ObjectID has a unique hexadecimal string representation (generated using the
 * time of insertion, some random elements, etc.) It is this hexadecimal string
 * that we will use as "tokens" for registering with the simulation. The string
 * is accessible through the ObjectId's 'str' attribute (which can be accessed
 * directly, or returned by the valueOf() method).
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

function importRDT(rdtName)
{
	// Import a replicated data type to use in the simulation
	/*
	 * The RDT will have a common interface like the following after you import
	 * it:
	 * 
	 * rdt.init(networkIterator, deviceIterator); // initiate the RDT type with
	 * your networkIterator from the simulation
	 * 
	 * For a simple integer counter RDT, it will also have methods to increment
	 * and get the value of the counter, e.g.:
	 * 
	 * rdt.inc(); // increment the integer counter by one rdt.val(); // get the
	 * current value of the counter
	 */
}
function removeRDT(rdtName)
{
	// Remove the RDT from the simulation
}

function importApp(appName)
{
	// Import and initialize your web application in the simulation
}

function removeApp(appName)
{
	// Remove the application from the simulation
}

// Add a Network object to the simulation by saving to the collection
function addNetwork(networkName, networkKind)
{
	console.log("Adding network with name : " + networkName + " and kind "
	    + networkKind);
	var n = new Network(networkName, networkKind);
	db.networks
	    .save(
	        n,
	        function(err, doc)
	        {
		        if (err)
		        {
			        console.log(err);
		        }
		        else
		        {
			        console
			            .log("The following Network object was saved in the networks collection:");
			        console.log(doc);
		        }
	        });
}

// Remove Network object from Simulation by removing from database
function removeNetwork(name)
{
	console.log("Removing network with name : " + name);
	db.networks
	    .remove(
		        { networkName : name },
	        function(err, doc)
	        {
		        if (err)
		        {
			        console.log(err);
		        }
		        else
		        {
			        console
			            .log("The following Network object was removed from the networks collection:");
			        console.log(doc);
		        }
	        });
}

// Add a Device object to the Simulation by saving it to the collection
function addDevice(dName)
{
	console.log("Adding device with name : ");
	var d = new Device(dName);
	db.devices
	    .save(
	        d,
	        function(err, doc)
	        {
		        if (err)
		        {
			        console.log(err);
		        }
		        else
		        {
			        console
			            .log("The following Device object was saved in the devices collection:");
			        console.log(doc);
		        }
	        });
}

// Remove Device from simulation by deleting from collection

function removeDevice(dName)
{
	console.log("Removing device with name : " + dName);
	db.devices
	    .remove(
		        { deviceName : dName },
	        function(err, doc)
	        {
		        if (err)
		        {
			        console.log(err);
		        }
		        else
		        {
			        console
			            .log("The following Device object was removed from the devices collection:");
			        console.log(doc);
		        }
	        });
}

function addDeviceToNetwork(nName, dName)
{
	console.log("Adding Device " + dName + " to Network " + nName);
	db.networks
	    .findOne(
		        { networkName : nName },
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
				                { deviceName : dName },
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
						                d = new Device(dName);
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
					                        function(err, nDoc)
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
							                        console.log(nDoc);
						                        }
					                        });
				                }
			                });
		        }
	        });
}
function removeDeviceFromNetwork(nName, dName)
{
	console.log("Removing device " + dName + " from network " + nName);
	db.networks
	    .findOne(
		        { networkName : nName },
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
					        if (n.deviceList[i].deviceName === dName)
					        {
						        // use splice hack to remove from array
						        // first param is where new elements should be
						        // added
						        // second param is how many elements to delete
						        // other params (elements that would be added)
						        // are omitted
						        n.deviceList.splice(i, 1);
						        db.networks
						            .save(
						                n,
						                function(err, doc)
						                {
							                if (err)
							                {
								                console.log(err);
							                }

							                else
							                {
								                console
								                    .log("A device with name "
								                        + dName
								                        + " was removed from the following network object:");
								                console.log(doc);
							                }
						                });
					        }
				        }
			        }
		        }
	        });
}
function connectTwoNetworks(n1Name, n2Name)
{
	// To be implemented
	// Need TRANSITIVE CLOSURE
	// Possibly new collection in db?
}

function disconnectTwoNetworks(n1Name, n2Name)
{
	// To be implemented
	// Need TRANSITIVE CLOSURE
	// Possibly new collection in db?
}
function removeDeviceFromCurrentNetwork(dName)
{
	// To be implemented
}

function returnDeviceToPreviousNetwork(dName)
{
	// To be implemented
}

exports.importRDT = importRDT;
exports.importApp = importApp;
exports.addNetwork = addNetwork;
exports.removeNetwork = removeNetwork;
exports.addDevice = addDevice;
exports.removeDevice = removeDevice;
exports.addDeviceToNetwork = addDeviceToNetwork;
exports.removeDeviceFromNetwork = removeDeviceFromNetwork;
exports.connectTwoNetworks = connectTwoNetworks;
exports.disconnectTwoNetworks = disconnectTwoNetworks;
exports.removeDeviceFromCurrentNetwork = removeDeviceFromCurrentNetwork;
exports.returnDeviceToPreviousNetwork = returnDeviceToPreviousNetwork;
