var passport = require('passport');
var auth = require('../../lib/auth');
var User = require('../../models/system/User');
module.exports = function (app) {
	app.get('/system/auth/users/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('system/users/signupForm', {
			title : '注册用户',
			message: req.flash('error') });
	});
	
	app.post('/system/auth/users/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/users', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	app.get('/system/auth/users', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next){
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		User.paginate({}, page, 10, function(err, pageCount, users) {
			if (err) {
				return next(err);
			}
			var model = {
					title : '用户列表',
					users : users,
					page : page,
					pageCount : pageCount,
					showMessage : req.flash('showMessage')
				};
			res.render('system/users/index', model);
		}, { sortBy : { createdAt : -1 } });
	});
};