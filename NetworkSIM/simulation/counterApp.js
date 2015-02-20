var mongo = require('mongojs');
var db = mongo('simdb');
var ncoll = db.collection('networks');
var dcoll = db.collection('devices');

exports.increment = function increment(token) {
	var device = dcoll.findOne({
		"_id.str" : token
	});
	if (!device.localCount) {
		device.localCount = 1;
	} else {
		device.localCount += 1;
	}
	dcoll.save(device);
}

exports.decrement = function decrement(token) {
	var device = dcoll.findOne({
		"_id.str" : token
	});
	if (!device.localCount) {
		device.localCount = -1;
	} else {
		device.localCount -= 1;
	}
	dcoll.save(device);
}