/*
 * GET home page.
 */

exports.indexRoute = function(req, res) {
	res.render('index', {
		title : 'Express'
	});
};

exports.userHomeRoute = function(req, res) {
	res.render('userHome');
};

exports.adminHomeRoute = function(req, res) {
	res.render('adminHome');
};
exports.networkSettings = function(req, res) {
	res.render('networkSettings');
};