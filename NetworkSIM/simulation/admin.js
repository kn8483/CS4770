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
	ncoll.insert(n); // add _id field, mapped to an ObjectId object, into a
	// new Network object, and inserts in the table
}

function removeNetwork(name) { // from Simulation
	ncoll.remove({
		networkName : name
	});
}

/**
 * IMPORTANT: When mongo inserts the device in the devices table, it ADDS an _id
 * attribute. The VALUE of that attribute is an object called an ObjectID. That
 * ObjectID has a unique hexadecimal string representation (generated using the
 * time of insertion, some random elements, etc.) It is this hexadecimal string
 * that we will use as "tokens" for registering with the simulation. The string
 * is accessible through the ObjectId's 'str' attribute (which can be accessed
 * directly, or returned by the valueOf() method).
 */
function addDevice(dName) { // to Simulation
	var d = new nt.Device(dName);
	dcoll.insert(d); // add _id field, mapped to an ObjectId object, into a
	// new Device object, and inserts in the table
}

function removeDevice(dName) { // from Simulation
	dcoll.remove({
		deviceName : dName
	});
}

function addDeviceToNetwork(nName, dName) {
	var device = dcoll.findOne({
		deviceName : dName
	});
	var network = ncoll.findOne({
		networkName : nName
	});
	network.deviceList.push(device);
	ncoll.save(network);
}

function removeDeviceFromNetwork(nName, dName) {
	var device = dcoll.findOne({
		deviceName : dName
	});
	var network = ncoll.findOne({
		networkName : nName
	});
	var index = network.deviceList.indexOf(device);
	// use splice hack to remove
	// first param is where new elements should be added
	// second param is how many elements to delete
	// other params (elements that would be added) omitted
	network.deviceList.splice(index, 1);
	ncoll.save(network);
}

function connectTwoNetworks(n1Name, n2Name) {
	var n1 = ncoll.findOne({
		networkName : n1Name
	});
	var n2 = ncoll.findOne({
		networkName : n2Name
	});
	n1.connectedNetworks.push(n2);
	n2.connectedNetworks.push(n1);

	// Add code to enforce transitivity
	// i.e. for network in n1.connectedNetworks, add to n2.connectedNetworks
	// and viceversa, and for all networks in both lists

	ncoll.save(n1);
	ncoll.save(n2);

}

function disconnectTwoNetworks(n1Name, n2Name) {
	var n1 = ncoll.findOne({
		networkName : n1Name
	});
	var n2 = ncoll.findOne({
		networkName : n2Name
	});

	// RED ALERT
	// ADD CODE TO REMOVE FROM EACH OTHER'S CONNECTEDNETWORKS ARRAYS
	// AS WELL AS TO HANDLE THE ISSUE OF TRANSITIVITY

	ncoll.save(n1);
	ncoll.save(n2);
}

function removeDeviceFromCurrentNetwork(dName) {
	var device = dcoll.findOne({
		deviceName : dName
	});
	var n = ncoll.find({
		deviceList : {
			$in : [ device ]
		}
	});
	device.previousNetwork = n;
	ncoll.update({
		deviceList : {
			$in : [ device ]
		}
	}, {
		$pull : {
			deviceList : device
		}
	});
	dcoll.save(device);
}

function returnDeviceToPreviousNetwork(dName) {
	var device = dcoll.findOne({
		deviceName : dName
	});
	var pn = device.previousNetwork;
	pn.deviceList.push(device);
	ncoll.save(pn);
}

function getHoganTemplateVariables() {

	var networkArray = ncoll.find().toArray();
	var it = new nt.NetworkIterator();
	it.each(function(thisNetwork) {
		thisNetwork.numDev = thisNetwork.deviceList.length;
	});
	var deviceArray = dcoll.find().toArray();
	var nTotal = networkArray.length;
	var dTotal = deviceArray.length;

	var obj = {
		"networkTotal" : nTotal,
		"networks" : networkArray,
		"deviceTotal" : dTotal,
		"devices" : deviceArray,
		"appTotal" : 1,
		"apps" : [ {
			appName : "Counter"
		} ]
	}

	return obj;

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
exports.getHoganTemplateVariables = getHoganTemplateVariables;
