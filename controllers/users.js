/**
 * New node file
 */
var passport = require('passport');

module.exports = function (app) {
	app.get('/users', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('users/form', {
			title : '注册用户',
			message: req.flash('error') });
	});
	
	app.post('/users', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/users', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
};