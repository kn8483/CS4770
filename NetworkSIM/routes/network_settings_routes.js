var admin = require('./simulation/admin');

exports.importRDTRoute = function(req, res) {
	admin.importRDT(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};

exports.removeRDTRoute = function(req, res) {
	admin.removeRDT(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};

exports.importAppRoute = function(req, res) {
	admin.importApp(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};

exports.removeAppRoute = function(req, res) {
	admin.removeApp(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};

exports.addNetworkRoute = function(req, res) {
	admin.addNetwork(req.body.networkName, req.body.networkKind);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};
exports.removeNetworkRoute = function(req, res) {
	admin.removeNetwork(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};
exports.addDeviceRoute = function(req, res) {
	admin.addDevice(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};
exports.removeDeviceRoute = function(req, res) {
	admin.removeDevice(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};
exports.addDeviceToNetworkRoute = function(req, res) {
	admin.addDeviceToNetwork(req.body.networkName, req.body.deviceName);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};
exports.removeDeviceFromNetworkRoute = function(req, res) {
	admin.removeDeviceFromNetwork(req.body.networkName, req.body.deviceName);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};
exports.connectTwoNetworksRoute = function(req, res) {
	admin.connectTwoNetworks(req.body.network1Name, req.body.network1Name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};

exports.disconnectTwoNetworksRoute = function(req, res) {
	admin.disconnectTwoNetworks(req.body.network1Name, req.body.network1Name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};

exports.removeDeviceFromCurrentNetworkRoute = function(req, res) {
	admin.removeDeviceFromCurrentNetwork(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};

exports.returnDeviceToPreviousNetworkRoute = function(req, res) {
	admin.returnDeviceToPreviousNetwork(req.body.name);
	res.render('network_settings.hjs', admin.getHoganTemplateVariables());
};
