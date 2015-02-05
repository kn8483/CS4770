/**
 * New node file
 */

var networkList;
var deviceList;

function NetworkIterator(){
	this.first = function() {
    };
    
    this.next = function() {
    };
    
    this.hasNext = function() {
    };
    
    this.reset = function() {
    };
    
    this.each = function(callback) {
        for (var item = this.first(); this.hasNext(); item = this.next()) {
            callback(item);
        }
    };
}

function DeviceIterator(){
	this.first = function() {
    };
    
    this.next = function() {
    };
    
    this.hasNext = function() {
    };
    
    this.reset = function() {
    };
    
    this.each = function(callback) {
    };
}

function Network(networkName,networkKind){
	this.deviceIterator = new DeviceIterator(); // Returns an iterator that provides Device objects
	this.addDevice = function(device){}; // Adds a new device to the network
	this.removeDevice = function(device){}; //
	this.connectNetwork = function(network){};
	this.disconnectNetwork = function(network){};
	this.networkName = networkName; // String
	this.networkKind = networkKind; // Constant: WiFi, GSM
}

function Device(deviceName){
	this.joinNetwork = function(network){};
	this.leaveNetwork = function(){};
	this.returnNetwork = function(){};
	this.replicateRDT = function(rdt){}; 
	this.accessRDT = function(){};
}

exports.NetworkIterator = NetworkIterator;

