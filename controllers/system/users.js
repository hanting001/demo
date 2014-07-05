var passport = require('passport');
var auth = require('../../lib/auth');
var User = require('../../models/system/User');
<<<<<<< HEAD
module.exports = function (app) {
	app.get('/system/users/signup', function(req, res) {
=======
var UserInfo = require('../../models/UserInfo');
var Role = require('../../models/system/Role');
module.exports = function(app) {
	app.get('/system/auth/users/signup', function(req, res) {
>>>>>>> 364f83975fe2c48da3faa207d1041957edb32ed6
		// render the page and pass in any flash data if it exists
		res.render('system/users/signupForm', {
			title: '注册用户',
			message: req.flash('error')
		});
	});
<<<<<<< HEAD
	
	app.post('/system/users/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/users', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	app.get('/system/users', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next){
=======

	app.post('/system/auth/users/signup', passport.authenticate('local-signup', {
		successRedirect: '/', // redirect to the secure profile section
		failureRedirect: '/users', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	app.get('/system/auth/users', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
>>>>>>> 364f83975fe2c48da3faa207d1041957edb32ed6
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		User.paginate({}, page, 10, function(err, pageCount, users) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '用户列表',
				users: users,
				page: page,
				pageCount: pageCount,
				showMessage: req.flash('showMessage')
			};
			res.render('system/users/index', model);
		}, {
			populate: 'userInfo',
			sortBy: {
				name: 1
			}
		});
	});

	app.get('/system/auth/users/:name/delete', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var name = req.params.name;
		User.findOneAndRemove({
			name: name
		}, function(err, user) {
			if (err) {
				return next(err);
			}
			UserInfo.findByIdAndRemove(user.userInfo, function(err, userInfo) {
				if (err) {
					return next(err);
				}
				res.json({
					message: '用户' + user.fullName + '已成功删除'
				});
			});
		});
	});

	app.get('/system/auth/users/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {
			title: '新增用户',
			showMessage: req.flash('showMessage')
		};

		Role.find({}, function(err, roles) {
			if (err) {
				return next(err);
			}
			model.roles = roles;
			console.log(roles);
			res.render('system/users/add', model);
		});


		
	});
};