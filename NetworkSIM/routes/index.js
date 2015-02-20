/*
 * GET home page.
 */

exports.indexRoute = function(req, res) {
	res.render('index', {
		title : 'Express'
	});
};