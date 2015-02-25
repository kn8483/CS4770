var admin = require('./admin');
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

function NetworkIterator()
{

	db.networks.find({}, function(err, docs)
	{

		if (err)
		{
			console.log("Error creating Network Iterator.");
			console.log(err);
		}

		else
		{
			this.allNetworksArray = docs;

			this.currentIndex = 0;

			this.first = function()
			{
				return this.allNetworksArray[0];
			};

			this.next = function()
			{
				if (this.hasNext)
				{
					var oldIndex = this.currentIndex;
					this.currentIndex++;
					return this.allNetworksArray[oldIndex];
				}
			};

			this.hasNext = function()
			{
				return this.currentIndex < this.allNetworksArray.length;
			};

			this.reset = function()
			{
				this.currentIndex = 0;
			};

			this.each = function(callback)
			{
				for (var item = this.first(); this.hasNext(); item = this
				    .next())
				{
					callback(item);
				}
			};
		}
	});
}

function DeviceIterator()
{

	if (this.deviceList)
	{
		this.currentIndex = 0;
	}

	this.first = function()
	{
		if (this.deviceList.length > 0)
		{
			return this.deviceList[0];
		}
		else
		{
			return null;
		}
	};

	this.next = function()
	{
		if (this.hasNext)
		{
			var oldIndex = this.currentIndex;
			this.currentIndex++;
			return this.deviceList[oldIndex];
		}
	};

	this.hasNext = function()
	{
		return this.currentIndex < this.deviceList.length;
	};

	this.reset = function()
	{
		this.currentIndex = 0;
	};

	this.each = function(callback)
	{
		for (var item = this.first(); this.hasNext(); item = this.next())
		{
			callback(item);
		}
	};
}

function Network(networkName, networkKind)
{
	// Construct a network object

	this.networkName = networkName; // String
	this.networkKind = networkKind; // Constant: WiFi, GSM
	this.deviceList = [];
	this.connectedNetworks = [];

	this.deviceIterator = new DeviceIterator();

	this.addDevice = function(deviceName)
	{
		admin.addDeviceToNetwork(this.networkName, deviceName);
	};

	this.removeDevice = function(deviceName)
	{
		admin.removeDeviceFromNetwork(this.networkName, deviceName);
	};

	this.connectNetwork = function(network)
	{
		// To be implemented
	};

	this.disconnectNetwork = function(network)
	{
		// To be implemented
	};
}

function Device(deviceName)
{
	// Construct a device object

	this.deviceName = deviceName;
	this.assigned = false;

	this.joinNetwork = function(networkName)
	{
		admin.addDeviceToNetwork(networkName, this.deviceName);
	};

	this.leaveNetwork = function()
	{
		admin.removeDeviceFromCurrentNetwork(this.deviceName); // To be
		// implemented
	};

	this.returnNetwork = function()
	{

		admin.returnDeviceToPreviousNetwork(this.deviceName); // To be
		// implemented
	};

	this.replicateRDT = function(rdt)
	{
		// Register a replicated data type in the device
	};

	this.accessRDT = function()
	{
		// Access the previously registered replicated data type in the device
	};
}

function Administrator(username, password)
{
	this.username = username;
	this.password = password;
}

exports.Administrator = Administrator;
exports.Network = Network;
exports.Device = Device;
exports.NetworkIterator = NetworkIterator;
exports.DeviceIterator = DeviceIterator;
