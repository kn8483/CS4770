var admin = require('./admin');

function Administrator(username, password) {
	this.username = username;
	this.password = password;
}

// we can use admin.ncoll.find(); will return a CURSOR for all networks

/*
 * function NetworkIterator() { // An iterator over networks in the simulation
 * this.nCursor = admin.ncoll.find(); // a cursor to all the networks in the //
 * ncoll
 * 
 * this.first = function() { // return the first element // we won't need this
 * function, will use the built-in cursor's forEach };
 * 
 * this.next = function() { // Return the next element this.nCursor.next(); };
 * 
 * this.hasNext = function() { // Determine if there are more elements to
 * iterate this.nCursor.hasNext(); };
 * 
 * this.reset = function() { // Reset the iterator to its initial state so it
 * can be re-used this.nCursor = admin.ncoll.find(); };
 * 
 * this.each = function(callback) { // Invoke the callback function on each
 * element /* for (var item = this.first(); this.hasNext(); item = this.next()) {
 * callback(item); }
 * 
 * this.nCursor.forEach(callback);
 *  };
 *  }
 * 
 * function DeviceIterator() { // Similar to the NetworkIterator except the
 * elements are devices // Called on a given network object... // need to
 * iterate over array 'deviceList' found inside each network object
 * 
 * var thisNetwork = admin.ncoll.findOne({ networkName : this.networkName }); //
 * findOne returns a document instead of a cursor
 * 
 * var deviceList = thisNetwork.deviceList; var currentIndex = 0;
 * 
 * this.first = function() { return deviceList[0]; };
 * 
 * this.next = function() { var oldIndex = currentIndex; currentIndex =
 * currentIndex + 1; return deviceList[oldIndex]; };
 * 
 * this.hasNext = function() { return currentIndex < deviceList.length; };
 * 
 * this.reset = function() { currentIndex = 0; };
 * 
 * this.each = function(callback) { for (var item = this.first();
 * this.hasNext(); item = this.next()) { callback(item); } }; }
 */

function Network(networkName, networkKind) {
	// Construct a network object

	this.networkName = networkName; // String
	this.networkKind = networkKind; // Constant: WiFi, GSM
	// this.deviceList = [];
	// this.connectedNetworks = [];

	// this.deviceIterator = new DeviceIterator(); // Returns an iterator that
	// provides Device objects

	this.addDevice = function(device) {
		admin.addDeviceToNetwork(this, device);
	};

	this.removeDevice = function(device) {
		admin.removeDeviceFromNetwork(this, device);
	};

	this.connectNetwork = function(network) {
		admin.connectTwoNetworks(this, network);
	};

	this.disconnectNetwork = function(network) {
		admin.connectTwoNetworks(this, network);
	};
}

function Device(deviceName) {
	// Construct a device object

	this.deviceName = deviceName;
	this.assigned = false;

	this.joinNetwork = function(network) {
		admin.addDeviceToNetwork(network, this);
	};

	this.leaveNetwork = function() {
		admin.removeDeviceFromCurrentNetwork(this);
	};

	this.returnNetwork = function() {
		if (this.previousNetwork) {
			admin.returnDeviceToPreviousNetwork(this);
		}
	};

	this.replicateRDT = function(rdt) {
		// Register a replicated data type in the device
	};

	this.accessRDT = function() {
		// Access the previously registered replicated data type in the device
	};
}

exports.Administrator = Administrator;
exports.Network = Network;
exports.Device = Device;
// exports.NetworkIterator = NetworkIterator;
// exports.DeviceIterator = DeviceIterator;
