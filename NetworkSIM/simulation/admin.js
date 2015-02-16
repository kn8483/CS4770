var nt = require('./network_topology');
var mongo = require("mongojs");
var db = mongo('simdb');
var ncoll = db.collection('networks');
var dcoll = db.collection('devices');

function importRDT(rdtName) {
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

function removeRDT(rdtName) {
	// Remove the RDT from the simulation
}

function importApp(appName) {
	// Import and initialize your web application in the simulation
}

function removeApp(appName) {
	// Remove the application from the simulation
}

function addNetwork(networkName, networkKind) { // to Simulation
	var n = new nt.Network(networkName, networkKind);
	ncoll.insert(n); // add _id field, mapped to an ObjectId object, into a new Network object, and inserts in the table
}

function removeNetwork(name) { // from Simulation
	ncoll.remove({
		networkName : name
	});
}

/**
 * IMPORTANT: 
 * When mongo inserts the device in the devices table, it ADDS an _id attribute.
 * The VALUE of that attribute is an object called an ObjectID. 
 * That ObjectID has a unique hexadecimal string representation (generated using
 * the time of insertion, some random elements, etc.)
 * It is this hexadecimal string that we will use as "tokens" for registering 
 * with the simulation.
 * The string is accessible through the ObjectId's 'str' attribute (which can be accessed
 * directly, or returned by the valueOf() method). 
 */
function addDevice(deviceName) { // to Simulation
	var d = new nt.Device(deviceName);
	dcoll.insert(d); // add _id field, mapped to an ObjectId object, into a new Device object, and inserts in the table
}

function removeDevice(name) { // from Simulation
	dcoll.remove({
		deviceName : name
	});
}

function addDeviceToNetwork(network, device) {
	ncoll.update(
			{networkName : network.Name}, 
			{ $addToSet : 
				{ deviceList : device }
			});
}

function removeDeviceFromNetwork(network, device) {
	ncoll.update(
			{networkName : network.Name}, 
			{ $pull : 
				{ deviceList : device }
			});
}

function connectTwoNetworks(n1, n2) {
	ncoll.update(
			{networkName : n1.networkName}, 
			{ $addToSet : 
				{ connectedNetworks : n2 }
			});
	ncoll.update(
			{networkName : n2.networkName}, 
			{ $addToSet : 
				{ connectedNetworks : n1 }
			});
}

function disconnectTwoNetworks(n1, n2) {
	ncoll.update(
			{networkName : n1.networkName}, 
			{ $pull : 
				{ connectedNetworks : n2 }
			});
	ncoll.update(
			{networkName : n2.networkName}, 
			{ $pull : 
				{ connectedNetworks : n1 }
			});
}

function removeDeviceFromCurrentNetwork(device) {
	var n = ncoll.find({ deviceList : { $in : [device] } }); 
	dcoll.update(
			{deviceName : device.deviceName}, 
			{ $set : { previousNetwork : n }}
			); 	
	ncoll.update(
			{ deviceList: { $in : [device] } },			
			{ $pull : { deviceList : device } }
			); 
}

function returnDeviceToPreviousNetwork(device) {
	var pn = device.previousNetwork;  
	ncoll.update(
			{ networkName : pn.networkName }, 
			{ $addToset : { deviceList : device }}
			); 	
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
